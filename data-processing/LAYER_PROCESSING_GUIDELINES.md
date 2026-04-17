# Layer Processing Guidelines

This document explains how to add and process new geospatial layers in the ESA-GDA data pipeline.

---

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Layer Types](#layer-types)
4. [Raster Layers](#raster-layers) — `01_raster_layers.ipynb`
5. [Vector Layers](#vector-layers) — `02_vector_layers.ipynb`
6. [Uploading to Mapbox](#uploading-to-mapbox) — raster & vector
7. [Animated Layers](#animated-layers) — `03_animated_layers.ipynb`
8. [Uploading Animated Tiles to S3](#uploading-animated-tiles-to-s3)
9. [Charts Data](#charts-data) — `04_charts_data.ipynb`
10. [Step 1 Standard Layers](#step-1-standard-layers) — `05_layers_step1.ipynb`
11. [Preprocessing Utilities](#preprocessing-utilities)
12. [Common Gotchas](#common-gotchas)

---

## Overview

The pipeline converts raw geospatial files into web-ready map tiles. The high-level flow is:

```
Raw data (GeoTIFF / Shapefile / GeoJSON)
    ↓  Add entry to YAML config
    ↓  Run notebook cell
    ↓  Processed files saved to data/processed/
    ↓  Upload to Mapbox (raster/vector) or S3 (animated)
    ↓  Tileset available to configure in the CMS
```

---

## Setup

### Environment

```bash
# Install uv if you don't have it
curl -LsSf https://astral.sh/uv/install.sh | sh

cd data-processing
uv sync
source .venv/bin/activate
```

### Environment variables

Copy `.env.example` to `.env` and fill in credentials:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `MAPBOX_USER` | Your Mapbox username |
| `MAPBOX_TOKEN` | Mapbox access token (must have upload scope) |
| `AWS_ACCESS_KEY_ID` | S3 access key (for animated tiles) |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key |
| `AWS_DEFAULT_REGION` | S3 region |
| `AWS_BUCKET_NAME` | S3 bucket name |
| `ENDPOINT_URL` | S3 endpoint URL |

### Running Jupyter

```bash
# Via Docker (recommended)
docker compose up --build

# Or directly
jupyter lab
```

---

## Layer Types

| Type | Input | Output | Destination | Notebook |
|------|-------|--------|-------------|----------|
| **Raster** | GeoTIFF + QML style (or pre-styled RGB) | COG GeoTIFF + MBTiles | Mapbox tileset | `01_raster_layers.ipynb` |
| **Vector** | Shapefile or GeoJSON | MBTiles | Mapbox tileset | `02_vector_layers.ipynb` |
| **Animated** | Folder of timestamped GeoTIFFs | APNG tile directory | S3 bucket | `03_animated_layers.ipynb` |

---

## Raster Layers

Use for satellite imagery layers displayed with a colour ramp (e.g. precipitation, vegetation index, built-up height).

### YAML config — `src/raster_config.yaml`

```yaml
layers:
  your_layer_key:
    base_path: "../data/raw/Region/Country/Rasters/"
    input_file: "filename.tif"          # relative to base_path
    style_file: "filename.qml"          # relative to base_path; null if pre-styled
    output_file: "../data/processed/Region/Country/Rasters/OutputName.tif"
    layer_name: "Country_LayerDisplayName"
    max_zoom: 11                        # optional; auto-detected from resolution if omitted
    vector_file: "../data/raw/.../boundary.shp"  # optional; clips raster to this boundary
```

| Field | Required | Description |
|-------|----------|-------------|
| `base_path` | Yes | Directory containing the input file |
| `input_file` | Yes | GeoTIFF filename (relative to `base_path`) |
| `style_file` | No | QGIS `.qml` colour ramp file. `null` for pre-styled RGB/RGBA rasters |
| `output_file` | Yes | Output path for the processed GeoTIFF |
| `layer_name` | Yes | Display name and Mapbox tileset name |
| `max_zoom` | No | Maximum zoom level. Auto-detected from pixel resolution if omitted |
| `vector_file` | No | Shapefile to clip the raster to (e.g. country boundary) |

### Processing

```python
from data_processing.process_layers import process_raster_layers

process_raster_layers(
    config_path="../src/raster_config.yaml",
    layer_keys=["your_layer_key"],
    # upload_override=True to upload all selected layers to Mapbox
    # upload_layer_keys=["your_layer_key"] to upload only specific layers
)
```

The pipeline: validates input → clips to vector (optional) → applies QML colours → converts to COG → converts to MBTiles → uploads to Mapbox (if requested). Each layer runs in an isolated subprocess to avoid memory issues.

**Outputs:** `{output_file}` (COG) and `{output_file}.mbtiles`

### Pre-styled rasters (no QML)

If the source is already an RGB/RGBA GeoTIFF, use `process_prestyled_raster()` instead:

```python
from data_processing.process_layers import process_prestyled_raster
from pathlib import Path

process_prestyled_raster(
    input_file=Path("../data/raw/Region/Country/input.tif"),
    output_file=Path("../data/processed/Region/Country/output.tif"),
    layer_name="Country_LayerName",
    max_zoom=11,       # optional
    percentile=2.0,    # clips float32 at 2nd/98th percentile before normalising to uint8
    upload=True,
)
```

---

## Vector Layers

Use for polygon, line, or point data such as administrative boundaries, impact zones, or roads.

### YAML config — `src/vector_config.yaml`

```yaml
layers:
  your_vector_layer_key:
    input_file: "../data/raw/Region/Country/Vectors/features.shp"
    output_file: "../data/processed/Region/Country/Vectors/OutputName.mbtiles"
    layer_name: "Country_LayerDisplayName"
    min_zoom: 6   # optional; default 6
    max_zoom: 14  # optional; default 14
```

| Field | Required | Description |
|-------|----------|-------------|
| `input_file` | Yes | Path to Shapefile (`.shp`) or GeoJSON file |
| `output_file` | Yes | Output MBTiles path |
| `layer_name` | Yes | Display name and Mapbox tileset name |
| `min_zoom` | No | Minimum zoom level (default `6`) |
| `max_zoom` | No | Maximum zoom level (default `14`) |

### Processing

```python
from data_processing.process_layers import process_vector_layers

process_vector_layers(
    config_path="../src/vector_config.yaml",
    layer_keys=["your_vector_layer_key"],
    # upload_override=True to upload all selected layers to Mapbox
    # upload_layer_keys=["your_vector_layer_key"] to upload only specific layers
)
```

**Output:** `{output_file}.mbtiles`

### Preprocessing: JSON to GeoJSON

```python
import geopandas as gpd

gdf = gpd.read_file("input.json")
gdf = gdf.set_crs("EPSG:4326")
gdf.to_file("output.geojson", driver="GeoJSON")
```

---

## Uploading to Mapbox

Raster and vector MBTiles are uploaded to Mapbox, where they become tilesets available in Mapbox Studio and the CMS. Upload is triggered via function parameters, not the YAML config.

Requires `MAPBOX_USER` and `MAPBOX_TOKEN` in `.env`.

---

## Animated Layers

Use for time-series data where the user plays through frames (e.g. monthly rainfall, yearly land cover change).

The pipeline produces APNG tiles — one animated PNG per tile position combining all time frames — which the frontend plays back with a timeline slider.

### YAML config — `src/animated_config.yaml`

```yaml
layers:
  your_animated_layer_key:
    input_folder: "../data/raw/Region/Country/Rasters/TimeSeries/"
    output_folder: "../data/processed/Region/Country/APNGs/LayerName/"
    min_z: 3
    max_z: 8
    vmin: 0      # minimum data value for colormap scaling
    vmax: 100    # maximum data value for colormap scaling
    date_format: "YYYYMMDD"   # format of date in input filenames
    colormap:
      type: linear
      colors: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"]
```

| Field | Required | Description |
|-------|----------|-------------|
| `input_folder` | Yes | Directory containing timestamped GeoTIFF files |
| `output_folder` | Yes | Directory where APNG tiles will be written |
| `min_z` | Yes | Minimum zoom level |
| `max_z` | Yes | Maximum zoom level |
| `vmin` | Yes | Minimum data value for colormap scaling |
| `vmax` | Yes | Maximum data value for colormap scaling |
| `date_format` | No | Date pattern in filenames: `"YYYY"`, `"YYYYMMDD"`, or `"DDMMYYYY"` |
| `colormap` | Yes | How to colour the data (see below) |

**Colormap types:**

| Type | When to use |
|------|-------------|
| `linear` | Continuous gradient between colour stops |
| `categorical` | Exact integer values mapped to colours |
| `binned` | Value ranges mapped to colours |
| `sld_gradient` | SLD-style gradient with named breakpoints |
| `single` | All non-transparent pixels get one colour |

```yaml
# linear
colormap:
  type: linear
  colors: ["#f1eef6", "#c8d1e6", "#91b3d5", "#4682b4", "#08519c"]

# categorical
colormap:
  type: categorical
  values:
    1: "#e41a1c"
    2: "#377eb8"
    3: "#4daf4a"

# binned
colormap:
  type: binned
  bins: [0, 25, 50, 75, 100]
  colors: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]
```

### Input file naming

Input GeoTIFFs must have the date at the end of the filename. Files are sorted chronologically to determine frame order.

- `"YYYY"` — e.g. `rainfall_2023.tif`
- `"YYYYMMDD"` — e.g. `NDVI_20230615.tif`
- `"DDMMYYYY"` — e.g. `layer_15062023.tif`

### Processing

```python
from data_processing.process_apng import process_animated_layers

process_animated_layers(
    "../src/animated_config.yaml",
    layer_ids=["your_animated_layer_key"]
)
```

**Outputs:** per-frame tiles `{z}/{x}/{y}_{frame}.png` and animated tiles `{z}/{x}/{y}.apng`

### Preprocessing

Preprocessing is sometimes required (masking nodata, clipping to boundary, reprojecting, etc.) and is added as cells directly before the tile creation call in the notebook. See the [Preprocessing Utilities](#preprocessing-utilities) section for available helpers.

---

## Uploading Animated Tiles to S3

Animated tiles are uploaded directly to S3, not Mapbox. The frontend fetches them from there.

Requires `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_BUCKET_NAME`, and `ENDPOINT_URL` in `.env`.

```bash
aws s3 cp ../data/processed/Region/Country/APNGs/LayerName/ \
    s3://{bucket}/APNGs/Country/LayerName/ \
    --recursive \
    --endpoint-url {ENDPOINT_URL}
```

---

## Charts Data

**Notebook:** `04_charts_data.ipynb`

Converts raw tabular files (CSV or Excel) into the JSON format that Strapi expects for charts in story steps.

| Function | Use when |
|----------|----------|
| `csv_to_json` | Simple flat CSV table |
| `excel_to_json` | Excel spreadsheet |
| `csv_to_json_multiline` | Multiple series in one file (e.g. year + month + value columns) |

```python
from data_processing.utils import csv_to_json, excel_to_json, csv_to_json_multiline

csv_to_json(
    input_file="../data/raw/Region/Country/data.csv",
    output_file="../data/processed/Region/Country/Charts/data.json",
    skiprows=4,  # skip header rows if needed
    sep=";",     # column separator (default is comma)
)

excel_to_json(
    input_file="../data/raw/Region/Country/data.xlsx",
    output_file="../data/processed/Region/Country/Charts/data.json",
)

csv_to_json_multiline(
    input_file="../data/raw/Region/Country/timeseries.csv",
    output_file="../data/processed/Region/Country/Charts/timeseries.json",
    col_names=["year", "month", "value"],
)
```

The resulting JSON is then linked to the story step manually in Strapi.

---

## Step 1 Standard Layers

**Notebook:** `05_layers_step1.ipynb`

Every country story opens with a standard overview map built from global public datasets. This notebook downloads and processes those layers per country.

| Dataset | What it shows |
|---------|---------------|
| **ESA WorldCover** | Land use / land cover classification (2021) |
| **Global Surface Water (GSW)** | Surface water occurrence (lakes, rivers, wetlands) |
| **World Settlement Footprint (WSF)** | Built-up area and building height |
| **WorldCereal** | Temporary cropland classification |

Each dataset has a download function that fetches and clips the global data to the country boundary, followed by a `RasterProcessor` call to style and tile it:

```python
from data_processing.download_step1 import download_worldcover_for_country
from data_processing.raster_processor import RasterProcessor
from pathlib import Path

country = "Paraguay"
download_worldcover_for_country(country, target_resolution=50)

BASE_PATH = Path("../data/processed/WorldCover/")
RasterProcessor(
    input_file=BASE_PATH / f"Mosaic/WorldCover_2021_{country}_Clipped.tif",
    qml_file=BASE_PATH / "WorldCover.qml",
    output_file=BASE_PATH / f"Rasters/WorldCover_2021_{country}.tif",
    layer_name=f"{country}_WorldCover_2021",
    upload=True,
    create_mbtiles=True,
    max_zoom=7,
).process()
```

GSW, WSF, and WorldCereal follow the same pattern. For WSF and WorldCereal, clip the global raster first:

```python
from data_processing.utils import clip_raster_to_country_and_create_cog

clip_raster_to_country_and_create_cog(
    raster_file="../data/processed/WSF/WSF3D_V02_BuildingArea.tif",
    country="Uganda",
    output_dir="../data/processed/WSF/Clipped/",
)
```

For multi-country stories, the notebook includes commented patterns for merging COGs across countries and subsetting GADM boundaries.

---

## Preprocessing Utilities

| Function | Purpose |
|----------|---------|
| `merge_tifs()` | Merge multiple GeoTIFFs into one |
| `resample_raster()` | Downsample high-resolution rasters |
| `clip_rasters_by_vector()` | Clip rasters to a vector boundary |
| `batch_reproject_rasters()` | Reproject a folder of rasters to a target CRS |
| `batch_convert_vectors()` | Rasterise a folder of vector files |
| `rename_files_date_prefix_to_suffix()` | Standardise date position in filenames |

All from `helpers.raster_utils`.

---

## Common Gotchas

**QML file mismatch** — The QML must match the value range and band count of the raster. Verify it in QGIS before running.

**Float32 rasters without a QML** — Use `process_prestyled_raster()`. Adjust `percentile` if the output looks washed out or oversaturated.

**Nodata values** — Float rasters should use `-9999.0`; integer rasters use `-9999`. Set nodata explicitly in preprocessing to avoid transparency issues.

**CRS** — All inputs should be in EPSG:4326. Vector clip files in a different CRS are auto-reprojected, but it's safer to reproject inputs manually.

**Animated layer filenames** — All files in the input folder must follow the same naming convention matching `date_format`, otherwise frames will be skipped or sorted incorrectly.

**Mapbox tileset name** — `layer_name` must be 32 characters or fewer, alphanumeric with underscores and hyphens only.
