import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import Marker from '@/components/map/layers/marker';

export type MarkerItemProps = GeoJSON.Feature<
  GeoJSON.Point,
  {
    category: string;
  }
>;

const MarkerItem = ({ id, geometry, properties }: MarkerItemProps) => {
  const { push } = useRouter();
  const { category } = properties;

  const handleClick = useCallback(() => {
    push(`/stories/${id}`);
  }, [push, id]);

  return (
    <Marker
      key={id}
      longitude={geometry.coordinates[0]}
      latitude={geometry.coordinates[1]}
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <div className="text-xs font-bold">{category}</div>
      </div>
    </Marker>
  );
};

export default MarkerItem;
