"""
This module contains the RasterProcessor class which is used to style raster data using a QML
file and convert it to MBTiles format.
"""

import os
from pathlib import Path

import geopandas as gpd
import numpy as np
import rasterio
import rasterio.mask
from rich.console import Console

from helpers.cog_converter import COGConverter
from helpers.mapbox_uploader import upload_to_mapbox
from helpers.mbtiles_converter import MBTilesConverterFactory
from helpers.qml_parser import QMLParser

console = Console()


class RasterProcessor:
    """
    A class to style raster data using a QML file and convert it to MBTiles format.
    """

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
        Initialize the RasterProcessor object.

        Args:
            input_file (Path): The path to the raster file.
            qml_file (Path): The path to the QML file.
            output_file (Path): The path where the output file will be saved.
            layer_name (str): Optional name for the layer.
            upload (bool): Whether to upload the processed file to Mapbox.
            create_mbtiles (bool): Whether to create an MBTiles file.
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

    def clip_raster(self) -> Path:
        """
        Clip the raster with the provided vector file using rasterio and geopandas.

        Returns:
            Path: Path to the clipped raster file.
        """
        if not self.vector_file:
            return self.input_file

        try:
            vector_gdf = gpd.read_file(self.vector_file)
            clipped_output = self.output_file.parent / f"clipped_{self.input_file.name}"

            with rasterio.open(self.input_file) as src:
                if vector_gdf.crs != src.crs:
                    console.print(
                        f"🔄 Reprojecting vector from {vector_gdf.crs} to {src.crs}",
                        style="bold blue",
                    )
                    vector_gdf = vector_gdf.to_crs(src.crs)

                geometries = vector_gdf.geometry.values

                original_nodata = src.nodata
                if original_nodata is None:
                    nodata_value = -9999.0 if src.dtypes[0] in ["float32", "float64"] else -9999
                else:
                    nodata_value = original_nodata

                out_image, out_transform = rasterio.mask.mask(
                    src, geometries, crop=True, filled=True, nodata=nodata_value
                )

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

    def apply_styles(self, raster_path: Path = None) -> Path:
        """
        Apply the QML colormap to the raster and write an RGBA GeoTIFF.

        Supports all three QML renderer modes:
        - DISCRETE: items are upper-bound range stops (np.searchsorted)
        - INTERPOLATED: colors linearly interpolated between stops (np.interp)
        - PALETTE / EXACT: exact integer value → color lookup

        Nodata pixels are set to fully transparent (alpha=0).

        Args:
            raster_path (Path): Optional path to the raster file. Falls back to
                                the clipped raster or the original input file.

        Returns:
            Path: Path to the output RGBA GeoTIFF.
        """
        file_path = raster_path or self.clipped_raster_path or self.input_file

        try:
            mode, entries = QMLParser.parse_full(str(self.qml_file))
            if not entries:
                raise ValueError(f"No color entries found in {self.qml_file}")

            with rasterio.open(file_path) as src:
                data = src.read(1).astype(np.float64)
                nodata = src.nodata
                meta = src.meta.copy()

            height, width = data.shape
            rgba = np.zeros((4, height, width), dtype=np.uint8)

            values = np.array([e.value for e in entries])
            r_stops = np.array([e.r for e in entries])
            g_stops = np.array([e.g for e in entries])
            b_stops = np.array([e.b for e in entries])
            a_stops = np.array([e.a for e in entries])

            if mode == "INTERPOLATED":
                flat = data.ravel()
                rgba[0] = np.interp(flat, values, r_stops).reshape(height, width).astype(np.uint8)
                rgba[1] = np.interp(flat, values, g_stops).reshape(height, width).astype(np.uint8)
                rgba[2] = np.interp(flat, values, b_stops).reshape(height, width).astype(np.uint8)
                rgba[3] = np.interp(flat, values, a_stops).reshape(height, width).astype(np.uint8)

            elif mode == "DISCRETE":
                # Each item value is an upper bound; assign the first stop >= pixel value
                indices = np.searchsorted(values, data.ravel(), side="left")
                indices = np.clip(indices, 0, len(entries) - 1).reshape(height, width)
                rgba[0] = r_stops[indices]
                rgba[1] = g_stops[indices]
                rgba[2] = b_stops[indices]
                rgba[3] = a_stops[indices]

            else:  # PALETTE / EXACT
                for entry in entries:
                    mask = data == entry.value
                    rgba[0][mask] = entry.r
                    rgba[1][mask] = entry.g
                    rgba[2][mask] = entry.b
                    rgba[3][mask] = entry.a

            # Nodata → transparent
            if nodata is not None:
                rgba[3][data == nodata] = 0

            meta.update({"driver": "GTiff", "dtype": "uint8", "count": 4, "nodata": None})

            with rasterio.open(self.output_file, "w", **meta) as dst:
                dst.write(rgba)

        except Exception as e:
            console.print(f"❌ Error applying styles: {e}", style="bold red")
            raise

        return self.output_file

    def process(self):
        """
        Process the raster data: optionally clip with vector, apply styles,
        convert to COG, and optionally to MBTiles and upload to Mapbox.
        """
        try:
            if self.vector_file:
                console.print("✂️ Clipping raster with vector...", style="bold white")
                self.clip_raster()

            console.print("🎨 Applying styles...", style="bold white")
            geotiff_path = self.apply_styles()

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
