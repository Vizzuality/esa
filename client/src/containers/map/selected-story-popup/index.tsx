'use client';

import { useCallback } from 'react';

import { Popup } from 'react-map-gl';

import { useRouter } from 'next/navigation';

import { HomeMarkerFeature } from '@/types/map';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';

type HomeSelectedStoryMarkerProps = {
  marker: HomeMarkerFeature;
  handleClose: () => void;
};
const { place, country } = { place: 'place', country: 'country' };

const HomeSelectedStoryMarker = ({ marker, handleClose }: HomeSelectedStoryMarkerProps) => {
  const { push } = useRouter();

  const handleNavigate = useCallback(() => {
    handleClose();
    push(`/stories/${marker.id}`);
  }, [handleClose, marker.id, push]);

  if (!marker?.properties) return null;

  const { category: _category, latitude, longitude, title } = marker.properties;
  const category = JSON.parse(_category);

  return (
    <Popup
      closeButton
      onClose={handleClose}
      anchor="left"
      key={marker.id}
      longitude={longitude}
      latitude={latitude}
      maxWidth="250px"
    >
      <div
        onMouseOver={(e) => e.stopPropagation()}
        className="space-y-2 rounded-sm border border-white bg-[hsla(197,37%,32%,0.5)]  px-6 py-4 shadow-[0_0_10px_0] backdrop-blur-xl"
      >
        <div className="shrink-0">
          <div className="flex items-center gap-4">
            <CategoryIcon className="fill-teal-300" slug={category?.slug} />
            <p className="font-open-sans text-sm text-white">{category?.name}</p>
          </div>
        </div>
        <div className="space-y-1 pb-2 text-gray-300">
          <h3 className="text-sm text-white">{title}</h3>
          <p className="font-open-sans text-xs font-light italic">
            {place}, {country}
          </p>
        </div>
        <Button
          onClick={handleNavigate}
          className="w-full bg-teal-600 text-gray-200 hover:bg-teal-900"
          variant="secondary"
        >
          Discover story
        </Button>
      </div>
    </Popup>
  );
};

export default HomeSelectedStoryMarker;
