import { Story } from './generated/strapi.schemas';

export type Bbox = [number, number, number, number];

export const LEGEND_TYPE = ['basic', 'choropleth', 'gradient'] as const;

export type LegendType = (typeof LEGEND_TYPE)[number];

export type Legend = {
  type: LegendType;
  title: string;
  info?: string;
  description?: string;
  items?: { color: string; value: string }[];
  intersections?: { id: number; color: string }[];
};

export type HomeMarkerFeatureProperty = Omit<Story, 'category'> & {
  category: string;
};

export type HomeMarkerFeature = {
  type: 'Feature';
  bbox: Bbox;
  id: number;
  geometry: {
    type: 'Point';
    coordinates: number[];
  };
  properties: HomeMarkerFeatureProperty;
};
