import { MouseEventHandler } from 'react';

import { Marker as RMarker, MarkerProps as RMarkerProps } from 'react-map-gl';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type MarkerProps = RMarkerProps & {
  properties: GeoJSON.GeoJsonProperties;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const Marker = (props: MarkerProps) => {
  const { properties, onClick } = props;
  return (
    <RMarker {...props}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent asChild>
          <div onMouseMove={(e) => e.stopPropagation()}>
            <div className="mb-2 flex  items-center space-x-4">
              <CategoryIcon
                slug={properties?.category}
                className="fill-secondary h-10 w-10 opacity-80"
              />
              <p className="text-xs">{properties?.categoryName}</p>
            </div>
            <p className="text-sm">{properties?.title}</p>
            <p className="mb-4 text-xs italic text-gray-300">{properties?.location}</p>

            <Button
              variant="secondary"
              className="h-8 w-full rounded-3xl bg-teal-500 py-2 text-xs text-white"
              onClick={onClick}
            >
              Discover story
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </RMarker>
  );
};

export default Marker;
