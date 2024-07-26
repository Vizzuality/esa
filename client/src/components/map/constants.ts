import type { ViewState } from 'react-map-gl';

import { CustomMapProps } from './types';

export const DEFAULT_VIEW_STATE: Partial<ViewState> = {
  zoom: 2,
  latitude: 0,
  longitude: 0,
};

export const DEFAULT_PROPS: CustomMapProps = {
  id: 'default',
  initialViewState: DEFAULT_VIEW_STATE,
  minZoom: 1,
  maxZoom: 14,
};
