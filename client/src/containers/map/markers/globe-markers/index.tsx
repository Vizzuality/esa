'use client';

import { useMemo } from 'react';

import { Layer, Source } from 'react-map-gl';

import { usePathname } from 'next/navigation';

import { StoryStepMap } from '@/types/story';

import { useMapImage } from '@/hooks/map';
import useStories from '@/hooks/stories/useStories';

const GlobeMarkers = () => {
  const { data: stories } = useStories();

  const FeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features:
        stories?.data?.map(({ id, attributes }) => {
          const marker = (attributes?.marker as StoryStepMap)?.markers?.[0];
          const lat = marker?.lat;
          const lng = marker?.lng;
          return {
            type: 'Feature',
            id,
            geometry: { type: 'Point', coordinates: [lng, lat] },
            properties: {
              category: attributes?.category?.data?.attributes?.slug,
              categoryName: attributes?.category?.data?.attributes?.name,
              location: attributes?.location,
              title: attributes?.title,
              active: attributes?.active,
            },
          };
        }) || [],
    }),
    [stories?.data]
  ) as GeoJSON.FeatureCollection<GeoJSON.Point>;

  useMapImage({
    name: 'story-marker',
    url: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/map/story-marker.png`,
  });

  const pathname = usePathname();
  const visibility = useMemo(
    () => (!pathname.includes('stories') ? 'visible' : 'none'),
    [pathname]
  );

  return (
    <Source id="story-markers" type="geojson" data={FeatureCollection}>
      <Layer
        id="story-markers-cluster"
        type="circle"
        filter={['has', 'point_count']}
        paint={{
          'circle-color': '#FFE094',
          'circle-radius': 12,
        }}
        layout={{
          visibility,
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
          visibility,
        }}
        paint={{
          'text-color': '#003247',
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
          visibility,
        }}
      />
    </Source>
  );
};

export default GlobeMarkers;
