import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import Supercluster from 'supercluster';

import StoryMarker from '@/components/map/layers/marker/story';
import StoryClusterMarker from '@/components/map/layers/marker/story-cluster';

export type StoryMarkerItemProps =
  | Supercluster.PointFeature<Supercluster.AnyProps>
  | Supercluster.ClusterFeature<Supercluster.AnyProps>;

const StoryMarkerItem = ({ id, geometry, properties }: StoryMarkerItemProps) => {
  const { push } = useRouter();
  const { cluster, category } = properties;

  const handleClick = useCallback(() => {
    push(`/stories/${id}`);
  }, [push, id]);

  return (
    <>
      {cluster && (
        <StoryClusterMarker
          key={id}
          longitude={geometry.coordinates[0]}
          latitude={geometry.coordinates[1]}
        />
      )}

      {!cluster && (
        <StoryMarker
          key={id}
          longitude={geometry.coordinates[0]}
          latitude={geometry.coordinates[1]}
          onClick={handleClick}
        >
          <div className="flex flex-col">
            <div className="text-xs font-bold">{category}</div>
          </div>
        </StoryMarker>
      )}
    </>
  );
};

export default StoryMarkerItem;
