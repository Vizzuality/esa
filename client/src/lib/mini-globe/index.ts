import type { Feature, Polygon as GeoPolygon } from 'geojson';

const toRad = (d: number) => (d * Math.PI) / 180;

const metersToLngLat = (meters: number, lat: number) => {
  const dLat = meters / 111320;
  const dLng = meters / (111320 * Math.cos(toRad(lat)));
  return [dLng, dLat] as const;
};

export function pointToRoundedSquare(
  lng: number,
  lat: number,
  sizeKm = 20,
  cornerRadiusKm = 3,
  steps = 10
): Feature<GeoPolygon> {
  const half = (sizeKm * 1000) / 2;
  const r = cornerRadiusKm * 1000;

  const [dx, dy] = metersToLngLat(half, lat);
  const [rx, ry] = metersToLngLat(r, lat);

  const minLng = lng - dx;
  const maxLng = lng + dx;
  const minLat = lat - dy;
  const maxLat = lat + dy;

  const corners = [
    { cx: maxLng - rx, cy: maxLat - ry, start: 0, end: 90 }, // top-right
    { cx: minLng + rx, cy: maxLat - ry, start: 90, end: 180 }, // top-left
    { cx: minLng + rx, cy: minLat + ry, start: 180, end: 270 }, // bottom-left
    { cx: maxLng - rx, cy: minLat + ry, start: 270, end: 360 }, // bottom-right
  ];

  const coords: number[][] = [];
  for (const { cx, cy, start, end } of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = toRad(start + ((end - start) * i) / steps);
      coords.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
  }
  coords.push(coords[0]);

  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [coords] },
  };
}
