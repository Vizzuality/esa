
"""Module for downloading data for step 1: ESA WorldCover and Global Surface Water data."""

import math
import sys
from pathlib import Path

import geopandas as gpd
import rasterio
import requests
from rasterio.mask import mask
from rasterio.merge import merge
from shapely.geometry import Polygon, box
from tqdm.auto import tqdm

sys.path.append("../src")
from data_processing.utils import merge_tifs


def download_worldcover(
    country: str = None,
    iso3: str = None,
    bounds: list[float] = None,
    year: int = 2021,
    output: str = ".",
    overwrite: bool = False,
    dry: bool = False,
    merge: bool = True,
):
    """
    Download ESA WorldCover tiles for a country, ISO3 code, or bounding box,
    and optionally merge them.
    """

    output_folder = Path(output)
    output_folder.mkdir(parents=True, exist_ok=True)

    version = {2020: 'v100', 2021: 'v200'}[year]
    s3_url_prefix = "https://esa-worldcover.s3.eu-central-1.amazonaws.com"

    # --- Determine AOI ---
    geom = None
    if country or iso3:
        ne_url = "https://naturalearth.s3.amazonaws.com/110m_cultural/ne_110m_admin_0_countries.zip"
        ne = gpd.read_file(ne_url)
        name_col, iso_col = "ADMIN", "ISO_A3"

        if iso3:
            matches = ne[ne[iso_col].str.upper() == iso3.upper()]
        else:
            matches = ne[ne[name_col].str.lower() == country.lower()]

        if matches.empty:
            raise ValueError(f"Area not found (country='{country}', iso3='{iso3}').")
        geom = matches.iloc[0].geometry

    if bounds:
        geom_bounds = Polygon.from_bounds(*bounds)
        geom = geom_bounds if geom is None else geom.intersection(geom_bounds)

    # --- Load WorldCover grid ---
    grid_url = f'{s3_url_prefix}/v100/2020/esa_worldcover_2020_grid.geojson'
    grid = gpd.read_file(grid_url)
    tiles = grid if geom is None else grid[grid.intersects(geom)]
    if tiles.shape[0] == 0:
        raise ValueError(f"No tiles intersect the selected area {geom.bounds}")

    # --- Download tiles ---
    for tile in tqdm(tiles.ll_tile):
        url = (f"{s3_url_prefix}/{version}/{year}/map/"
               f"ESA_WorldCover_10m_{year}_{version}_{tile}_Map.tif")
        out_fn = output_folder / f"ESA_WorldCover_10m_{year}_{version}_{tile}_Map.tif"

        if out_fn.is_file() and not overwrite:
            print(f"{out_fn} already exists. Skipping.")
            continue

        if dry:
            print(f"[DRY RUN] Would download {url} -> {out_fn}")
        else:
            r = requests.get(url, allow_redirects=True)
            r.raise_for_status()
            with open(out_fn, 'wb') as f:
                f.write(r.content)

    # --- Merge tiles if requested ---
    if merge and not dry:
        mosaic_file = output_folder / f"ESA_WorldCover_10m_{year}_{version}_Mosaic.tif"
        merge_tifs(output_folder, mosaic_file)
        print(f"Mosaic saved to {mosaic_file}")
        return mosaic_file  # Return merged file path

    return output_folder  # Return folder if not merged


def _compute_intersecting_tiles(country_geom, country_name):
    """Compute tiles that intersect with the country geometry."""
    minx, miny, maxx, maxy = country_geom.bounds
    lon_start = int(math.floor(minx / 10) * 10)
    lon_end = int(math.ceil(maxx / 10) * 10)
    lat_start = int(math.floor(miny / 10 + 1) * 10)
    lat_end = int(math.ceil(maxy / 10) * 10)

    tiles_to_download = []
    for lon in range(lon_start, lon_end, 10):
        for lat_north in range(lat_start, lat_end + 10, 10):
            south = lat_north - 10
            tile_geom = box(lon, south, lon + 10, lat_north)
            if tile_geom.intersects(country_geom):
                lon_label = f"{abs(lon)}W" if lon < 0 else f"{lon}E"
                lat_label = f"{lat_north}N" if lat_north >= 0 else f"{abs(lat_north)}S"
                tiles_to_download.append((lon_label, lat_label))

    print(f"Tiles intersecting {country_name}: {tiles_to_download}")
    return tiles_to_download


def _download_tile(base_url, dataset, lon_label, lat_label, tiles_folder):
    """Download a single GSW tile if it doesn't exist."""
    filename = f"{dataset}_{lon_label}_{lat_label}v1_4_2021.tif"
    out_path = tiles_folder / filename

    if out_path.exists():
        print(f"Tile already exists: {filename}")
        return out_path

    url = base_url + filename
    print(f"Downloading {filename}...")
    r = requests.get(url)
    if r.status_code != 200:
        print(f"Tile not found: {filename}")
        return None

    with open(out_path, "wb") as f:
        f.write(r.content)
    print(f"Downloaded {filename}")
    return out_path


def _create_mosaic(tiles_to_download, dataset, tiles_folder, output_mosaic):
    """Download tiles and create mosaic."""
    downloaded_files = []
    base_url = f"http://storage.googleapis.com/global-surface-water/downloads2021/{dataset}/"

    for lon_label, lat_label in tiles_to_download:
        out_path = _download_tile(base_url, dataset, lon_label, lat_label, tiles_folder)
        if out_path:
            downloaded_files.append(out_path)

    if not downloaded_files:
        raise ValueError("No tiles were downloaded or available to merge.")

    print(f"Merging {len(downloaded_files)} tiles into mosaic...")
    src_files = [rasterio.open(f) for f in downloaded_files]
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
    print(f"Mosaic saved to {output_mosaic}")

    for src in src_files:
        src.close()

    # Remove individual tiles
    print("Removing individual tiles...")
    for f in downloaded_files:
        f.unlink()
    print("Individual tiles removed.")


def download_gsw_for_country(
    country_name: str,
    dataset: str = "occurrence",
    gadm_file: str = "../data/raw/gadm_410-adm_0/gadm_410-adm_0.shp",
    tiles_folder: str = "../data/processed/GSW/Tiles",
    output_dir: str = "../data/processed/GSW/Mosaics"
) -> Path:
    """
    Download Global Surface Water tiles for a specific country, merge them,
    clip to the country boundary, and return the path to the clipped raster.

    If the clipped raster already exists, nothing is done.

    Parameters
    ----------
    country_name : str
        Name of the country to download and clip.
    dataset : str
        GSW dataset name ("occurrence", "change", "extent").
    gadm_file : str
        Path to GADM shapefile with country boundaries.
    tiles_folder : str
        Folder to temporarily store downloaded tiles.
    output_dir : str
        Folder to store mosaic and clipped raster.

    Returns
    -------
    Path
        Path to the clipped raster file.
    """

    tiles_folder = Path(tiles_folder)
    tiles_folder.mkdir(parents=True, exist_ok=True)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    output_mosaic = output_dir / f"{dataset}_{country_name.replace(' ','_')}_mosaic.tif"
    output_clipped = output_dir / f"{dataset}_{country_name.replace(' ','_')}_clipped.tif"

    # Early exit if clipped already exists
    if output_clipped.exists():
        print(f"Clipped raster already exists: {output_clipped}, nothing to do.")
        return output_clipped

    # Load country geometry
    gdf = gpd.read_file(gadm_file).to_crs(epsg=4326)
    country_geom = gdf[gdf["COUNTRY"].str.lower() == country_name.lower()].geometry.union_all()

    # Compute intersecting tiles
    tiles_to_download = _compute_intersecting_tiles(country_geom, country_name)

    # Download and/or merge tiles
    if not output_mosaic.exists():
        _create_mosaic(tiles_to_download, dataset, tiles_folder, output_mosaic)
    else:
        print(f"Mosaic already exists: {output_mosaic}, skipping download and merge.")

    # Clip mosaic to country
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

    print(f"Clipped raster saved to {output_clipped}")
    return output_clipped
