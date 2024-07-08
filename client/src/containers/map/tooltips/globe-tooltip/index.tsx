import { MarkerProps as RMarkerProps, Popup as RPopup } from 'react-map-gl';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';

interface GlobeTooltipProps extends RMarkerProps {
  properties: GeoJSON.GeoJsonProperties;
}

const GlobeTooltip = (props: GlobeTooltipProps) => {
  const { properties, onClick } = props;

  return (
    <RPopup
      {...props}
      className={cn({
        'home-tooltip items-left relative flex w-56 -translate-x-1/2 cursor-pointer flex-col justify-center rounded border border-white bg-[#335E6F80] px-6 py-4 text-white transition-opacity':
          true,
      })}
    >
      <div>
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
          onClick={onClick as () => void}
        >
          Discover story
        </Button>
      </div>
    </RPopup>
  );
};

export default GlobeTooltip;
