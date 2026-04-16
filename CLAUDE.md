# ESA-GDA

Earth observation story maps for World Bank/ESA, built by Vizzuality. The project has three main parts: a Python data pipeline, a Next.js frontend, and a Strapi CMS.

## Architecture

```
esa/
├── client/           # Next.js frontend (maps, stories)
├── cms/              # Strapi CMS (content management)
├── data-processing/  # Python pipeline (raster/vector layer processing)
├── types/            # Shared TypeScript API types (generated via Orval)
├── infrastructure/   # Terraform
└── docker-compose.yml
```

## Data Processing (primary work area)

Python pipeline that processes geospatial layers (raster/vector/animated) per country story, then uploads to S3/Mapbox.

### Setup

```bash
# Create conda environment
mamba env create -n esa_gda -f data-processing/environment.yml
conda activate esa_gda

# Install package in editable mode
cd data-processing && pip install -e .

# Install pre-commit hooks
pre-commit install

# Environment variables (S3, Mapbox credentials)
cp data-processing/.env.example data-processing/.env
```

### Structure

- `src/data_processing/` — core processing modules
  - `process_layers.py` — main orchestrator
  - `raster_processor.py`, `vector_processor.py`, `animated_tiles.py`
- `src/helpers/` — utilities: S3 upload, MBTiles/COG conversion, Mapbox upload, QML parsing
- `notebooks/` — Jupyter notebooks for exploratory work and running the pipeline
  - `01_raster_layers.ipynb`, `02_vector_layers.ipynb`, `03_animated_layers.ipynb`
  - `04_charts_data.ipynb`, `05_layers_step1.ipynb`
- YAML configs per story: `raster_config.yaml`, `vector_config.yaml`, `animated_config.yaml`
- `data/raw/` — raw input data (gitignored)
- `data/processed/` — processed output (gitignored)

### Running Jupyter

```bash
# Via Docker (recommended)
docker compose up --build   # in data-processing/

# Or directly with conda env activated
jupyter lab
```

## Client (Next.js)

```bash
yarn install           # install all workspace deps
cp client/.env.example client/.env.local  # fill in API URL, Mapbox token

yarn client dev        # start dev server (localhost:3000)
yarn client build      # production build
yarn client test       # Playwright tests
yarn client lint       # ESLint
```

Key env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_MAPBOX_API_TOKEN`, `NEXT_PUBLIC_MAPBOX_USERNAME`, `NEXT_PUBLIC_MAPBOX_STYLE_ID`

## CMS (Strapi)

```bash
# Requires local PostgreSQL
createdb <database_name>
cp cms/.env.example cms/.env  # fill in DB credentials

yarn cms dev     # start CMS (localhost:1337/admin)
yarn cms build
yarn cms seed    # import seed data from seed.tar.gz
```

## Types

```bash
yarn types build   # regenerate TypeScript types from CMS API (uses Orval)
```

## Docker (full stack)

```bash
docker-compose up --build   # client (3000), CMS (1337), PostgreSQL
```

## Branch conventions

Feature branches follow `data/<story_name>` pattern for data processing work.
