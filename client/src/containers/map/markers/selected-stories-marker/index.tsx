'use client';

import { useRouter } from 'next/navigation';

import Marker from '@/components/map/layers/marker';

type SelectedStoriesMarkerProps = {
  markers?: (GeoJSON.Feature<GeoJSON.Point> | null)[];
  onCloseMarker: () => void;
};

const SelectedStoriesMarker = ({ markers, onCloseMarker }: SelectedStoriesMarkerProps) => {
  const { push } = useRouter();

  if (!markers?.length) return null;

  const handleClick = (id: string | number) => {
    onCloseMarker();
    push(`/stories/${id}`);
  };

  return <Marker markers={markers} handleClick={handleClick} />;
};

export default SelectedStoriesMarker;
