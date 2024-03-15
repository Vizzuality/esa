'use client';

import { useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { useSyncStep } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';
import { StoryStepMap } from '@/types/story';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import Carousel from './carousel';
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
  const { step } = useSyncStep();

  const { id } = useParams();
  const { data: storyData } = useGetStoriesId(+id, {
    populate: 'deep',
  });
  const [currentMedia, setCurrentMedia] = useState<number>();
  const markers: StoryMarker[] = useMemo(() => {
    return (storyData?.data?.attributes?.steps?.[step - 1]?.map as StoryStepMap)?.markers || [];
  }, [step, storyData?.data?.attributes?.steps]);

  const medias = useMemo(() => {
    return markers?.map((marker) => ({
      title: marker?.name,
      id: marker?.id,
      url: marker?.media?.url,
      mime: marker?.media?.mime,
      type: marker?.media?.mime?.includes('video') ? 'video' : 'image',
    }));
  }, [markers]);

  const handleClickMarker = (markerIndex: number) => {
    setCurrentMedia(markerIndex);
  };

  return (
    <>
      {markers?.map((marker, index) => (
        <StoryMarkerMedia
          key={marker.id}
          marker={marker}
          onClick={() => handleClickMarker(index)}
        />
      ))}
      <Dialog
        onOpenChange={() => setCurrentMedia(undefined)}
        open={typeof currentMedia === 'number'}
      >
        <DialogContent className="bg-transparent">
          <Carousel medias={medias} currentMedia={currentMedia} setCurrentMedia={setCurrentMedia} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryMarkers;
