import { MouseEventHandler, useState } from 'react';

import { Marker as RMarker, MarkerProps as RMarkerProps } from 'react-map-gl';

import { cn } from '@/lib/classnames';

interface MarkerProps extends RMarkerProps {
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

const Marker = (props: MarkerProps) => {
  const { onMouseEnter, onMouseLeave } = props;
  const [hover, setHover] = useState(false);

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (e) => {
    if (onMouseEnter) onMouseEnter(e);
    setHover(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
    if (onMouseLeave) onMouseLeave(e);
    setHover(false);
  };

  return (
    <RMarker {...props}>
      <div
        className={cn({
          'flex h-3 w-3 rotate-45 cursor-pointer items-center justify-center border border-[#FFE094] transition-all':
            true,
          'scale-[2] bg-[#FFE094]': hover,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-1.5 w-1.5 bg-[#FFE094]"></div>
      </div>
    </RMarker>
  );
};

export default Marker;
