'use client';

import { useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { useRecoilValue } from 'recoil';

import { stepAtom } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';

import StoryMarkerMedia from './marker';
import { StoryStepMap } from '@/types/story';
// import Carousel from './carousel';
// import { Dialog, DialogContent } from '@/components/ui/dialog';

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
  // const [currentMedia, setCurrentMedia] = useState<number>();
  const markers: StoryMarker[] = useMemo(() => {
    return (storyData?.data?.attributes?.steps?.[step]?.map as StoryStepMap)?.markers || [];
  }, [step, storyData?.data?.attributes?.steps]);

  // const medias = useMemo(() => {
  //   return markers?.map((marker) => ({
  //     id: marker?.id,
  //     url: marker?.media?.url,
  //     mime: marker?.media?.mime,
  //     type: marker?.media?.mime?.includes('video') ? 'video' : 'image',
  //   }));
  // }, [markers]);

  // const handleClickMarker = (markerIndex: number) => {
  //   setCurrentMedia(markerIndex);
  // };

  return (
    <>
      {markers?.map((marker, index) => (
        <StoryMarkerMedia
          key={marker.id}
          marker={marker}
          // onClick={() => handleClickMarker(index)}
        />
      ))}
      {/* <Dialog
        onOpenChange={() => setCurrentMedia(undefined)}
        open={typeof currentMedia === 'number'}
      >
        <DialogContent className="bg-transparent">
          <Carousel medias={medias} currentMedia={currentMedia} setCurrentMedia={setCurrentMedia} />
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default StoryMarkers;
