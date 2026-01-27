"""Module for downloading data for step 1: ESA WorldCover and Global Surface Water data."""

import math
import shutil
from pathlib import Path

import geopandas as gpd
import rasterio
from rasterio.mask import mask
from rasterio.merge import merge
from shapely.geometry import box
from tqdm.auto import tqdm
import requests

# -----------------------
# Helper functions
# -----------------------

def _compute_intersecting_tiles(country_geom, country_name=None):
    """
    Compute 10x10 degree tiles that intersect a country's geometry.
    Returns a list of (lon_label, lat_label) tuples.
    """
    minx, miny, maxx, maxy = country_geom.bounds
    lon_start = int(math.floor(minx / 10) * 10)
    lon_end = int(math.ceil(maxx / 10) * 10)
    lat_start = int(math.floor(miny / 10) * 10)
    lat_end = int(math.ceil(maxy / 10) * 10)

    tiles_to_download = []
    for lon in range(lon_start, lon_end, 10):
        for lat in range(lat_start, lat_end, 10):
            south = lat
            north = lat + 10
            tile_geom = box(lon, south, lon + 10, north)
            if tile_geom.intersects(country_geom):
                lon_label = f"{abs(lon)}W" if lon < 0 else f"{lon}E"
                lat_label = f"{north}N" if north >= 0 else f"{abs(north)}S"
                tiles_to_download.append((lon_label, lat_label))

    if country_name:
        print(f"Tiles intersecting {country_name}: {tiles_to_download}")
    return tiles_to_download

def _download_tile(base_url, filename_template, lon_label, lat_label, tiles_folder):
    """
    Download a single tile using a filename template.
    Returns Path if downloaded or exists, None if not found.
    """
    filename = filename_template.format(lon=lon_label, lat=lat_label)
    out_path = tiles_folder / filename

    if out_path.exists():
        return out_path

    url = f"{base_url}/{filename}"
    r = requests.get(url, allow_redirects=True)
    if r.status_code != 200:
        print(f"Tile not found: {filename}")
        return None

    with open(out_path, "wb") as f:
        f.write(r.content)
    return out_path

def _create_mosaic(tiles_files, output_mosaic):
    """
    Merge raster files into a mosaic.
    """
    if not tiles_files:
        raise ValueError("No tiles to merge.")

    print(f"Merging {len(tiles_files)} tiles into mosaic...")
    src_files = [rasterio.open(f) for f in tiles_files]
    mosaic, out_trans = merge(src_files, nodata=0)

    out_meta = src_files[0].meta.copy()
    out_meta.update({
        "height": mosaic.shape[1],
        "width": mosaic.shape[2],
        "transform": out_trans,
        "nodata": 0
    })

    with rasterio.open(output_mosaic, "w", **out_meta) as dest:
        dest.write(mosaic)

    for src in src_files:
        src.close()

# -----------------------
# Global Surface Water
# -----------------------

def download_gsw_for_country(
    country_name: str,
    dataset: str = "occurrence",
    gadm_file: str = "../data/raw/gadm_410-adm_0/gadm_410-adm_0.shp",
    tiles_folder: str = "../data/processed/GSW/Tiles",
    output_dir: str = "../data/processed/GSW/Mosaics"
) -> Path:
    """
    Download Global Surface Water tiles for a country, merge them, clip to country boundary,
    remove Tiles folder, and delete mosaic after clipping.
    """

    tiles_folder = Path(tiles_folder)
    tiles_folder.mkdir(parents=True, exist_ok=True)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    output_mosaic = output_dir / f"{dataset}_{country_name.replace(' ','_')}_mosaic.tif"
    output_clipped = output_dir / f"{dataset}_{country_name.replace(' ','_')}_clipped.tif"

    if output_clipped.exists():
        print(f"Clipped raster already exists: {output_clipped}, skipping download.")
        return output_clipped

    # Load country geometry
    gdf = gpd.read_file(gadm_file).to_crs(epsg=4326)
    country_geom = gdf[gdf["COUNTRY"].str.lower() == country_name.lower()].geometry.unary_union

    # Compute tiles
    tiles_to_download = _compute_intersecting_tiles(country_geom, country_name)

    # Download tiles
    downloaded_files = []
    base_url = f"http://storage.googleapis.com/global-surface-water/downloads2021/{dataset}"
    filename_template = f"{dataset}_{{lon}}_{{lat}}v1_4_2021.tif"
    for lon_label, lat_label in tiles_to_download:
        f = _download_tile(base_url, filename_template, lon_label, lat_label, tiles_folder)
        if f:
            downloaded_files.append(f)

    # Merge tiles
    _create_mosaic(downloaded_files, output_mosaic)

    # Remove Tiles folder
    if tiles_folder.exists():
        shutil.rmtree(tiles_folder)
        print(f"Tiles folder removed: {tiles_folder}")

    # Clip mosaic
    print(f"Clipping mosaic to {country_name} boundary...")
    with rasterio.open(output_mosaic) as src:
        out_image, out_transform = mask(src, [country_geom], crop=True, nodata=0)
        out_meta = src.meta.copy()
        out_meta.update({
            "height": out_image.shape[1],
            "width": out_image.shape[2],
            "transform": out_transform,
            "nodata": 0
        })

    with rasterio.open(output_clipped, "w", **out_meta) as dest:
        dest.write(out_image)

    # Remove mosaic after clipping
    if output_mosaic.exists():
        output_mosaic.unlink()
        print(f"Mosaic removed: {output_mosaic}")

    print(f"Clipped raster saved to {output_clipped}")
    return output_clipped

# -----------------------
# ESA WorldCover
# -----------------------

def download_worldcover_for_country(
    country_name: str,
    gadm_file: str = "../data/raw/gadm_410-adm_0/gadm_410-adm_0.shp",
    year: int = 2021,
    base_dir: str = "../data/processed/WorldCover",
    overwrite: bool = False
) -> Path:
    """
    Download ESA WorldCover tiles for a country, merge them, clip to country boundary,
    remove Tiles folder, and delete mosaic after clipping.
    """

    version = {2020: "v100", 2021: "v200"}[year]
    base_url = f"https://esa-worldcover.s3.eu-central-1.amazonaws.com/{version}/{year}/map"

    # Setup folders
    tiles_folder = Path(base_dir) / "Tiles"
    mosaic_folder = Path(base_dir) / "Mosaic"
    tiles_folder.mkdir(parents=True, exist_ok=True)
    mosaic_folder.mkdir(parents=True, exist_ok=True)

    mosaic_file = mosaic_folder / f"WorldCover_{year}_{country_name.replace(' ','_')}_Mosaic.tif"
    clipped_file = mosaic_folder / f"WorldCover_{year}_{country_name.replace(' ','_')}_Clipped.tif"

    if clipped_file.exists() and not overwrite:
        print(f"Clipped raster already exists: {clipped_file}, skipping download.")
        return clipped_file

    # Load country geometry
    gdf = gpd.read_file(gadm_file).to_crs(epsg=4326)
    country_geom = gdf[gdf["COUNTRY"].str.lower() == country_name.lower()].geometry.unary_union

    # Load WorldCover grid
    grid_url = "https://esa-worldcover.s3.eu-central-1.amazonaws.com/v100/2020/esa_worldcover_2020_grid.geojson"
    grid = gpd.read_file(grid_url)
    tiles = grid[grid.intersects(country_geom)]
    if tiles.empty:
        raise ValueError(f"No WorldCover tiles intersect {country_name}")

    # Download tiles using ll_tile
    downloaded_files = []
    for tile_name in tqdm(tiles.ll_tile, desc="Downloading WorldCover tiles"):
        out_path = tiles_folder / f"ESA_WorldCover_10m_{year}_{version}_{tile_name}_Map.tif"
        if out_path.exists() and not overwrite:
            downloaded_files.append(out_path)
            continue

        url = f"{base_url}/ESA_WorldCover_10m_{year}_{version}_{tile_name}_Map.tif"
        r = requests.get(url, allow_redirects=True)
        if r.status_code != 200:
            print(f"Tile not found: {tile_name}")
            continue

        with open(out_path, "wb") as f:
            f.write(r.content)
        downloaded_files.append(out_path)

    if not downloaded_files:
        raise ValueError("No WorldCover tiles downloaded.")

    # Merge tiles
    _create_mosaic(downloaded_files, mosaic_file)

    # Remove Tiles folder
    if tiles_folder.exists():
        shutil.rmtree(tiles_folder)
        print(f"Tiles folder removed: {tiles_folder}")

    # Clip mosaic
    print(f"Clipping mosaic to {country_name} boundary...")
    with rasterio.open(mosaic_file) as src:
        out_image, out_transform = mask(src, [country_geom], crop=True, nodata=0)
        out_meta = src.meta.copy()
        out_meta.update({
            "height": out_image.shape[1],
            "width": out_image.shape[2],
            "transform": out_transform,
            "nodata": 0
        })

    with rasterio.open(clipped_file, "w", **out_meta) as dest:
        dest.write(out_image)

    # Remove mosaic after clipping
    if mosaic_file.exists():
        mosaic_file.unlink()
        print(f"Mosaic removed: {mosaic_file}")

    print(f"Clipped raster saved to {clipped_file}")
    return clipped_file
