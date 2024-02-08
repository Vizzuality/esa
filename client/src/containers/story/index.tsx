'use client';

import { useEffect, useMemo } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { ArrowLeft, Share2 } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { ScrollProvider } from '@/lib/scroll';

import { layersAtom, tmpBboxAtom } from '@/store/map';
import { useStep } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';

import { Button } from '@/components/ui/button';

import Step from './steps';
import { ScrollItemController } from './steps/controller/controller-item';
import { ScrollItem } from './steps/controller/scroll-item';
import { isMapNotEmpty } from './utils';

const headerButtonClassName =
  'rounded-4xl h-auto border-gray-800 bg-[hsl(198,100%,14%)]/75 px-5 py-2.5 hover:bg-gray-800';

const Story = () => {
  const { step } = useStep();
  const setTmpBbox = useSetAtom(tmpBboxAtom);
  const setLayers = useSetAtom(layersAtom);
  const resetLayers = useResetAtom(layersAtom);
  const { push } = useRouter();

  const { id } = useParams();
  const { data: storyData } = useGetStoriesId(+id, {
    populate: 'deep',
  });

  const story = useMemo(() => storyData?.data?.attributes, [storyData]);
  const steps = useMemo(() => story?.steps || [], [story]);

  const handleGoHome = () => {
    resetLayers();
    push('/');
  };

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
    <div className="text-primary flex flex-col justify-between">
      <div className="fixed left-0 top-0 z-30 w-full bg-gradient-to-b from-[#0C3E54] to-transparent">
        <div className="flex items-center justify-between px-12 py-6 text-center text-2xl font-bold">
          <Button value="icon" className={headerButtonClassName} onClick={handleGoHome}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="font-notes font-normal">{story?.title}</h1>
          <Button value="icon" className={headerButtonClassName}>
            <Share2 className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <ScrollProvider>
        {steps?.map((mapStep, index) => {
          return (
            <ScrollItem step={index + 1} key={index + 1}>
              <Step index={index + 1} step={mapStep} category={story?.category} />
            </ScrollItem>
          );
        })}
        <div className="fixed right-6 z-30 flex h-full flex-col justify-center gap-2">
          {steps?.map((s, index) => (
            <ScrollItemController
              className={cn(
                'hover:outline-secondary h-2 w-2 rounded-full border-[1.5px] border-gray-800 outline outline-[1.5px] transition-all duration-200',
                index + 1 === step
                  ? 'bg-secondary outline-secondary'
                  : 'bg-gray-800 outline-gray-700'
              )}
              key={index + 1}
              newStep={index + 1}
              title={s.title || ''}
            />
          ))}
        </div>
      </ScrollProvider>
    </div>
  );
};

export default Story;
