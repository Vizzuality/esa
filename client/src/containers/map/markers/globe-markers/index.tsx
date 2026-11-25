'use client';

import { useEffect, useMemo, useState } from 'react';

import { Layer, Source } from 'react-map-gl';

import { usePathname } from 'next/navigation';

import { StoryStepMap } from '@/types/story';

import { useMapSvgImage } from '@/hooks/map';
import useStories from '@/hooks/stories/useStories';

import { STORY_MARKER_COLORS, STORY_MARKER_IMAGES, storyMarkerSvg } from '@/constants/story-marker';

const StoryMarkerImage = ({ name }: { name: string }) => {
  const { type, variant } = STORY_MARKER_IMAGES[name];
  useMapSvgImage({ name, svg: storyMarkerSvg(type, variant) });
  return null;
};

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
              enhanced: !!attributes?.enhanced,
            },
          };
        }) || [],
    }),
    [stories?.data]
  ) as GeoJSON.FeatureCollection<GeoJSON.Point>;

  const pathname = usePathname();
  const visibility = useMemo(
    () => (!pathname.includes('stories') ? 'visible' : 'none'),
    [pathname]
  );

  const [size, setSize] = useState(1);

  const [opacity, setOpacity] = useState(1);

  // Animate the size and opacity of the markers
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const startTime = performance.now();
    const velocity = 3000;
    const minSize = 0.75;

    const animate = () => {
      const progress = ((performance.now() - startTime) % velocity) / velocity;
      const x = Math.abs(Math.sin(progress * Math.PI));
      // Set the opacity interpolating from 0 to 1 and back
      setOpacity(x);
      const size = x * (1 - minSize) + minSize;
      // Set the size interpolating from 0.75 to 1 and back
      setSize(size);
      requestAnimationFrame(animate);
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
    const frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, []);

  return pathname.includes('stories') ? null : (
    <>
      {Object.keys(STORY_MARKER_IMAGES).map((name) => (
        <StoryMarkerImage key={name} name={name} />
      ))}
      <Source id="story-markers" type="geojson" data={FeatureCollection}>
        <Layer
          id="story-markers-cluster"
          type="circle"
          filter={['has', 'point_count']}
          paint={{
            'circle-color': STORY_MARKER_COLORS.default,
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
          id="story-markers-unclustered-lg"
          type="symbol"
          filter={['!', ['has', 'point_count']]}
          layout={{
            'icon-image': [
              'case',
              ['get', 'enhanced'],
              'story-marker-enhanced-lg',
              'story-marker-lg',
            ],
            'icon-ignore-placement': true,
            'icon-allow-overlap': true,
            'icon-size': size,
            visibility,
          }}
        />
        <Layer
          id="story-markers-unclustered"
          type="symbol"
          filter={['!', ['has', 'point_count']]}
          paint={{
            'icon-opacity': 1 - opacity,
          }}
          layout={{
            'icon-image': ['case', ['get', 'enhanced'], 'story-marker-enhanced', 'story-marker'],
            'icon-ignore-placement': true,
            'icon-allow-overlap': true,
            'icon-size': 1,
            visibility,
          }}
        />
      </Source>
    </>
  );
};

export default GlobeMarkers;
