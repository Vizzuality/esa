'use client';

import { Marker as RMarker } from 'react-map-gl';

import { XIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useIsMobile } from '@/hooks/screen-size';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';

type MarkerProps = {
  markers?: (GeoJSON.Feature<GeoJSON.Point> | null)[];
  handleClick: (id: string | number) => void;
  handleClose?: () => void;
};

const Marker = ({ markers, handleClick, handleClose }: MarkerProps) => {
  const { coordinates } = markers?.[0]?.geometry || {};

  const isMobile = useIsMobile();

  if (!coordinates?.length) return null;

  const MARKER = () => (
    <div className="pointer-events-auto relative flex w-full items-center">
      <div
        className={cn({
          'relative z-50 hidden h-6 w-6 -translate-x-1/2 cursor-pointer items-center justify-center sm:flex':
            true,
        })}
      >
        <div
          className={cn({
            'absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border-[1.5px] border-[#FFE094] transition-all':
              true,
            'bg-background scale-[1.25] border-gray-200': true,
          })}
        >
          <div className="h-[5px] w-[5px] bg-gray-200"></div>
        </div>
      </div>

      <div className="mx-4 w-full max-w-full rounded border border-gray-700 bg-[rgba(51,94,111,0.50)] px-0 text-white backdrop-blur-lg sm:mx-0 sm:max-w-[230px] sm:-translate-x-6">
        {markers?.map((marker) => {
          if (!marker || !marker?.id) return null;
          return (
            <div
              className="border-b border-b-gray-700 p-6 last-of-type:border-b-0 sm:py-4"
              key={marker.id}
              onMouseMove={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex  items-center space-x-4">
                <CategoryIcon
                  slug={marker?.properties?.category}
                  className="h-10 w-10 shrink-0 fill-transparent stroke-teal-300 opacity-80"
                />
                <p className="font-open-sans text-xs">{marker?.properties?.categoryName}</p>
                <Button
                  className="absolute right-0 top-0 sm:hidden"
                  size="icon"
                  variant="icon"
                  onClick={handleClose}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
              <p className="font-notes text-sm">{marker?.properties?.title}</p>
              <p className="font-open-sans mb-4 mt-2 text-xs italic text-gray-300">
                {marker?.properties?.location}
              </p>

              <Button
                variant="secondary"
                className="h-8 w-full rounded-3xl bg-teal-500 py-2 text-xs text-white hover:bg-teal-500/50"
                onClick={() => !!marker.id && handleClick(marker.id)}
                disabled={!marker?.properties?.active}
              >
                Discover story
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return isMobile ? (
    <div className="pointer-events-none absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
      <MARKER />
    </div>
  ) : (
    <RMarker anchor="left" latitude={coordinates[1]} longitude={coordinates[0]}>
      <MARKER />
    </RMarker>
  );
};

export default Marker;
