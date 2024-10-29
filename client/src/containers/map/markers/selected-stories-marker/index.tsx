'use client';

import { useEffect } from 'react';

import { useMap } from 'react-map-gl';

import { useRouter } from 'next/navigation';

import { useBreakpoint } from '@/hooks/screen-size';

import Marker from '@/components/map/layers/marker';

type SelectedStoriesMarkerProps = {
  markers?: (GeoJSON.Feature<GeoJSON.Point> | null)[];
  onCloseMarker: () => void;
};

const SelectedStoriesMarker = ({ markers, onCloseMarker }: SelectedStoriesMarkerProps) => {
  const { push } = useRouter();

  const breakpoint = useBreakpoint();
  const isMobile = !breakpoint('sm');
  const { ['default']: map } = useMap();

  useEffect(() => {
    if (isMobile && markers?.length) {
      const { coordinates } = markers?.[0]?.geometry || {};
      if (coordinates?.length) {
        map?.flyTo({
          center: coordinates as [number, number],
          duration: 500,
        });
      }
    }
  }, [markers, map, isMobile]);

  if (!markers?.length) return null;

  const handleClick = (id: string | number) => {
    onCloseMarker();
    push(`/stories/${id}`);
  };

  return <Marker markers={markers} handleClose={onCloseMarker} handleClick={handleClick} />;
};

export default SelectedStoriesMarker;
