import { CustomMapProps } from './types';

export const DEFAULT_VIEW_STATE = {
  zoom: 2,
  pitch: 0,
  bearing: 0,
  padding: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
};

export const DEFAULT_MOBILE_ZOOM = 0.75;

export const DEFAULT_PROPS: CustomMapProps = {
  id: 'default',
  initialViewState: DEFAULT_VIEW_STATE,
  minZoom: DEFAULT_MOBILE_ZOOM,
  maxZoom: 14,
};
