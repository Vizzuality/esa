import { useMap } from 'react-map-gl';

import { Bbox } from '@/types/map';

import useSupercluster from '@/hooks/supercluster';

import GEOSJON from '@/constants/markers.json';

import MarkerItem from './item';

const StoryMarkers = () => {
  const { default: map } = useMap();

  const FeatureCollection = GEOSJON as unknown as GeoJSON.FeatureCollection<
    GeoJSON.Point,
    {
      category: string;
    }
  >;

  const { clusters } = useSupercluster({
    points: FeatureCollection.features,
    zoom: map ? map.getZoom() : 2,
    bounds: map ? (map.getBounds().toArray().flat() as Bbox) : [-180, -80, 180, 80],
    options: {
      radius: 40,
    },
  });

  return (
    <>
      {clusters.map((f, i) => {
        const { id } = f;

        return <MarkerItem key={id} {...f} />;
      })}
    </>
  );
};

export default StoryMarkers;
