ESA-GDA Data Processing
==============================

Python pipeline that processes geospatial layers (raster, vector, animated) per country story and uploads them to Mapbox or S3.

For a full guide on how to add and process new layers, see [LAYER_PROCESSING_GUIDELINES.md](LAYER_PROCESSING_GUIDELINES.md).

---

## Setup

### Environment

The repo uses [uv](https://docs.astral.sh/uv/) for dependency management.

```bash
cd data-processing
uv sync
source .venv/bin/activate
```

### Environment variables

```bash
cp .env.example .env
```

Fill in the Mapbox and S3 credentials. See [LAYER_PROCESSING_GUIDELINES.md](LAYER_PROCESSING_GUIDELINES.md) for the full list of required variables.

---

## Running Jupyter

```bash
# Via Docker (recommended)
docker compose up --build

# Or directly
jupyter lab
```
