'use client';

import { Layer, Source } from 'react-map-gl';

import { usePathname } from 'next/navigation';

import { useMapImage } from '@/hooks/map';

import data from './data.json';

const EOIDsMarkers = () => {
  const pathname = usePathname();

  const FeatureCollection = data as GeoJSON.FeatureCollection<GeoJSON.Point>;

  useMapImage({
    name: 'eoids-marker',
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/map/eoids-marker.png`,
  });

  if (!pathname.includes('globe')) {
    return null;
  }

  return (
    <Source
      cluster
      clusterMaxZoom={5}
      clusterRadius={10}
      id="eoids-markers"
      type="geojson"
      data={FeatureCollection}
    >
      <Layer
        id="story-markers-cluster"
        filter={['has', 'point_count']}
        type="symbol"
        layout={{
          'icon-image': 'eoids-marker',
          'icon-allow-overlap': true,
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            0.5, // at zoom level 5 → size 0.5
            10,
            1, // at zoom level 10 → size 1
            15,
            2, // at zoom level 15 → size 2
          ],
        }}
      />
      <Layer
        id="eoids-marker"
        filter={['!', ['has', 'point_count']]}
        type="symbol"
        layout={{
          'icon-image': 'eoids-marker',
          'icon-allow-overlap': true,
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            0.5, // at zoom level 5 → size 0.5
            10,
            1, // at zoom level 10 → size 1
            15,
            2, // at zoom level 15 → size 2
          ],
        }}
      />
    </Source>
  );
};

export default EOIDsMarkers;
