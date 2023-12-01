import { useMemo } from 'react';

import { useParams } from 'next/navigation';

import { useRecoilValue } from 'recoil';

import { stepAtom } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';

import StoryMarkerMedia from './marker';

type StoryMarker = {
  id: number;
  lng: number;
  lat: number;
  media: {
    mime: string;
    url: string;
  };
  name: string;
};

const StoryMarkers = () => {
  const step = useRecoilValue(stepAtom);

  const { id } = useParams();
  const { data: storyData } = useGetStoriesId(+id, {
    populate: 'deep',
  });

  const markers: StoryMarker[] = useMemo(() => {
    return (
      storyData?.data?.attributes?.steps?.data?.[step]?.attributes?.layout[0].map?.markers || []
    );
  }, [step, storyData?.data?.attributes?.steps?.data]);

  return (
    <>
      {markers?.map((marker) => (
        <StoryMarkerMedia key={marker.id} marker={marker} />
      ))}
    </>
  );
};

export default StoryMarkers;
