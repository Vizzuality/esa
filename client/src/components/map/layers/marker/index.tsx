import { Marker as RMarker, MarkerProps as RMarkerProps } from 'react-map-gl';

import { cn } from '@/lib/classnames';

const Marker = (props: RMarkerProps) => {
  return (
    <RMarker {...props}>
      <div
        className={cn({
          'animate-in zoom-in relative flex h-6 w-6 cursor-pointer items-center justify-center duration-150':
            true,
        })}
      >
        <div
          className={cn({
            'absolute left-1/2 top-1/2 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border border-[#FFE094] transition-all':
              true,
            'scale-[2] bg-[#FFE094]': true,
          })}
        >
          <div className="h-1.5 w-1.5 bg-[#FFE094]"></div>
        </div>
      </div>
    </RMarker>
  );
};

export default Marker;
