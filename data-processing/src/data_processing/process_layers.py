"""Process raster and vector layers based on YAML configuration."""


import subprocess
import sys
from pathlib import Path
from typing import Optional

import yaml

from .raster_processor import RasterProcessor
from .vector_processor import VectorProcessor

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

from data_processing.process_layers import load_and_process_raster_layers

upload_arg = sys.argv[4]
if upload_arg == "none":
    upload_override = None
elif upload_arg == "1":
    upload_override = True
else:
    upload_override = False

processed, failed = load_and_process_raster_layers(
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

