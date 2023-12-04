import { useMemo } from 'react';

import { Layer, Source } from 'react-map-gl';

import { useRecoilValue } from 'recoil';

import { getStoriesParams } from '@/lib/stories';

import { categoryAtom } from '@/store/home';

import { useGetCategories } from '@/types/generated/category';
import { useGetStories } from '@/types/generated/story';

import { useMapImage } from '@/hooks/map';

const StoryMarkers = () => {
  const category = useRecoilValue(categoryAtom);
  const { data: categories } = useGetCategories();

  const categoryId = useMemo(() => {
    const categoryItem = categories?.data?.find(({ attributes }) => attributes?.slug === category);
    return categoryItem?.id;
  }, [categories?.data, category]);

  const params = getStoriesParams({ category: categoryId });
  const { data: stories } = useGetStories(params);

  const FeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features:
        stories?.data?.map(({ id, attributes }) => {
          return {
            type: 'Feature',
            bbox: attributes?.bbox,
            id,
            geometry: { type: 'Point', coordinates: [attributes?.longitude, attributes?.latitude] },
            properties: {
              category: attributes?.category?.data?.attributes?.slug,
              categoryName: attributes?.category?.data?.attributes?.name,
              ifi: 'IFAD',
              status: 'completed',
              tags: ['nature'],
              title: attributes?.title,
            },
          };
        }) || [],
    }),
    [stories?.data]
  ) as GeoJSON.FeatureCollection<GeoJSON.Point>;

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
