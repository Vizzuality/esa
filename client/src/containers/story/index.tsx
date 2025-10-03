'use client';

import { useEffect, useMemo } from 'react';

import { useParams } from 'next/navigation';

import { useSetAtom } from 'jotai';

import { ScrollProvider } from '@/lib/scroll';

import { layersAtom, tmpBboxAtom } from '@/store/map';
import { useSyncStep } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';

import Header from './header';
import Steps from './steps';
import { ScrollItemController } from './steps/controller/controller-item';
import { isMapNotEmpty } from './utils';

const Story = () => {
  const { step } = useSyncStep();
  const setTmpBbox = useSetAtom(tmpBboxAtom);
  const setLayers = useSetAtom(layersAtom);

  const { id } = useParams();
  const { data: storyData } = useGetStoriesId(+id, {
    populate: 'deep',
  });

  const story = useMemo(() => storyData?.data?.attributes, [storyData]);
  const steps = useMemo(() => story?.steps || [], [story]);

  useEffect(() => {
    if (!steps) return;
    const currStep = steps[step - 1];

    if (!currStep || !isMapNotEmpty(currStep.map)) {
      return;
    }

    // Bbox
    const stepLocation = currStep?.map.location;
    if (stepLocation) {
      const { bbox, ...options } = stepLocation;
      setTmpBbox({
        bbox,
        options,
      });
    }

    // Layers
    const stepLayers = currStep.layers;
    if (stepLayers) {
      const _layers: number[] =
        stepLayers.data?.reduce(
          (acc: number[], layer) => (layer.id ? [...acc, layer.id] : acc),
          []
        ) || [];
      setLayers(_layers);
    }
  }, [story, setTmpBbox, setLayers, steps, step]);

  return (
    <div className="text-primary max-w-screen flex flex-col justify-between overflow-x-hidden">
      <Header
        categorySlug={story?.category?.data?.attributes?.slug}
        title={story?.title}
        storyId={id}
        categoryTitle={story?.category?.data?.attributes?.name}
        categoryURL={story?.category?.data?.attributes?.url}
      />
      <ScrollProvider>
        <Steps story={story} />
        <div className="right-6 z-30 hidden h-full flex-col justify-center gap-2 sm:fixed sm:flex">
          {steps?.map((s, index) => (
            <ScrollItemController key={index + 1} newStep={index + 1} title={s.title || ''} />
          ))}
        </div>
      </ScrollProvider>
    </div>
  );
};

export default Story;
