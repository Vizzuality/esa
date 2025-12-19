"""
Module for creating animated tiles
"""

import glob
import io
import os
import re
import shutil
import warnings
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Optional, Tuple

import dask
import mercantile
import numpy as np
import rasterio
import xarray as xr
from PIL import Image
from rich.console import Console
from rich.live import Live
from rich.spinner import Spinner
from rio_tiler.colormap import ColorMapType
from rio_tiler.errors import TileOutsideBounds
from rio_tiler.io import Reader, XarrayReader

from helpers.raster_ops import open_raster_in_4326

from .utils import clip_rasters_by_vector, create_apngs

# Suppress specific warnings from rasterio
warnings.filterwarnings("ignore", category=rasterio.errors.NotGeoreferencedWarning)

# Initialize console for rich output
console = Console()


class AnimatedTiles:
    """
    Class for creating animated tiles.

    Attributes:
    data (str or xarray.DataArray): The data to be animated.
    output_folder (str): The name of the local folder where the animated tiles will be exported.
    min_z (int, optional): The minimum zoom level. Defaults to 0.
    max_z (int, optional): The maximum zoom level. Defaults to 12.
    color_map (rio_tiler.colormap.ColorMapType, optional): The colormap to use. Defaults to None.
    vmin (float, optional): The minimum value for the colormap. Defaults to 0.
    vmax (float, optional): The maximum value for the colormap. Defaults to 30000.
    engine (str, optional): The engine to use. Defaults to "xarray".
    vector_file (Path, optional): Path to a vector file for clipping rasters
        (only for rasterio engine). Defaults to None.
    """

    def __init__(
        self,
        data,
        output_folder: Path,
        min_z: int = 0,
        max_z: int = 12,
        color_map: ColorMapType = None,
        vmin: float = 0,
        vmax: float = 30000,
        engine: str = "xarray",
        vector_file: Path = None,
    ):
        """
        Initializes the AnimatedTiles class.
        """
        self.engine = engine
        self.engine_class = {"xarray": XArrayEngine, "rasterio": RasterioEngine}.get(engine)
        if not self.engine_class:
            raise ValueError(f"Unsupported engine: {engine}")
        self.engine_instance = self.engine_class(
            data, output_folder, min_z, max_z, color_map, vmin, vmax, vector_file
        )

    def create(self, time_coord="time"):
        """
        Create animated-tiles.
        """
        console.print("🎬 Creating animated tiles...", style="bold green")
        if self.engine == "rasterio":
            self.engine_instance.generate_tiles()
        elif self.engine == "xarray":
            self.engine_instance.generate_tiles(time_coord)
        console.print("🎨 Creating APNGs...", style="bold blue")
        create_apngs(self.engine_instance.output_folder)
        console.print("✅ All animated tiles created successfully!", style="bold green")


# Define a base class for tile engines
class TileEngine:
    """ "
    Represents a base class for tile engines.
    """

    TILE_SIZE = 256

    def __init__(
        self,
        data,
        output_folder: Path,
        min_z: int = 0,
        max_z: int = 12,
        color_map: Optional[ColorMapType] = None,
        vmin: float = 0,
        vmax: float = 30000,
        vector_file: Optional[Path] = None,
    ):
        """
        Initialize the BaseTiler class.

        Attributes:
        data (str or xarray.DataArray): The data to be animated.
        output_folder (str): The name of the local folder where the animated tiles will be exported.
        min_zz (int, optional): The min_zmum zoom level. Defaults to 0.
        max_z (int, optional): The maximum zoom level. Defaults to 12.
        color_map (dict or sequence, optional): RGBA Color Table dictionary or sequence.
        vmin (float): The minimum value for rescaling the data.
        vmax (float): The maximum value for rescaling the data.
        vector_file (Path, optional): Path to a vector file for clipping the rasters.
        """
        self.data = data
        self.output_folder = output_folder
        self.min_z = min_z
        self.max_z = max_z
        self.zooms = list(np.arange(min_z, max_z + 1))
        self.color_map = color_map
        self.vmin = vmin
        self.vmax = vmax
        self.vector_file = vector_file

    def generate_tiles(self, time_coord=None):
        """
        Generate tiles from the data.
        """
        raise NotImplementedError("This method should be implemented by subclasses.")


# Define a class for the rasterio engine
class RasterioEngine(TileEngine):
    """
    Represents a rasterio tiler.
    """

    def __init__(self, *args, **kwargs):
        """
        Initialize the RasterioEngine class.
        """
        super().__init__(*args, **kwargs)
        if not (isinstance(self.data, str) and os.path.isdir(self.data)):
            raise ValueError(
                "For engine 'rasterio', 'data' must be a valid directory or file path."
            )

        # Track the clipped folder for cleanup
        self.clipped_folder_path = None

        # Handle clipping if vector_file is provided
        if self.vector_file:
            self._perform_clipping()

    def _perform_clipping(self):
        """
        Clip all rasters in the data folder using the provided vector file.
        """
        console.print("✂️ Clipping rasters with vector file...", style="bold blue")

        # Create a new folder for clipped rasters
        input_folder = Path(self.data)
        clipped_folder = input_folder.parent / f"{input_folder.name}_clipped"

        # Store the clipped folder path for cleanup
        self.clipped_folder_path = clipped_folder

        # Perform clipping
        clipped_path = clip_rasters_by_vector(
            input_folder=input_folder, vector_file=self.vector_file, output_folder=clipped_folder
        )

        # Update the data path to use clipped rasters
        self.data = str(clipped_path)

    def _cleanup_clipped_rasters(self):
        """
        Remove the temporary clipped rasters folder.
        """
        if self.clipped_folder_path and self.clipped_folder_path.exists():
            shutil.rmtree(self.clipped_folder_path)
            console.print(
                f"🧹 Cleaned up temporary clipped rasters: {self.clipped_folder_path}",
                style="bold blue",
            )

    def _create_tile(
        self,
        tile: mercantile.Tile = None,
        tif_file_path: str = None,
        n: int = 0,
        num_bands: int = 4,
        indexes: Optional[Tuple[int, ...]] = (1, 2, 3, 4),
        colormap: Optional[ColorMapType] = None,
    ):
        """
        Generate a PNG tile from a GeoTIFF file using rio-tiler.

        Args:
            tile (mercantile.Tile): A mercantile tile object.
            tif_file_path (str): The file path to the GeoTIFF file.
            n (int): The index of the GeoTIFF file in the list of files.
            num_bands (int): The number of bands in the GeoTIFF file.
            indexes (int or sequence of int, optional): Band indexes.
            colormap (dict or sequence, optional): RGBA Color Table dictionary or sequence.
            vmin (float): The minimum value for rescaling the data.
            vmax (float): The maximum value for rescaling the data.
        """
        try:
            with Reader(tif_file_path) as dst:
                # Get the tile data and mask
                img = dst.tile(tile.x, tile.y, tile.z, indexes=indexes, tilesize=self.TILE_SIZE)
                # Convert the data to an image
                if num_bands == 1:
                    # Rescale the data linearly from vmin-vmax to 0-255
                    img.rescale(in_range=((self.vmin, self.vmax),), out_range=((0, 255),))
                    # Apply colormap and create a PNG buffer
                    buff = img.render(colormap=colormap, add_mask=True)
                else:
                    buff = img.render(add_mask=True)

                # Open the image from the buffer
                image = Image.open(io.BytesIO(buff))

                # Save the image as a PNG
                number = "{:03d}".format(n)
                tile_dir = os.path.join(self.output_folder, str(tile.z), str(tile.x))
                tile_file = os.path.join(tile_dir, f"{tile.y}_{number}.png")
                os.makedirs(tile_dir, exist_ok=True)
                image.save(tile_file, "PNG")
        except TileOutsideBounds:
            pass
        except Exception as e:
            print(f"An error occurred while generating tiles: {e}")

    def _create_tile_wrapper(self, tile):
        self._create_tile(
            tile,
            tif_file_path=self.tif_file_path,
            n=self.n,
            num_bands=self.num_bands,
            indexes=self.indexes,
            colormap=self.color_map,
        )

    def generate_tiles(self):
        """
        Generate tiles from a GeoTIFF files.
        """
        tif_files = (
            glob.glob(os.path.join(self.data, "*.tif"))
            + glob.glob(os.path.join(self.data, "*.tiff"))
        )

        # Sort files by extracting year from filename pattern
        # like "CAMS_NO21KM_2019_yearly_mean.tif"
        def extract_year(filename):
            match = re.search(r'(\d{8})', os.path.basename(filename))
            return int(match.group(1)) if match else 0

        sorted_files = [
            (os.path.basename(f), extract_year(f))
            for f in sorted(tif_files, key=extract_year)
        ]

        with Live(console=console, refresh_per_second=10) as live:
            for self.n, sorted_file in enumerate(sorted_files):
                # Update spinner with current tile info
                live.update(
                    Spinner(
                        "dots",
                        text=f"Generating tiles for frame {self.n + 1}/\
                            {len(sorted_files)}: {sorted_file[0]}",
                    )
                )

                # Get the GeoTIFF file
                tif_file = sorted_file[0]
                self.tif_file_path = os.path.join(self.data, tif_file)

                if self.n == 0:
                    # Open the GeoTIFF file
                    with open_raster_in_4326(self.tif_file_path) as src:
                        # Get the bounding box
                        bbox = list(src.bounds)
                        # Get the count of bands
                        self.num_bands = src.count

                    # Calculate the tiles within the bounding box at the given zoom level
                    tiles = list(
                        mercantile.tiles(bbox[0], bbox[1], bbox[2], bbox[3], zooms=self.zooms)
                    )

                    # Set the indexes parameter based on the number of bands
                    self.indexes = (1, 2, 3, 4) if self.num_bands == 4 else None

                # Using ThreadPoolExecutor to parallelize the process
                with ThreadPoolExecutor() as executor:
                    executor.map(self._create_tile_wrapper, tiles)

        # Clean up clipped rasters folder if it was created
        self._cleanup_clipped_rasters()


# Define a class for the xarray engine
class XArrayEngine(TileEngine):
    """
    Represents an xarray tiler.
    """

    def __init__(self, *args, **kwargs):
        """
        Initialize the XarrayEngine class.
        """
        super().__init__(*args, **kwargs)
        if not isinstance(self.data, xr.DataArray):
            raise ValueError("For engine 'xarray', 'data' must be an xarray.DataArray.")

        # Note: vector_file parameter is ignored for xarray engine
        if self.vector_file:
            console.print(
                "⚠️ vector_file parameter is only supported with 'rasterio' engine. Ignoring.",
                style="bold yellow",
            )

    def _create_tile(
        self,
        tile: mercantile.Tile = None,
        da: xr.DataArray = None,
        n: int = 0,
        colormap: Optional[ColorMapType] = None,
    ):
        """
        Generate a PNG tile from a xarray DataArray using rio-tiler.

        Args:
            tile (mercantile.Tile): A mercantile tile object.
            n (int): The index of the GeoTIFF file in the list of files.
            num_bands (int): The number of bands in the GeoTIFF file.
            indexes (int or sequence of int, optional): Band indexes.
            colormap (dict or sequence, optional): RGBA Color Table dictionary or sequence.
            vmin (float): The minimum value for rescaling the data.
            vmax (float): The maximum value for rescaling the data.
        """
        try:
            with XarrayReader(da) as dst:
                # Get the tile data and mask
                img = dst.tile(tile.x, tile.y, tile.z, tilesize=self.TILE_SIZE)
                # Convert the data to an image
                # Rescale the data linearly from 0-10000 to 0-255
                img.rescale(in_range=((self.vmin, self.vmax),), out_range=((0, 255),))
                # Apply colormap and create a PNG buffer
                buff = img.render(colormap=colormap, add_mask=True)
                # Open the image from the buffer
                image = Image.open(io.BytesIO(buff))

                # Save the image as a PNG
                number = "{:03d}".format(n)
                tile_dir = os.path.join(self.output_folder, str(tile.z), str(tile.x))
                tile_file = os.path.join(tile_dir, f"{tile.y}_{number}.png")
                os.makedirs(tile_dir, exist_ok=True)
                image.save(tile_file, "PNG")
        except TileOutsideBounds:
            pass
        except Exception as e:
            print(f"An error occurred while generating tiles: {e}")

    def _worker_create_tiles(self, da, n, tiles):
        for tile in tiles:
            self._create_tile(
                tile,
                da,
                n,
                self.color_map,
            )

    def _get_slice_data(self, time, time_coord="time"):
        """Slice the raster dataset based on the time coordinate."""
        da = self.data.isel({time_coord: time}).copy()
        return da

    def generate_tiles(self, time_coord="time"):
        """
        Generate tiles from a xarray array.
        """
        # Get the time coordinates
        time_coords = self.data[time_coord].values
        # Get the bounding box
        bbox = list(self.data.rio.bounds())

        # Calculate the tiles within the bounding box at the given zoom level
        tiles = list(mercantile.tiles(bbox[0], bbox[1], bbox[2], bbox[3], zooms=self.zooms))

        tasks = [
            dask.delayed(self._worker_create_tiles)(self._get_slice_data(n, time_coord), n, tiles)
            for n in range(len(time_coords))
        ]

        with Live(
            Spinner("dots", text=f"Processing {len(time_coords)} time frames with dask..."),
            console=console,
        ):
            dask.compute(*tasks)
