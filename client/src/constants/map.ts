import env from '@/env.mjs';

export const MAPBOX_STYLES = {
  default: `mapbox://styles/${env.NEXT_PUBLIC_MAPBOX_USERNAME}/${env.NEXT_PUBLIC_MAPBOX_STYLE_ID}?fresh=true`,
};

export const DEFAULT_MAP_STATE = {
  longitude: 88.02275451177093,
  latitude: 21.494431648547703,
  zoom: 2.01,
  pitch: 0,
  bearing: 0,
};

export const DEFAULT_MAP_BBOX: [number, number, number, number] = [-8.51, -39.07, 184.56, 82.06];
