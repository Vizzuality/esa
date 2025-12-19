"""
Helper functions for raster operations.
"""

import rasterio
from rasterio.io import MemoryFile
from rasterio.warp import Resampling, calculate_default_transform, reproject


def open_raster_in_4326(input_path):
    """Open a raster file and reproject it to EPSG:4326 if it's not already in that CRS.

    Args:
        input_path (str): The file path to the input raster.

    Returns:
        rasterio.io.DatasetReader: The opened (and possibly reprojected) raster dataset.
    """
    with rasterio.open(input_path) as src:
        if src.crs == "EPSG:4326":
            print("Already in EPSG:4326")
            return src

        transform, width, height = calculate_default_transform(
            src.crs, "EPSG:4326", src.width, src.height, *src.bounds
        )

        kwargs = src.meta.copy()
        kwargs.update(
            {"crs": "EPSG:4326", "transform": transform, "width": width, "height": height}
        )

        # Create in-memory raster
        memfile = MemoryFile()
        dst = memfile.open(**kwargs)

        for i in range(1, src.count + 1):
            reproject(
                source=rasterio.band(src, i),
                destination=rasterio.band(dst, i),
                src_transform=src.transform,
                src_crs=src.crs,
                dst_transform=transform,
                dst_crs="EPSG:4326",
                resampling=Resampling.nearest,
            )

    return dst
