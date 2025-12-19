"""
This module contains the StyledRasterProcessor class which is used to style raster data using a QML
file and convert it to MBTiles format.
"""

import os
from pathlib import Path

import geopandas as gpd
import rasterio
import rasterio.mask
from qgis.core import (
    QgsApplication,
    QgsRasterFileWriter,
    QgsRasterLayer,
    QgsRasterPipe,
)
from rich.console import Console

from helpers.cog_converter import COGConverter
from helpers.mapbox_uploader import upload_to_mapbox
from helpers.mbtiles_converter import MBTilesConverterFactory

# Initialize console for rich output
console = Console()


class RasterProcessor:
    """
    A class to style raster data using a QML file and convert it to MBTiles format.
    """

    _qgs_initialized = False
    _qgs = None

    def __init__(
        self,
        input_file: Path,
        qml_file: Path,
        output_file: Path,
        layer_name: str = None,
        upload: bool = True,
        create_mbtiles: bool = True,
        vector_file: Path = None,
        max_zoom: int = None,
    ):
        """
        Initialize the StyledRasterProcessor object.

        Args:
            input_file (Path): The path to the raster file.
            qml_file (Path): The path to the QML file.
            output_file (Path): The path where the output file will be saved.
            layer_name (str): Optional name for the layer.
            upload (bool): Whether to upload the processed file to Mapbox.
            vector_file (Path): Optional path to a shapefile for clipping the raster.
            max_zoom (int): Maximum zoom level for COG conversion.
        """
        self.input_file = input_file
        self.qml_file = qml_file
        self.output_file = output_file
        self.layer_name = layer_name
        self.upload = upload
        self.create_mbtiles = create_mbtiles
        self.vector_file = vector_file
        self.max_zoom = max_zoom
        self.clipped_raster_path = None
        self._init_qgis()

    @classmethod
    def _init_qgis(cls):
        """Initialize QGIS application once."""
        if not cls._qgs_initialized:
            QgsApplication.setPrefixPath("/usr", True)
            cls._qgs = QgsApplication([], False)
            cls._qgs.initQgis()
            cls._qgs_initialized = True

    def clip_raster(self) -> Path:
        """
        Clip the raster with the provided vector file using rasterio and geopandas.

        Returns:
            Path: Path to the clipped raster file.
        """
        if not self.vector_file:
            return self.input_file

        try:
            # Load the vector file
            vector_gdf = gpd.read_file(self.vector_file)

            # Define the output path for the clipped raster
            clipped_output = self.output_file.parent / f"clipped_{self.input_file.name}"

            # Open the raster file
            with rasterio.open(self.input_file) as src:
                # Reproject vector to match raster CRS if needed
                if vector_gdf.crs != src.crs:
                    console.print(
                        f"🔄 Reprojecting vector from {vector_gdf.crs} to {src.crs}",
                        style="bold blue",
                    )
                    vector_gdf = vector_gdf.to_crs(src.crs)

                # Get the geometries for masking
                geometries = vector_gdf.geometry.values

                # Get the original nodata value or set a default one
                original_nodata = src.nodata
                if original_nodata is None:
                    # Set nodata value based on data type
                    if src.dtypes[0] in ["float32", "float64"]:
                        nodata_value = -9999.0
                    else:
                        nodata_value = -9999
                else:
                    nodata_value = original_nodata

                # Clip the raster with nodata for areas outside the mask
                out_image, out_transform = rasterio.mask.mask(
                    src, geometries, crop=True, filled=True, nodata=nodata_value
                )

                # Update metadata
                out_meta = src.meta.copy()
                out_meta.update(
                    {
                        "driver": "GTiff",
                        "height": out_image.shape[1],
                        "width": out_image.shape[2],
                        "transform": out_transform,
                        "nodata": nodata_value,
                    }
                )

                # Write the clipped raster
                with rasterio.open(clipped_output, "w", **out_meta) as dest:
                    dest.write(out_image)

            self.clipped_raster_path = clipped_output
            console.print(
                f"✅ Raster clipped successfully: {self.clipped_raster_path}", style="bold green"
            )
            return self.clipped_raster_path

        except Exception as e:
            console.print(f"❌ Error clipping raster: {e}", style="bold red")
            return self.input_file

    def apply_styles(self, raster_path: Path = None) -> QgsRasterLayer:
        """
        Apply styles from the QML file to the raster data.

        Args:
            raster_path (Path): Optional path to the raster file. If not provided,
                               uses the clipped raster if available, otherwise the
                               original input file.
        """
        try:
            # Determine which raster file to use
            if raster_path:
                file_path = raster_path
            elif self.clipped_raster_path:
                file_path = self.clipped_raster_path
            else:
                file_path = self.input_file

            # Load the raster layer
            raster_layer = QgsRasterLayer(file_path.as_posix(), "layer.name")

            # Check if the layer is valid
            if not raster_layer.isValid():
                print("Layer failed to load!")
            else:
                # Apply style from QML file
                raster_layer.loadNamedStyle(self.qml_file.as_posix())

        except Exception as e:
            print(f"An error occurred: {e}")

        return raster_layer

    def convert_to_geotiff(self, raster_layer: QgsRasterLayer) -> Path:
        """
        Convert the styled raster data to a GeoTIFF file.
        """
        try:
            # Save the styled layer as GeoTIFF
            file_writer = QgsRasterFileWriter(self.output_file.as_posix())

            # Retrieve layer's renderer and provider
            renderer = raster_layer.renderer()
            provider = raster_layer.dataProvider()

            # Define parameters for writing the file
            pipe = QgsRasterPipe()
            pipe.set(provider.clone())
            pipe.set(renderer.clone())

            # Write the raster layer to a GeoTIFF file
            error = file_writer.writeRaster(
                pipe,
                provider.xSize(),
                provider.ySize(),
                provider.extent(),
                provider.crs(),
            )

            if error != QgsRasterFileWriter.NoError:
                print("Error writing GeoTIFF:", file_writer.error())

        except Exception as e:
            print(f"An error occurred: {e}")

        return self.output_file

    def __del__(self):
        """Cleanup QGIS when the last instance is destroyed."""
        if self._qgs_initialized:
            self._qgs.exitQgis()

    def process(self):
        """
        Process the raster data: optionally clip with vector, apply styles,
        convert to GeoTIFF, and then to MBTiles.
        """
        try:
            # Clip raster if vector file is provided
            if self.vector_file:
                console.print("✂️ Clipping raster with vector...", style="bold white")
                self.clip_raster()

            console.print("🎨 Applying styles...", style="bold white")
            raster_layer = self.apply_styles()

            console.print("🗺️ Converting to GeoTIFF...", style="bold white")
            geotiff_path = self.convert_to_geotiff(raster_layer)

            console.print("☁️ Converting to Cloud-Optimized GeoTIFF...", style="bold white")
            COGConverter.convert(geotiff_path, geotiff_path, max_zoom=self.max_zoom)
            console.print(
                f"✅ COG conversion complete. Output saved to {geotiff_path}", style="bold green"
            )
            if self.create_mbtiles:
                console.print("📦 Converting to MBTiles...", style="bold white")
                mbtiles_path = geotiff_path.with_suffix(".mbtiles")
                MBTilesConverterFactory.convert(geotiff_path, mbtiles_path)
                console.print(
                    f"✅ Processing complete. Output saved to {mbtiles_path}", style="bold green"
                )
            ## Remove the GeoTIFF file after conversion
            # os.remove(geotiff_path)

            # Clean up clipped raster if it was created
            if self.clipped_raster_path and self.clipped_raster_path.exists():
                os.remove(self.clipped_raster_path)
                console.print("🧹 Cleaned up temporary clipped raster file", style="bold blue")

            if self.upload and self.create_mbtiles:
                console.print("☁️ Uploading to Mapbox...", style="bold white")
                upload_to_mapbox(
                    source=mbtiles_path,
                    display_name=self.layer_name or mbtiles_path.stem,
                    username=os.getenv("MAPBOX_USER"),
                    token=os.getenv("MAPBOX_TOKEN"),
                )
        except Exception as e:
            console.print(f"❌ Error processing raster: {e}", style="bold red")
            raise
