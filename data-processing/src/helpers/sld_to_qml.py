"""Convert OGC SLD raster ColorMap files to QGIS QML format.

Usage:
    python sld_to_qml.py input.sld                  # writes input.qml next to input.sld
    python sld_to_qml.py input.sld output.qml       # explicit output path
    python sld_to_qml.py *.sld                      # batch convert all SLDs in a folder
"""

import argparse
import xml.etree.ElementTree as ET
from pathlib import Path


def parse_sld(sld_path):
    """Extract color map entries from an SLD file."""
    tree = ET.parse(sld_path)
    root = tree.getroot()
    entries = []
    for entry in root.iter("{http://www.opengis.net/sld}ColorMapEntry"):
        color = entry.get("color")
        quantity = entry.get("quantity")
        label = entry.get("label", "")
        entries.append((float(quantity), color, label))
    return entries


def hex_to_rgba_str(hex_color):
    """Convert #RRGGBB to QGIS 'R,G,B,255,rgb:r,g,b,1' format."""
    h = hex_color.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    rf, gf, bf = r / 255.0, g / 255.0, b / 255.0
    return f"{r},{g},{b},255,rgb:{rf},{gf},{bf},1"


def build_gradient_stops(entries):
    """Build QGIS gradient stops string from color entries."""
    if len(entries) < 3:
        return ""
    min_val = entries[0][0]
    max_val = entries[-1][0]
    val_range = max_val - min_val
    if val_range == 0:
        return ""
    stops = []
    for val, color, _label in entries[1:-1]:
        pos = (val - min_val) / val_range
        rgba = hex_to_rgba_str(color)
        stops.append(f"{pos:.6f};{rgba};rgb;ccw")
    return ":".join(stops)


def generate_qml(entries, output_path):
    """Generate a QGIS QML file from SLD color map entries."""
    min_val = entries[0][0]
    max_val = entries[-1][0]
    color1_rgba = hex_to_rgba_str(entries[0][1])
    color2_rgba = hex_to_rgba_str(entries[-1][1])
    stops_str = build_gradient_stops(entries)

    item_lines = []
    for val, color, label in entries:
        item_lines.append(
            f'          <item color="{color}" value="{val}" alpha="255" label="{label}"/>'
        )
    items_xml = "\n".join(item_lines)

    stops_option = ""
    if stops_str:
        stops_option = f'\n              <Option name="stops" value="{stops_str}" type="QString"/>'

    qml = f'''<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.40.5-Bratislava" hasScaleBasedVisibilityFlag="0" styleCategories="AllStyleCategories" autoRefreshMode="Disabled" autoRefreshTime="0" maxScale="0" minScale="1e+08">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
    <Private>0</Private>
  </flags>
  <temporal mode="0" enabled="0" fetchMode="0" bandNumber="1">
    <fixedRange>
      <start></start>
      <end></end>
    </fixedRange>
  </temporal>
  <elevation mode="RepresentsElevationSurface" enabled="0" zscale="1" band="1" symbology="Line" zoffset="0">
    <data-defined-properties>
      <Option type="Map">
        <Option type="QString" value="" name="name"/>
        <Option name="properties"/>
        <Option type="QString" value="collection" name="type"/>
      </Option>
    </data-defined-properties>
    <profileLineSymbol>
      <symbol alpha="1" force_rhr="0" type="line" frame_rate="10" clip_to_extent="1" is_animated="0" name="">
        <data_defined_properties>
          <Option type="Map">
            <Option type="QString" value="" name="name"/>
            <Option name="properties"/>
            <Option type="QString" value="collection" name="type"/>
          </Option>
        </data_defined_properties>
        <layer class="SimpleLine" pass="0" id="{{{{auto}}}}" enabled="1" locked="0">
          <Option type="Map">
            <Option type="QString" value="0" name="align_dash_pattern"/>
            <Option type="QString" value="square" name="capstyle"/>
            <Option type="QString" value="5;2" name="customdash"/>
            <Option type="QString" value="3x:0,0,0,0,0,0" name="customdash_map_unit_scale"/>
            <Option type="QString" value="MM" name="customdash_unit"/>
            <Option type="QString" value="0" name="dash_pattern_offset"/>
            <Option type="QString" value="3x:0,0,0,0,0,0" name="dash_pattern_offset_map_unit_scale"/>
            <Option type="QString" value="MM" name="dash_pattern_offset_unit"/>
            <Option type="QString" value="0" name="draw_inside_polygon"/>
            <Option type="QString" value="bevel" name="joinstyle"/>
            <Option type="QString" value="141,90,153,255,rgb:0.55294117647058827,0.35294117647058826,0.59999999999999998,1" name="line_color"/>
            <Option type="QString" value="solid" name="line_style"/>
            <Option type="QString" value="0.6" name="line_width"/>
            <Option type="QString" value="MM" name="line_width_unit"/>
            <Option type="QString" value="0" name="offset"/>
            <Option type="QString" value="3x:0,0,0,0,0,0" name="offset_map_unit_scale"/>
            <Option type="QString" value="MM" name="offset_unit"/>
            <Option type="QString" value="0" name="ring_filter"/>
            <Option type="QString" value="0" name="trim_distance_end"/>
            <Option type="QString" value="3x:0,0,0,0,0,0" name="trim_distance_end_map_unit_scale"/>
            <Option type="QString" value="MM" name="trim_distance_end_unit"/>
            <Option type="QString" value="0" name="trim_distance_start"/>
            <Option type="QString" value="3x:0,0,0,0,0,0" name="trim_distance_start_map_unit_scale"/>
            <Option type="QString" value="MM" name="trim_distance_start_unit"/>
            <Option type="QString" value="0" name="tweak_dash_pattern_on_corners"/>
            <Option type="QString" value="0" name="use_custom_dash"/>
            <Option type="QString" value="3x:0,0,0,0,0,0" name="width_map_unit_scale"/>
          </Option>
          <data_defined_properties>
            <Option type="Map">
              <Option type="QString" value="" name="name"/>
              <Option name="properties"/>
              <Option type="QString" value="collection" name="type"/>
            </Option>
          </data_defined_properties>
        </layer>
      </symbol>
    </profileLineSymbol>
    <profileFillSymbol>
      <symbol alpha="1" force_rhr="0" type="fill" frame_rate="10" clip_to_extent="1" is_animated="0" name="">
        <data_defined_properties>
          <Option type="Map">
            <Option type="QString" value="" name="name"/>
            <Option name="properties"/>
            <Option type="QString" value="collection" name="type"/>
          </Option>
        </data_defined_properties>
        <layer class="SimpleFill" pass="0" id="{{{{auto}}}}" enabled="1" locked="0">
          <Option type="Map">
            <Option type="QString" value="3x:0,0,0,0,0,0" name="border_width_map_unit_scale"/>
            <Option type="QString" value="141,90,153,255,rgb:0.55294117647058827,0.35294117647058826,0.59999999999999998,1" name="color"/>
            <Option type="QString" value="bevel" name="joinstyle"/>
            <Option type="QString" value="0,0" name="offset"/>
            <Option type="QString" value="3x:0,0,0,0,0,0" name="offset_map_unit_scale"/>
            <Option type="QString" value="MM" name="offset_unit"/>
            <Option type="QString" value="35,35,35,255,rgb:0.13725490196078433,0.13725490196078433,0.13725490196078433,1" name="outline_color"/>
            <Option type="QString" value="no" name="outline_style"/>
            <Option type="QString" value="0.26" name="outline_width"/>
            <Option type="QString" value="MM" name="outline_width_unit"/>
            <Option type="QString" value="solid" name="style"/>
          </Option>
          <data_defined_properties>
            <Option type="Map">
              <Option type="QString" value="" name="name"/>
              <Option name="properties"/>
              <Option type="QString" value="collection" name="type"/>
            </Option>
          </data_defined_properties>
        </layer>
      </symbol>
    </profileFillSymbol>
  </elevation>
  <customproperties>
    <Option type="Map">
      <Option type="bool" value="false" name="WMSBackgroundLayer"/>
      <Option type="bool" value="false" name="WMSPublishDataSourceUrl"/>
      <Option type="int" value="0" name="embeddedWidgets/count"/>
      <Option type="QString" value="Value" name="identify/format"/>
    </Option>
  </customproperties>
  <mapTip enabled="1"></mapTip>
  <pipe-data-defined-properties>
    <Option type="Map">
      <Option type="QString" value="" name="name"/>
      <Option name="properties"/>
      <Option type="QString" value="collection" name="type"/>
    </Option>
  </pipe-data-defined-properties>
  <pipe>
    <provider>
      <resampling zoomedOutResamplingMethod="nearestNeighbour" maxOversampling="2" zoomedInResamplingMethod="nearestNeighbour" enabled="false"/>
    </provider>
    <rasterrenderer classificationMin="{min_val}" classificationMax="{max_val}" nodataColor="" type="singlebandpseudocolor" band="1" alphaBand="-1" opacity="1">
      <rasterTransparency/>
      <minMaxOrigin>
        <limits>None</limits>
        <extent>WholeRaster</extent>
        <statAccuracy>Estimated</statAccuracy>
        <cumulativeCutLower>0.02</cumulativeCutLower>
        <cumulativeCutUpper>0.98</cumulativeCutUpper>
        <stdDevFactor>2</stdDevFactor>
      </minMaxOrigin>
      <rastershader>
        <colorrampshader clip="0" colorRampType="INTERPOLATED" minimumValue="{min_val}" maximumValue="{max_val}" classificationMode="1" labelPrecision="4">
          <colorramp type="gradient" name="[source]">
            <Option type="Map">
              <Option type="QString" value="{color1_rgba}" name="color1"/>
              <Option type="QString" value="{color2_rgba}" name="color2"/>
              <Option type="QString" value="ccw" name="direction"/>
              <Option type="QString" value="0" name="discrete"/>
              <Option type="QString" value="gradient" name="rampType"/>
              <Option type="QString" value="rgb" name="spec"/>{stops_option}
            </Option>
          </colorramp>
{items_xml}
          <rampLegendSettings suffix="" direction="0" prefix="" maximumLabel="" useContinuousLegend="1" minimumLabel="" orientation="2">
            <numericFormat id="basic">
              <Option type="Map">
                <Option name="decimal_separator" type="invalid"/>
                <Option name="decimals" value="6" type="int"/>
                <Option name="rounding_type" value="0" type="int"/>
                <Option name="show_plus" value="false" type="bool"/>
                <Option name="show_thousand_separator" value="true" type="bool"/>
                <Option name="show_trailing_zeros" value="false" type="bool"/>
                <Option name="thousand_separator" type="invalid"/>
              </Option>
            </numericFormat>
          </rampLegendSettings>
        </colorrampshader>
      </rastershader>
    </rasterrenderer>
    <brightnesscontrast gamma="1" contrast="0" brightness="0"/>
    <huesaturation colorizeGreen="128" colorizeStrength="100" invertColors="0" saturation="0" colorizeOn="0" colorizeBlue="128" grayscaleMode="0" colorizeRed="255"/>
    <rasterresampler maxOversampling="2"/>
    <resamplingStage>resamplingFilter</resamplingStage>
  </pipe>
  <blendMode>0</blendMode>
</qgis>
'''
    Path(output_path).write_text(qml)
    print(f"Created: {output_path} ({len(entries)} color stops)")


def main():
    parser = argparse.ArgumentParser(
        description="Convert OGC SLD raster ColorMap files to QGIS QML format."
    )
    parser.add_argument("sld_files", nargs="+", type=Path, help="SLD file(s) to convert")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Output QML path (only valid with a single input file)",
    )
    args = parser.parse_args()

    if args.output and len(args.sld_files) > 1:
        parser.error("-o/--output can only be used with a single input file")

    for sld_path in args.sld_files:
        if not sld_path.exists():
            print(f"SKIP (not found): {sld_path}")
            continue
        qml_path = args.output if args.output else sld_path.with_suffix(".qml")
        entries = parse_sld(sld_path)
        if not entries:
            print(f"SKIP (no ColorMapEntry found): {sld_path}")
            continue
        generate_qml(entries, qml_path)


if __name__ == "__main__":
    main()
