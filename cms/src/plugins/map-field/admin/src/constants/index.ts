export const id = 'default';
export const map_location_inputs = ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];
export const map_marker_inputs = ['lat', 'lng'];

export const initialLocation = {
  zoom: 1,
  bearing: 0,
  pitch: 0,
  padding: 0,
  bbox: null,
};

export const CONTROLS: Partial<Record<string, { min: number; max: number }>> = {
  latitude: {
    max: 90,
    min: -90,
  },
  longitude: {
    max: 180,
    min: -180,
  },
  zoom: {
    max: 22,
    min: 0,
  },
  bearing: {
    max: 180,
    min: -180,
  },
  pitch: {
    max: 85,
    min: 0,
  },
};

export const MAPBOX_ACCESS_TOKEN = process.env.STRAPI_ADMIN_MAPBOX_ACCESS_TOKEN;
export const USERNAME = process.env.STRAPI_ADMIN_MAPBOX_USERNAME;
export const STYLE_ID = process.env.STRAPI_ADMIN_MAPBOX_STYLE_ID;
export const WIDTH = 500;
export const HEIGHT = 300;
export const MAX_PITCH = 60; // If the pitch is higher than 60, the image crashes
export const MARKER_ZOOM = 1;

export const apiBaseUrl = process.env.STRAPI_ADMIN_API_BASE_URL;
