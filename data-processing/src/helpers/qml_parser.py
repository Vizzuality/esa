"""
A module to parse QML files and extract color mapping information.
"""

import xml.etree.ElementTree as ET  # noqa: N817
from typing import List, NamedTuple, Tuple


class ColorEntry(NamedTuple):
    """A single color stop: raster value → RGBA."""

    value: float
    r: int
    g: int
    b: int
    a: int


def _hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


class QMLParser:
    """
    Parses QML files and exposes color mapping data.

    Supported renderer types:
    - ``colorrampshader DISCRETE``  — items are upper-bound range stops
    - ``colorrampshader INTERPOLATED`` — colors are interpolated between stops
    - ``paletteEntry``              — exact value → color mapping
    """

    @staticmethod
    def parse_full(qml_file_path: str) -> Tuple[str, List[ColorEntry]]:
        """
        Parse a QML file and return the renderer mode and color entries.

        Args:
            qml_file_path: Path to the QML file.

        Returns:
            Tuple of (mode, entries) where mode is one of:
            ``"DISCRETE"``, ``"INTERPOLATED"``, ``"EXACT"``, ``"PALETTE"``.
        """
        tree = ET.parse(qml_file_path)
        root = tree.getroot()

        # --- colorrampshader (DISCRETE / INTERPOLATED / EXACT) ---
        shader = root.find(".//colorrampshader")
        if shader is not None:
            mode = shader.get("colorRampType", "DISCRETE")
            entries = []
            for item in shader.findall("item"):
                value = float(item.get("value"))
                r, g, b = _hex_to_rgb(item.get("color"))
                a = int(item.get("alpha", 255))
                entries.append(ColorEntry(value, r, g, b, a))
            return mode, sorted(entries, key=lambda e: e.value)

        # --- paletteEntry (exact integer palette) ---
        palette_entries = root.findall(".//paletteEntry")
        if palette_entries:
            entries = []
            for pe in palette_entries:
                value = float(pe.get("value"))
                r, g, b = _hex_to_rgb(pe.get("color"))
                a = int(pe.get("alpha", 255))
                entries.append(ColorEntry(value, r, g, b, a))
            return "PALETTE", sorted(entries, key=lambda e: e.value)

        return "UNKNOWN", []

    @staticmethod
    def parse(qml_file_path: str) -> dict:
        """
        Legacy interface: returns a dict mapping int value → hex color string.

        Kept for backwards compatibility; prefer ``parse_full`` for new code.
        """
        _, entries = QMLParser.parse_full(qml_file_path)
        return {int(e.value): f"#{e.r:02x}{e.g:02x}{e.b:02x}" for e in entries}
