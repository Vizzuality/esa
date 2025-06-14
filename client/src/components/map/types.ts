import type { ViewState, MapProps, Projection } from 'react-map-gl';

import { FitBoundsOptions } from 'mapbox-gl';
export interface CustomMapProps extends MapProps {
  id: string;
  /** A function that returns the map instance */
  children?: React.ReactNode;

  projection?: Projection;

  /** Custom css class for styling */
  className?: string;

  /** An string that defines the rotation axis */
  constrainedAxis?: 'x' | 'y';

  /** An object that defines the bounds */
  bounds?: {
    bbox: readonly [number, number, number, number];
    options?: FitBoundsOptions;
    viewportOptions?: Partial<ViewState>;
  };

  /** A function that exposes the viewport */
  onMapViewStateChange?: (viewstate: Partial<ViewState>) => void;
}
