"""
This module contains utility functions for data processing tasks such as creating APNGs,
clipping rasters by vector files, merging TIFFs, resampling rasters, converting CSV to JSON,
and reprojecting rasters.
"""

import json
import os
import re
import subprocess
import tempfile
from glob import glob
from pathlib import Path
from typing import Dict, List, Tuple

import geopandas as gpd
import matplotlib
import numpy as np
import pandas as pd
import rasterio
import rasterio.mask
from apng import APNG
from rasterio.mask import mask
from rasterio.merge import merge
from rasterio.warp import Resampling, calculate_default_transform, reproject
from rasterio.windows import Window


def create_apngs(tile_dir: Path):
    """
    Create APNGs from the tiles.

    Attributes:
        tile_dir (str): The name of the local folder where the animated tiles will be exported.
    """
    for z_dir in os.listdir(tile_dir):
        for x_dir in os.listdir(os.path.join(tile_dir, z_dir)):
            file_names = os.listdir(os.path.join(tile_dir, z_dir, x_dir))

            tiles = [x.split("_")[0] for x in file_names]
            tiles = list(set(tiles))
            for tile in tiles:
                png_files = list(filter(lambda x: x.split("_")[0] == tile, file_names))
                png_files = sorted(png_files, key=lambda x: float(x.split(".")[0]))
                png_files = [os.path.join(tile_dir, z_dir, x_dir, i) for i in png_files]
                # Create APNG
                APNG.from_files(png_files, delay=1).save(png_files[0][:-8] + ".png")
                # Remove PNGs
                [os.remove(file) for file in png_files]


# def get_files_with_years(input_folder):
#     """
#     Get a list of all files in the directory sorted by year.

#     Returns:
#     list: A list of tuples, where each tuple contains the filename and the year.
#     """
#     # Get a list of all files in the directory
#     files = os.listdir(input_folder)
#     # Create a list of tuples, where each tuple contains the filename and the year
#     files_with_years = [
#         (f, int(re.search(r"(\d{4})\.tif$", f).group(1)))
#         for f in files
#         if re.search(r"(\d{4})\.tif$", f)
#     ]
#     # Sort the list of tuples based on the year
#     sorted_files = sorted(files_with_years, key=lambda x: x[1])
#     return sorted_files

def get_files_with_years(input_folder):
    """
    Get a list of all files in the directory sorted by full date (YYYYMMDD).
    """
    files = os.listdir(input_folder)
    files_with_dates = [
        (f, int(re.search(r"_(\d{8})\.tif$", f).group(1)))
        for f in files
        if re.search(r"_(\d{8})\.tif$", f)
    ]
    sorted_files = sorted(files_with_dates, key=lambda x: x[1])
    return sorted_files



def create_linear_segmented_colormap(colors_list: List[str]) -> Dict[int, Tuple[int, int, int]]:
    """
    Create a linear segmented colormap.

    Attributes:
        colors_list (list): A list of colors.
    """
    colors = matplotlib.colors.LinearSegmentedColormap.from_list("colors", colors_list, 256)

    x = np.linspace(0, 1, 256)
    cmap_vals = colors(x)[:, :]
    cmap_uint8 = (cmap_vals * 255).astype("uint8")
    cm = {idx: tuple(value) for idx, value in enumerate(cmap_uint8)}

    return cm


def clip_rasters_by_vector(input_folder: Path, vector_file: Path, output_folder: Path) -> Path:
    """
    Clip all rasters in a folder by a vector file and save them to a new folder.

    Args:
        input_folder (Path): Path to the folder containing the raster files.
        vector_file (Path): Path to the vector file for clipping.
        output_folder (Path): Path to the output folder for clipped rasters.

    Returns:
        Path: Path to the output folder containing clipped rasters.
    """
    from rich.console import Console

    console = Console()

    # Create output folder if it doesn't exist
    output_folder.mkdir(parents=True, exist_ok=True)

    try:
        # Load the vector file
        vector_gdf = gpd.read_file(vector_file)

        # Get list of raster files
        raster_files = [f for f in input_folder.glob("*.tif") if f.is_file()]

        if not raster_files:
            console.print(f"❌ No .tif files found in {input_folder}", style="bold red")
            return input_folder

        for raster_file in raster_files:
            try:
                # Define output path
                clipped_output = output_folder / raster_file.name

                # Open the raster file
                with rasterio.open(raster_file) as src:
                    # Reproject vector to match raster CRS if needed
                    if vector_gdf.crs != src.crs:
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

            except Exception as e:
                console.print(f"  ❌ Error clipping {raster_file.name}: {e}", style="bold red")
                continue

        console.print(f"✅ Clipping complete. Output folder: {output_folder}", style="bold green")
        return output_folder

    except Exception as e:
        console.print(f"❌ Error during clipping process: {e}", style="bold red")
        return input_folder



def merge_tifs(folder_path, output_file, pattern="*.tif", nodata_value=0):
    """
    Merge all TIFs in a folder and save to a single file without loading everything into memory.
    """
    folder_path = Path(folder_path)
    tif_files = glob(str(folder_path / pattern))
    if not tif_files:
        raise FileNotFoundError(f"No TIFF files found in {folder_path} with pattern {pattern}")

    src_files = [rasterio.open(fp) for fp in tif_files]

    # Merge lazily
    mosaic, out_trans = merge(src_files)

    mosaic = mosaic.astype("uint8")

    out_meta = src_files[0].meta.copy()
    out_meta.update({
        "driver": "GTiff",
        "height": mosaic.shape[1],
        "width": mosaic.shape[2],
        "transform": out_trans,
        "nodata": nodata_value,
        "dtype": "uint8",
        "compress": "LZW",
        "predictor": 2,
        "tiled": True,
        "blockxsize": 256,
        "blockysize": 256,
    })

    Path(output_file).parent.mkdir(parents=True, exist_ok=True)
    with rasterio.open(output_file, "w", **out_meta) as dest:
        # Write block by block to save memory
        for _, window in dest.block_windows(1):
            # Extract corresponding window from mosaic
            data = mosaic[:, window.row_off:window.row_off+window.height,
                          window.col_off:window.col_off+window.width]
            dest.write(data, window=window)

    [src.close() for src in src_files]
    return output_file



def resample_raster(input_file, output_file, scale_factor=5, resampling_method=Resampling.nearest):
    """
    Resample a raster to lower resolution in a memory-efficient way using blocks/windows.
    """
    with rasterio.open(input_file) as src:
        new_height = src.height // scale_factor
        new_width = src.width // scale_factor
        new_transform = src.transform * src.transform.scale(
            (src.width / new_width),
            (src.height / new_height)
        )

        profile = src.profile.copy()
        profile.update({
            "height": new_height,
            "width": new_width,
            "transform": new_transform,
            "compress": "LZW",
            "predictor": 2,
            "tiled": True,
            "blockxsize": 256,
            "blockysize": 256
        })

        with rasterio.open(output_file, "w", **profile) as dst:
            # Process block by block
            for _, window in dst.block_windows(1):
                # Compute corresponding source window
                src_window = Window(
                    col_off=window.col_off * scale_factor,
                    row_off=window.row_off * scale_factor,
                    width=window.width * scale_factor,
                    height=window.height * scale_factor
                )

                src_data = src.read(window=src_window)
                dest_data = np.zeros((src.count, window.height, window.width), dtype=src.dtypes[0])

                reproject(
                    source=src_data,
                    destination=dest_data,
                    src_transform=src.window_transform(src_window),
                    src_crs=src.crs,
                    dst_transform=dst.window_transform(window),
                    dst_crs=dst.crs,
                    resampling=resampling_method
                )
                dst.write(dest_data, window=window)
    return output_file


def clip_raster_to_country_and_create_cog(
    raster_file,
    country_name,
    output_dir="../data/processed/WSF/",
    gadm_file="../data/raw/gadm_410-adm_0/gadm_410-adm_0.shp",
    country_col="COUNTRY",
):
    """
    Clips a raster to a country boundary and converts it to a Cloud Optimized GeoTIFF (COG).

    Parameters
    ----------
    raster_file : str or Path
        Path to the input raster file
    country_name : str
        Name of the country to clip to
    output_dir : str or Path, optional
        Directory to save the output COG file
    gadm_file : str or Path, optional
        Path to the GADM shapefile containing country boundaries
    country_col : str, optional
        Column name in the GADM shapefile that contains country names

    Returns
    -------
    Path
        Path to the created COG file
    """
    raster_file = Path(raster_file)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Create output filename based on the raster name and country
    raster_basename = raster_file.stem
    cog_file = output_dir / f"{raster_basename}_{country_name.replace(' ', '_')}.tif"

    # Read country boundary
    print(f"Reading country boundary for {country_name}...")
    try:
        gdf = gpd.read_file(gadm_file)
        country_gdf = gdf[gdf[country_col] == country_name].to_crs(epsg=4326)

        if len(country_gdf) == 0:
            print(f"Country '{country_name}' not found in column '{country_col}'")
            return None
    except Exception as e:
        print(f"Error reading country boundary: {str(e)}")
        return None

    # Use a temporary directory for processing
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir = Path(temp_dir)
        raw_file = temp_dir / f"{raster_basename}_{country_name.lower().replace(' ', '_')}.tif"

        print(f"Clipping raster to {country_name} boundary...")
        try:
            # Open the raw raster
            with rasterio.open(raster_file) as src:
                # Clip with the country boundary
                out_image, out_transform = mask(src, country_gdf.geometry, crop=True, nodata=0)

                # Copy the metadata
                out_meta = src.meta.copy()
                out_meta.update(
                    {
                        "height": out_image.shape[1],
                        "width": out_image.shape[2],
                        "transform": out_transform,
                        "nodata": 0,
                    }
                )

            # Save the clipped raster to a temporary file
            with rasterio.open(raw_file, "w", **out_meta) as dest:
                dest.write(out_image)
        except Exception as e:
            print(f"Error clipping raster: {str(e)}")
            return None

        # Convert to COG
        print(f"Converting to COG: {raw_file} -> {cog_file}")
        try:
            subprocess.run(
                [
                    "rio",
                    "cogeo",
                    "create",
                    str(raw_file),
                    str(cog_file),
                    "--cog-profile",
                    "deflate",
                    "--overview-resampling",
                    "nearest",
                    "--nodata",
                    "0",
                ],
                check=True,
            )
            print(f"Successfully created COG: {cog_file}")
            return cog_file
        except subprocess.SubprocessError as e:
            print(f"Error creating COG: {str(e)}")
            return None

def csv_to_json(input_file, output_file, skiprows=0, sep=None, round_digits=2):
    """
    Convert a two-column CSV to JSON in the format:
    {
        "datasets": [
            {
                "data": [
                    {"x": <value>, "y": <value>},
                    ...
                ]
            }
        ]
    }
    Parameters:
    - input_file: path to CSV file
    - output_file: path to save JSON
    - skiprows: number of rows to skip at the top (metadata)
    - sep: CSV separator (default: auto-detect)
    - round_digits: number of decimals to round x and y
    """
    # Load CSV
    df = pd.read_csv(input_file, sep=sep, skiprows=skiprows, engine="python")

    # Keep only the first two columns
    df = df.iloc[:, :2]

    # Rename columns to standard names
    df.columns = ["x", "y"]

    # Drop rows with missing or non-numeric values
    df = df.dropna(subset=["x", "y"])
    df = df[pd.to_numeric(df["x"], errors="coerce").notna()]
    df = df[pd.to_numeric(df["y"], errors="coerce").notna()]

    # Build JSON structure
    result = {
        "datasets": [
            {
                "data": [
                    {"x": round(float(row["x"]), round_digits),
                     "y": round(float(row["y"]), round_digits)}
                    for _, row in df.iterrows()
                ]
            }
        ]
    }

    # Save JSON
    with open(output_file, "w") as f:
        json.dump(result, f, indent=2)

    print(f"Saved JSON to {output_file}")
    return result

def excel_to_json(input_file, output_file, skiprows=0, round_digits=2, date_format="%Y-%m-%d"):
    """
    Convert an Excel file with multiple sheets to JSON.
    Each sheet becomes a separate dataset:
    {
        "datasets": [
            { "data": [ { "x": ..., "y": ... }, ... ] },
            { "data": [ { "x": ..., "y": ... }, ... ] },
            ...
        ]
    }

    Parameters:
    - input_file: path to XLSX file
    - output_file: path to save JSON
    - skiprows: number of rows to skip at the top of each sheet
    - round_digits: digits to round numeric values
    - date_format: how to format dates in x column
    """

    input_file = Path(input_file)

    # Read all sheets into a dict of DataFrames
    xls = pd.ExcelFile(input_file)
    datasets = []

    for sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name=sheet_name, skiprows=skiprows)

        # Keep only first two columns
        df = df.iloc[:, :2]
        df.columns = ["x", "y"]

        # Drop missing values
        df = df.dropna(subset=["x", "y"])
        df = df[pd.to_numeric(df["y"], errors="coerce").notna()]

        # Build data list
        data_list = []
        for _, row in df.iterrows():
            x_val = row["x"]
            if isinstance(x_val, pd.Timestamp):
                x_val = x_val.strftime(date_format)
            else:
                x_val = round(float(x_val), round_digits)

            y_val = round(float(row["y"]), round_digits)

            data_list.append({"x": x_val, "y": y_val})

        datasets.append({"data": data_list})

    result = {"datasets": datasets}

    # Save JSON
    with open(output_file, "w") as f:
        json.dump(result, f, indent=2)

    print(f"Saved JSON to {output_file}")
    return result


def reproject_raster(input_path, output_path, target_crs, resampling_method=Resampling.nearest):
    """Reproject a single raster to a new coordinate reference system."""

    with rasterio.open(input_path) as src:
        # Calculate transform and dimensions for target CRS
        transform, width, height = calculate_default_transform(
            src.crs, target_crs, src.width, src.height, *src.bounds
        )

        # Copy source metadata and update for target CRS
        kwargs = src.meta.copy()
        kwargs.update({
            'crs': target_crs,
            'transform': transform,
            'width': width,
            'height': height
        })

        # Create output raster and reproject
        with rasterio.open(output_path, 'w', **kwargs) as dst:
            for i in range(1, src.count + 1):
                reproject(
                    source=rasterio.band(src, i),
                    destination=rasterio.band(dst, i),
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=transform,
                    dst_crs=target_crs,
                    resampling=resampling_method
                )


def batch_reproject_rasters(
    input_folder, output_folder, target_crs, resampling_method=Resampling.nearest
):
    """
    Reproject all TIFF files in a folder to a new coordinate reference system.

    Args:
        input_folder: Path to folder containing input rasters
        output_folder: Path to folder for output rasters
        target_crs: Target CRS (e.g., 'EPSG:4326', 'EPSG:3857')
        resampling_method: Resampling method for reprojection
    """
    input_folder = Path(input_folder)
    output_folder = Path(output_folder)

    # Create output folder if it doesn't exist
    output_folder.mkdir(parents=True, exist_ok=True)

    # Find all TIFF files
    tiff_files = list(input_folder.glob("*.tif")) + list(input_folder.glob("*.tiff"))

    if not tiff_files:
        print(f"No TIFF files found in {input_folder}")
        return

    print(f"Found {len(tiff_files)} TIFF files to reproject...")

    for i, tiff_file in enumerate(tiff_files, 1):
        # Force .tif extension for output files
        output_file = output_folder / f"{tiff_file.stem}.tif"
        print(f"[{i}/{len(tiff_files)}] Reprojecting {tiff_file.name}...")

        try:
            reproject_raster(tiff_file, output_file, target_crs, resampling_method)
            print(f"Successfully reprojected to {output_file.name}")
        except Exception as e:
            print(f"Error reprojecting {tiff_file.name}: {e}")

    print(f"\n Batch reprojection complete! Output files in: {output_folder}")
