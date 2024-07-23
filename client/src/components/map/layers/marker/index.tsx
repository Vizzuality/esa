import { Marker as RMarker } from 'react-map-gl';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';

type MarkerProps = {
  markers?: (GeoJSON.Feature<GeoJSON.Point> | null)[];
  handleClick: (id: string | number) => void;
};

const Marker = ({ markers, handleClick }: MarkerProps) => {
  const { coordinates } = markers?.[0]?.geometry || {};
  if (!coordinates?.length) return null;
  return (
    <RMarker anchor="left" latitude={coordinates[1]} longitude={coordinates[0]}>
      <div className="flex items-center">
        <div
          className={cn({
            'relative z-50 flex h-6 w-6 -translate-x-1/2 cursor-pointer items-center justify-center':
              true,
          })}
        >
          <div
            className={cn({
              'absolute left-1/2 top-1/2 flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border-[1.5px] border-[#FFE094] transition-all':
                true,
              'bg-background scale-[1.25] border-gray-200': true,
            })}
          >
            <div className="h-[5px] w-[5px] bg-gray-200"></div>
          </div>
        </div>

        <div className="max-w-[230px] -translate-x-6 rounded border border-gray-700 bg-[rgba(51,94,111,0.50)] px-0 text-white backdrop-blur-lg">
          {markers?.map((marker) => {
            if (!marker || !marker?.id) return null;
            return (
              <div
                className="border-b border-b-gray-700 p-4 last-of-type:border-b-0"
                key={marker.id}
                onMouseMove={(e) => e.stopPropagation()}
              >
                <div className="mb-2 flex  items-center space-x-4">
                  <CategoryIcon
                    slug={marker?.properties?.category}
                    className="h-10 w-10 fill-transparent stroke-teal-300 opacity-80"
                  />
                  <p className="font-open-sans text-xs">{marker?.properties?.categoryName}</p>
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
    </RMarker>
  );
};

export default Marker;
