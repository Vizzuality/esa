"""Process animated PNG layers based on YAML configuration."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

import numpy as np
import yaml
from matplotlib.colors import LinearSegmentedColormap

from data_processing.animated_tiles import AnimatedTiles


def _hex_to_rgba(color: str) -> Tuple[int, int, int, int]:
    h = color.lstrip("#")
    if len(h) != 6:
        raise ValueError(f"Invalid hex color: {color}")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4)) + (255,)


def _to_rgba(color: Any) -> Tuple[int, int, int, int]:
    if isinstance(color, str):
        return _hex_to_rgba(color)
    if isinstance(color, (list, tuple)):
        if len(color) == 3:
            return int(color[0]), int(color[1]), int(color[2]), 255
        if len(color) == 4:
            return int(color[0]), int(color[1]), int(color[2]), int(color[3])
    raise ValueError(f"Unsupported color format: {color}")


def _linear_colormap(colors: List[Any]) -> Dict[int, Tuple[int, int, int, int]]:
    palette = LinearSegmentedColormap.from_list("palette", colors, 256)
    x = np.linspace(0, 1, 256)
    rgba = (palette(x) * 255).astype("uint8")
    return {i: tuple(int(v) for v in rgba[i]) for i in range(256)}


def _single_colormap(color: Any) -> Dict[int, Tuple[int, int, int, int]]:
    c = _to_rgba(color)
    return dict.fromkeys(range(256), c)


def _categorical_colormap(values: Dict[Any, Any]) -> Dict[int, Tuple[int, int, int, int]]:
    out: Dict[int, Tuple[int, int, int, int]] = {}
    for k, v in values.items():
        out[int(k)] = _to_rgba(v)
    return out


def _binned_colormap(
    intervals: List[float], colors: List[Any], vmin: float, vmax: float
) -> Dict[int, Tuple[int, int, int, int]]:
    colors_rgba = np.array([_to_rgba(c) for c in colors], dtype=np.uint8)
    bins = np.clip((np.array(intervals) - vmin) / (vmax - vmin) * 255, 0, 255)
    cmap = np.zeros((256, 4), dtype=np.uint8)

    for i in range(256):
        idx = np.digitize(i, bins, right=False) - 1
        idx = max(0, min(idx, len(colors_rgba) - 1))
        cmap[i] = colors_rgba[idx]

    return {i: tuple(int(v) for v in cmap[i]) for i in range(256)}


def _sld_gradient_colormap(
    breakpoints: List[float],
    colors: List[Any],
    vmin: float,
    vmax: float,
    transparent_below: Optional[float] = None,
) -> Dict[int, Tuple[int, int, int, int]]:
    colors_rgba = np.array([_to_rgba(c) for c in colors], dtype=np.uint8)
    cmap = np.zeros((256, 4), dtype=np.uint8)

    for i in range(256):
        val = (i / 255.0) * (vmax - vmin) + vmin

        if transparent_below is not None and val < transparent_below:
            cmap[i] = (0, 0, 0, 0)
            continue

        if val >= breakpoints[-1]:
            cmap[i] = colors_rgba[-1]
            continue

        painted = False
        for j in range(len(breakpoints) - 1):
            lo, hi = breakpoints[j], breakpoints[j + 1]
            if lo <= val < hi:
                t = (val - lo) / (hi - lo)
                c = colors_rgba[j] * (1 - t) + colors_rgba[j + 1] * t
                cmap[i] = c.astype(np.uint8)
                painted = True
                break

        if not painted:
            cmap[i] = colors_rgba[0]

    return {i: tuple(int(v) for v in cmap[i]) for i in range(256)}


def _linear_clamped_colormap(
    colors: List[Any],
    vmin: float,
    vmax: float,
    clip_max_value: float,
) -> Dict[int, Tuple[int, int, int, int]]:
    if vmax <= vmin:
        raise ValueError(f"Invalid range: vmin={vmin} must be < vmax={vmax}")

    # Convert clip value to palette index [0..255]
    cutoff = int(round(((clip_max_value - vmin) / (vmax - vmin)) * 255))
    cutoff = max(0, min(255, cutoff))

    # No clamp effect -> same as linear
    if cutoff == 255:
        return _linear_colormap(colors)

    base = _linear_colormap(colors)
    max_color = base[255]

    # Clip at/below vmin => everything uses top color
    if cutoff <= 0:
        return dict.fromkeys(range(256), max_color)

    cm: Dict[int, Tuple[int, int, int, int]] = {}
    for i in range(256):
        if i <= cutoff:
            # Stretch full gradient into [0..cutoff]
            src_idx = int(round((i / cutoff) * 255))
            cm[i] = base[src_idx]
        else:
            # Values above clip_max_value are flattened to top color
            cm[i] = max_color
    return cm


def _apply_transparency(
    cm: Dict[int, Tuple[int, int, int, int]], transparent_values: Iterable[int]
) -> None:
    for v in transparent_values:
        cm[int(v)] = (0, 0, 0, 0)


def _build_colormap(layer: Dict[str, Any]) -> Dict[int, Tuple[int, int, int, int]]:
    """Build a 256-entry RGBA colormap from layer config.

    Supported `colormap.type` values:

    - `linear`
      Continuous gradient across full data range `[vmin, vmax]`.
      Required keys: `colors`.

    - `linear_clamped`
      Continuous gradient up to `clip_max_value`, then flattened to the top color
      for all values above that threshold.
      Required keys: `colors`, `clip_max_value`.

    - `single`
      One fixed color for all palette entries.
      Required key: `color`.

    - `categorical`
      Discrete class mapping (exact value -> color).
      Required key: `values` (dict).

    - `binned`
      Stepwise classes by intervals (range bins, no interpolation inside bin).
      Required keys: `intervals`, `colors`.

    - `sld_gradient`
      Piecewise linear interpolation between breakpoint colors.
      Optional: `transparent_below`.
      Required keys: `breakpoints`, `colors`.
    """
    cfg = layer["colormap"]
    ctype = cfg["type"]
    vmin = float(layer["vmin"])
    vmax = float(layer["vmax"])

    if ctype == "linear":
        cm = _linear_colormap(cfg["colors"])
    elif ctype == "single":
        cm = _single_colormap(cfg["color"])
    elif ctype == "categorical":
        cm = _categorical_colormap(cfg["values"])
    elif ctype == "binned":
        cm = _binned_colormap(cfg["intervals"], cfg["colors"], vmin, vmax)
    elif ctype == "sld_gradient":
        cm = _sld_gradient_colormap(
            cfg["breakpoints"],
            cfg["colors"],
            vmin,
            vmax,
            cfg.get("transparent_below"),
        )
    elif ctype == "linear_clamped":
        clip_max_value = float(cfg.get("clip_max_value", vmax))
        cm = _linear_clamped_colormap(cfg["colors"], vmin, vmax, clip_max_value)
    else:
        raise ValueError(f"Unsupported colormap type: {ctype}")

    if "transparent_values" in cfg:
        _apply_transparency(cm, cfg["transparent_values"])

    if cfg.get("reserve_zero_transparent"):
        cm[0] = (0, 0, 0, 0)

    return cm


def _resolve_path(base_dir: Path, value: str) -> str:
    p = Path(value)
    return str(p if p.is_absolute() else (base_dir / p).resolve())


def process_animated_layers(
    config_path: str,
    layer_ids: Optional[List[str]] = None,
) -> None:
    """Process animated layers defined in a YAML config.

    Args:
        config_path: Path to the animated layer YAML configuration file.
        layer_ids: Optional list of layer IDs to process. If None, process all layers.
    """
    config_file = Path(config_path).resolve()
    config_dir = config_file.parent

    with config_file.open("r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    layers = config.get("layers", {})
    selected_ids = layer_ids if layer_ids else list(layers.keys())

    for layer_id in selected_ids:
        if layer_id not in layers:
            raise KeyError(f"Layer not found in config: {layer_id}")

        layer = layers[layer_id]
        cm = _build_colormap(layer)

        animated_tiles = AnimatedTiles(
            data=_resolve_path(config_dir, layer["input_folder"]),
            output_folder=_resolve_path(config_dir, layer["output_folder"]),
            min_z=int(layer["min_z"]),
            max_z=int(layer["max_z"]),
            color_map=cm,
            vmin=float(layer["vmin"]),
            vmax=float(layer["vmax"]),
            engine=layer.get("engine", "rasterio"),
            date_format=layer.get("date_format"),
        )

        animated_tiles.create()
