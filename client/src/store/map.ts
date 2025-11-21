import { MapLayerMouseEvent } from 'react-map-gl';

import { MotionValue, motionValue } from 'framer-motion';
import { atom } from 'jotai';
import { MapboxGeoJSONFeature } from 'mapbox-gl';

export type TmpBbox = {
  bbox: readonly [number, number, number, number];
  options: {
    zoom: number;
    pitch: number;
    bearing: number;
    longitude: number;
    latitude: number;
  };
};

// Map settings
export const mapSettingsAtom = atom({
  basemap: 'basemap-satellite',
  labels: 'labels-none',
  boundaries: false,
  roads: false,
});

// Map viewport
export const bboxAtom = atom<readonly [number, number, number, number] | null | undefined>(null);

export const tmpBboxAtom = atom<TmpBbox | undefined>(undefined);

// Sidebar and menus
export const sidebarOpenAtom = atom<boolean>(true);

// Map layers
export const layersAtom = atom<number[]>([]);

export type LayersSettingsAtom = Record<number, Record<string, string | number | boolean>>;
export const layersSettingsAtom = atom<LayersSettingsAtom>({});

export const layersInteractiveAtom = atom<number[]>([]);

export const layersInteractiveIdsAtom = atom<string[]>([
  'story-markers-cluster',
  'story-markers-cluster-count',
  'story-markers-unclustered',
]);

export const popupAtom = atom<MapLayerMouseEvent | null>(null);

export const markerAtom = atom<MapboxGeoJSONFeature | null>(null);

export const DEFAULT_SETTINGS = {
  expand: true,
};

export const timelineAtom = atom<{ [id: number]: { frame: number; layers: number[] } }>({});
export const categoriesAtom = atom<{ [id: number]: { frame: number; layers: number[] } }>({});
export const mapScrollAtom = atom<MotionValue<number>>(motionValue(0));
