import { useState } from 'react';

import { Marker as RMarker, MarkerProps as RMarkerProps } from 'react-map-gl';

import { cn } from '@/lib/classnames';

const StoryClusterMarker = (props: RMarkerProps) => {
  const [hover, setHover] = useState(false);

  return (
    <RMarker {...props}>
      <div
        className={cn({
          'flex h-3 w-3 rotate-45 cursor-pointer items-center justify-center border border-blue-500 transition-all':
            true,
          'scale-[2] bg-blue-500': hover,
        })}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="h-1.5 w-1.5 bg-blue-500"></div>
      </div>
    </RMarker>
  );
};

export default StoryClusterMarker;
