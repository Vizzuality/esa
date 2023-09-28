import { Bbox } from './map';

export type StoryStepMapLocation = {
  longitude: number;
  latitude: number;
  pitch: number;
  bearing: number;
  zoom: number;
  bbox: Bbox;
};

export type StoryStepMapMarkerMedia = {
  mime: string;
  url: string;
  formats?: {
    thumbnail: {
      url: string;
    };
  };
};

export type StoryStepMapMarker = {
  id: number;
  lng: number;
  lat: number;
  media: StoryStepMapMarkerMedia;
  name: string;
};

export type StoryStepMap = {
  location: StoryStepMapLocation;
  markers: StoryStepMapMarker[];
};
