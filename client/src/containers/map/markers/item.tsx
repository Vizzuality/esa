import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import Supercluster from 'supercluster';

import StoryMarker from '@/components/map/layers/marker/story';
import StoryClusterMarker from '@/components/map/layers/marker/story-cluster';

export type StoryMarkerItemProps =
  | (Supercluster.PointFeature<Supercluster.AnyProps> & {
      supercluster: Supercluster<Supercluster.AnyProps>;
    })
  | (Supercluster.ClusterFeature<Supercluster.AnyProps> & {
      supercluster: Supercluster<Supercluster.AnyProps>;
    });

const StoryMarkerItem = ({ id, geometry, properties, supercluster }: StoryMarkerItemProps) => {
  const { push } = useRouter();
  const { cluster, cluster_id, category } = properties;

  const handleClick = useCallback(() => {
    push(`/stories/${id}`);
  }, [push, id]);

  const handleClusterClick = useCallback(() => {
    console.info(supercluster.getLeaves(cluster_id));
  }, [cluster_id, supercluster]);

  return (
    <>
      {cluster && (
        <StoryClusterMarker
          key={id}
          longitude={geometry.coordinates[0]}
          latitude={geometry.coordinates[1]}
          onClick={handleClusterClick}
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
