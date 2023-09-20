import { ViewState } from "react-map-gl";

export type MarkerType = {
  id?: number;
  name: string;
  lat: number;
  lng: number;
  media: any;
};

export type LocationType = ViewState & {
  bbox: [number, number, number, number];
};
