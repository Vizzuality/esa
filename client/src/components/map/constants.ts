import { CustomMapProps } from './types';

export const DEFAULT_VIEW_STATE = {
  zoom: 2,
  pitch: 0,
  bearing: 0,
  padding: {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  },
};

export const DEFAULT_PROPS: CustomMapProps = {
  id: 'default',
  initialViewState: DEFAULT_VIEW_STATE,
  minZoom: 1,
  maxZoom: 14,
};
