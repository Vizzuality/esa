import { Layer, Source } from 'react-map-gl';

import { useMapImage } from '@/hooks/map';

import GEOSJON from '@/constants/markers.json';

const StoryMarkers = () => {
  const FeatureCollection = GEOSJON as unknown as GeoJSON.FeatureCollection<
    GeoJSON.Point,
    {
      category: string;
    }
  >;

  useMapImage({
    name: 'story-marker',
    url: '/images/map/story-marker.png',
  });

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
          'text-ignore-placement': true,
          'text-allow-overlap': true,
        }}
        paint={{
          'text-color': '#fff',
        }}
      />

      <Layer
        id="story-markers-unclustered"
        type="symbol"
        filter={['!', ['has', 'point_count']]}
        paint={{
          'icon-color': '#FFE094',
        }}
        layout={{
          'icon-image': 'story-marker',
          'icon-ignore-placement': true,
          'icon-allow-overlap': true,
          // 'icon-pitch-alignment': 'map',
          // 'icon-rotation-alignment': 'map',
        }}
      />
    </Source>
  );
};

export default StoryMarkers;
