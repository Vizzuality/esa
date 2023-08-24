import { useRecoilValue } from 'recoil';

import { zoomAtom } from '@/store';

import useSupercluster from '@/hooks/supercluster';

import GEOSJON from '@/constants/markers.json';

import StoryMarkerItem from './item';

const StoryMarkers = () => {
  const zoom = useRecoilValue(zoomAtom);

  const FeatureCollection = GEOSJON as unknown as GeoJSON.FeatureCollection<
    GeoJSON.Point,
    {
      category: string;
    }
  >;

  const { clusters, supercluster } = useSupercluster({
    points: FeatureCollection.features,
    zoom: zoom,
    bounds: [-180, -90, 180, 90],
    options: {
      radius: 40,
    },
  });

  return (
    <>
      {clusters.map((f) => {
        const { id } = f;

        if (!supercluster) return null;

        return <StoryMarkerItem key={id} {...f} supercluster={supercluster} />;
      })}
    </>
  );
};

export default StoryMarkers;
