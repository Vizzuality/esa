"""Process raster and vector layers based on YAML configuration."""


import subprocess
import sys
from pathlib import Path
from typing import Optional

import yaml

import os

from .raster_processor import RasterProcessor
from .vector_processor import VectorProcessor
from helpers.cog_converter import COGConverter
from helpers.mapbox_uploader import upload_to_mapbox
from helpers.mbtiles_converter import MBTilesConverterFactory

# ── Shared helpers ────────────────────────────────────────────────────────────

def _read_layers(config_path: str) -> dict:
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f) or {}
    return config.get('layers', {})


def _resolve_upload_flag(
    layer_id: str,
    layer_config: dict,
    upload_override: Optional[bool],
    upload_layer_keys_set: Optional[set],
) -> bool:
    if upload_override is not None:
        return upload_override
    if upload_layer_keys_set is not None:
        return layer_id in upload_layer_keys_set
    return layer_config.get('upload', False)


# ── Pre-styled raster (no QML) ───────────────────────────────────────────────

def _native_max_zoom(file: Path) -> int:
    """Return the native max zoom of a raster based on its resolution."""
    import math
    import rasterio
    from rasterio.warp import transform_bounds
    with rasterio.open(file) as src:
        bounds = transform_bounds(src.crs, "EPSG:4326", *src.bounds)
        res_x = abs(src.transform.a)
        # Convert native resolution to degrees, then to web mercator metres
        lng_span = bounds[2] - bounds[0]
        px_deg = lng_span / src.width if src.crs.is_geographic else None
        if px_deg is None:
            # Projected: convert pixel size to approximate degrees at scene centre
            centre_lat = (bounds[1] + bounds[3]) / 2
            metres_per_deg = 111320 * math.cos(math.radians(centre_lat))
            px_deg = res_x / metres_per_deg
    # zoom = log2(360 / (px_deg * 256))
    zoom = math.log2(360 / (px_deg * 256))
    return max(1, round(zoom))


def _normalize_to_uint8(input_file: Path, output_file: Path, percentile: float = 2.0) -> None:
    """
    Stretch each band to uint8 using percentile clipping.

    Values below the low percentile → 0, above the high percentile → 255.
    This avoids black output when the source is float32 with a narrow value range.

    Args:
        input_file: Source float raster.
        output_file: Destination uint8 GeoTIFF.
        percentile: Low/high percentile used for clipping (default 2 / 98).
    """
    import numpy as np
    import rasterio

    with rasterio.open(input_file) as src:
        meta = src.meta.copy()
        data = src.read()
        nodata = src.nodata

    bands, height, width = data.shape
    out = np.zeros((bands, height, width), dtype=np.uint8)

    for i in range(bands):
        band = data[i].astype(np.float64)
        valid_mask = band != nodata if nodata is not None else np.ones_like(band, dtype=bool)
        valid = band[valid_mask]
        if valid.size == 0:
            continue
        lo = np.percentile(valid, percentile)
        hi = np.percentile(valid, 100 - percentile)
        if hi == lo:
            continue
        stretched = np.clip((band - lo) / (hi - lo) * 255, 0, 255)
        out[i] = stretched.astype(np.uint8)

    meta.update({"dtype": "uint8", "nodata": None})
    with rasterio.open(output_file, "w", **meta) as dst:
        dst.write(out)


def process_prestyled_raster(
    input_file: Path,
    output_file: Path,
    layer_name: str,
    max_zoom: int = None,
    percentile: float = 2.0,
    upload: bool = False,
):
    """
    Convert an already-styled (RGB/RGBA) raster to COG + MBTiles and optionally
    upload to Mapbox. Use this when the source file already has colour bands and
    no QML styling is needed.

    Float32 inputs are automatically normalized to uint8 via percentile stretching
    before COG/MBTiles conversion (otherwise tiles render as all black).

    Args:
        input_file: Path to the input GeoTIFF.
        output_file: Path for the output GeoTIFF / MBTiles (same stem, different suffix).
        layer_name: Display name used when uploading to Mapbox.
        max_zoom: Maximum zoom level for COG conversion. If None, auto-detected
                  from the file's native resolution.
        percentile: Percentile used for float→uint8 contrast stretch (default 2/98).
        upload: Whether to upload the MBTiles to Mapbox.
    """
    import rasterio

    input_file = Path(input_file)
    output_file = Path(output_file)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    if max_zoom is None:
        max_zoom = _native_max_zoom(input_file)
        print(f"🔍 Auto-detected max zoom: {max_zoom}")

    # Normalize float data to uint8 so PNG tiles render correctly
    with rasterio.open(input_file) as src:
        needs_normalization = src.dtypes[0] not in ("uint8", "byte")

    cog_input = input_file
    if needs_normalization:
        normalized_path = output_file.parent / f"normalized_{output_file.name}"
        print(f"⚖️  Normalizing float32 → uint8 (percentile clip {percentile}/{100-percentile})")
        _normalize_to_uint8(input_file, normalized_path, percentile=percentile)
        cog_input = normalized_path

    print(f"☁️  Converting to COG: {cog_input.name}")
    COGConverter.convert(cog_input, output_file, max_zoom=max_zoom)

    if needs_normalization:
        normalized_path.unlink()

    tile_format = "JPEG" if needs_normalization else "PNG"
    mbtiles_path = output_file.with_suffix(".mbtiles")
    print(f"📦 Converting to MBTiles ({tile_format}): {mbtiles_path.name}")
    MBTilesConverterFactory.convert(output_file, mbtiles_path, tile_format=tile_format)

    if upload:
        print(f"☁️  Uploading to Mapbox: {layer_name}")
        upload_to_mapbox(
            source=mbtiles_path,
            display_name=layer_name,
            username=os.getenv("MAPBOX_USER"),
            token=os.getenv("MAPBOX_TOKEN"),
        )

    print(f"✅ Done: {mbtiles_path}")
    return mbtiles_path


# ── Raster ────────────────────────────────────────────────────────────────────

def _process_rasters(
    config_path: str,
    layer_keys: list = None,
    upload_override: Optional[bool] = None,
    upload_layer_keys: Optional[list] = None,
):
    layers = _read_layers(config_path)

    if layer_keys:
        layers = {k: v for k, v in layers.items() if k in layer_keys}

    upload_layer_keys_set = set(upload_layer_keys) if upload_layer_keys is not None else None

    processed_count = 0
    failed_count = 0

    print(f'Found {len(layers)} raster layer(s) to process\n')

    for layer_id, layer_config in layers.items():
        try:
            base_path = Path(layer_config['base_path'])
            input_file = base_path / layer_config['input_file']
            output_file = Path(layer_config['output_file'])

            style_file = None
            if layer_config.get('style_file'):
                style_file = base_path / layer_config['style_file']

            if not input_file.exists():
                print(f'SKIP {layer_id}: Input file not found at {input_file}')
                failed_count += 1
                continue

            upload_flag = _resolve_upload_flag(
                layer_id, layer_config, upload_override, upload_layer_keys_set
            )

            RasterProcessor(
                input_file,
                output_file=output_file,
                qml_file=style_file,
                layer_name=layer_config['layer_name'],
                upload=upload_flag,
                max_zoom=layer_config.get('max_zoom', 11),
            ).process()

            print(f"✅ {layer_id}: {layer_config['layer_name']} (upload={upload_flag})")
            processed_count += 1

        except Exception as e:
            print(f'❌ {layer_id}: {str(e)}')
            failed_count += 1

    print(f'\n📊 Summary: {processed_count} processed, {failed_count} failed')
    return processed_count, failed_count


def process_raster_layers(
    config_path: str,
    layer_keys: list = None,
    upload_override: Optional[bool] = None,
    upload_layer_keys: Optional[list] = None,
    _isolate: bool = True,
):
    """
    Load raster layer configuration and process specified layers.

    Args:
        config_path: Path to YAML config file
        layer_keys: List of layer IDs to process. If None, processes all.
        upload_override: Force upload for all selected layers (True/False).
                         If None, uses upload_layer_keys or YAML config.
        upload_layer_keys: Only these layer IDs upload to Mapbox.
                           Ignored if upload_override is set.
    """
    if not _isolate:
        return _process_rasters(
            config_path=config_path,
            layer_keys=layer_keys,
            upload_override=upload_override,
            upload_layer_keys=upload_layer_keys,
        )

    all_layers = _read_layers(config_path)
    keys_to_run = layer_keys or list(all_layers.keys())
    upload_layer_keys_set = set(upload_layer_keys) if upload_layer_keys is not None else None

    src_path = Path(__file__).resolve().parents[1]

    runner = """
import sys
sys.path.insert(0, sys.argv[3])

from data_processing.process_layers import process_raster_layers

upload_arg = sys.argv[4]
if upload_arg == "none":
    upload_override = None
elif upload_arg == "1":
    upload_override = True
else:
    upload_override = False

processed, failed = process_raster_layers(
    config_path=sys.argv[1],
    layer_keys=[sys.argv[2]],
    _isolate=False,
    upload_override=upload_override
)

sys.exit(1 if failed > 0 else 0)
"""

    ok = 0
    fail = 0

    for key in keys_to_run:
        print(f'\n=== Processing raster {key} in isolated process ===')

        if upload_override is not None:
            upload_arg = '1' if upload_override else '0'
        elif upload_layer_keys_set is not None:
            upload_arg = '1' if key in upload_layer_keys_set else '0'
        else:
            upload_arg = 'none'

        try:
            subprocess.run(
                [
                    sys.executable,
                    '-c',
                    runner,
                    config_path,
                    key,
                    str(src_path),
                    upload_arg,
                ],
                check=True,
            )
            ok += 1
        except subprocess.CalledProcessError:
            print(f'❌ {key}: failed in isolated process')
            fail += 1

    print(f'\n📊 Isolated summary: {ok} succeeded, {fail} failed')
    return ok, fail


# ── Vector ────────────────────────────────────────────────────────────────────

def _process_vectors(
    config_path: str,
    layer_keys: list = None,
    dry_run: bool = False,
    upload_override: Optional[bool] = None,
    upload_layer_keys: Optional[list] = None,
):
    layers = _read_layers(config_path)

    if layer_keys:
        layers = {k: v for k, v in layers.items() if k in layer_keys}

    upload_layer_keys_set = set(upload_layer_keys) if upload_layer_keys is not None else None

    processed_count = 0
    failed_count = 0

    print(f'📋 Found {len(layers)} vector layer(s) to process\n')

    for layer_id, layer_config in layers.items():
        try:
            input_file = Path(layer_config['input_file'])
            output_file = Path(layer_config['output_file'])

            if not input_file.exists():
                print(f'⚠️  SKIP {layer_id}: Input file not found at {input_file}')
                failed_count += 1
                continue

            upload_flag = _resolve_upload_flag(
                layer_id, layer_config, upload_override, upload_layer_keys_set
            )

            if dry_run:
                print(
                    f"✓ DRY RUN {layer_id}: {layer_config['layer_name']} "
                    f"(upload={upload_flag})"
                )
                processed_count += 1
                continue

            VectorProcessor(
                input_file=input_file,
                output_file=output_file,
                layer_name=layer_config['layer_name'],
                min_zoom=layer_config.get('min_zoom', 0),
                max_zoom=layer_config.get('max_zoom', 14),
                upload=upload_flag,
            ).process()

            print(f"✅ {layer_id}: {layer_config['layer_name']} (upload={upload_flag})")
            processed_count += 1

        except Exception as e:
            print(f'❌ {layer_id}: {str(e)}')
            failed_count += 1

    print(f'\n📊 Summary: {processed_count} processed, {failed_count} failed')
    return processed_count, failed_count


def process_vector_layers(
    config_path: str,
    layer_keys: list = None,
    dry_run: bool = False,
    upload_override: Optional[bool] = None,
    upload_layer_keys: Optional[list] = None,
):
    """
    Load vector layer configuration and process specified layers.

    Args:
        config_path: Path to YAML config file
        layer_keys: List of layer IDs to process. If None, processes all.
        dry_run: If True, only validates without processing.
        upload_override: Force upload for all selected layers (True/False).
                         If None, uses upload_layer_keys or YAML config.
        upload_layer_keys: Only these layer IDs upload to Mapbox.
                           Ignored if upload_override is set.
    """
    return _process_vectors(
        config_path=config_path,
        layer_keys=layer_keys,
        dry_run=dry_run,
        upload_override=upload_override,
        upload_layer_keys=upload_layer_keys,
    )

