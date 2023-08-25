import { Layer, Source } from 'react-map-gl';

import GEOSJON from '@/constants/markers.json';

const StoryMarkers = () => {
  const FeatureCollection = GEOSJON as unknown as GeoJSON.FeatureCollection<
    GeoJSON.Point,
    {
      category: string;
    }
  >;

  return (
    <Source id="story-markers" type="geojson" data={FeatureCollection} cluster clusterRadius={16}>
      <Layer
        id="story-markers-cluster"
        type="circle"
        filter={['has', 'point_count']}
        paint={{
          'circle-color': '#000',
          'circle-radius': 12,
        }}
        layout={{
          visibility: 'visible',
        }}
      />

      <Layer
        id="story-markers-cluster-count"
        type="symbol"
        filter={['has', 'point_count']}
        layout={{
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 12,
        }}
        paint={{
          'text-color': '#fff',
        }}
      />

      <Layer
        id="story-markers-unclustered"
        type="circle"
        filter={['!', ['has', 'point_count']]}
        paint={{
          'circle-radius': 6,
          'circle-color': '#fff',
          'circle-stroke-color': '#000',
          'circle-stroke-width': 1,
        }}
      />
    </Source>
  );
};

export default StoryMarkers;
