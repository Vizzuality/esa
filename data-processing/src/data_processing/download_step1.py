"""
ESA WorldCover download helper module.

Provides functionality to download ESA WorldCover tiles based on
country names, ISO3 codes, or geographic bounds. Supports filtering by year
and options for dry runs and overwriting existing files.
"""

import sys
from pathlib import Path

import geopandas as gpd
import requests
from shapely.geometry import Polygon
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
    """Download ESA WorldCover tiles for a country, ISO3 code, or bounding box, and optionally merge them."""

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
        url = f"{s3_url_prefix}/{version}/{year}/map/ESA_WorldCover_10m_{year}_{version}_{tile}_Map.tif"
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
