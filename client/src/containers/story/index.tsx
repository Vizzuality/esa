'use client';

import { useEffect, useMemo } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ArrowLeft, Share2 } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';
import { ScrollProvider } from '@/lib/scroll';

import { layersAtom, tmpBboxAtom } from '@/store';

import { stepAtom } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';
import { Bbox } from '@/types/map';

import { Button } from '@/components/ui/button';

import Step from './steps';
import { ScrollItemController } from './steps/controller/controller-item';
import { ScrollItem } from './steps/controller/scroll-item';

type StepLocation = {
  bbox: Bbox;
  zoom: number;
  pitch: number;
  bearing: number;
  padding: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  latitude: number;
  longitude: number;
};

const headerButtonClassName =
  'rounded-4xl h-auto border-gray-800 bg-[hsl(198,100%,14%)]/75 px-5 py-2.5 hover:bg-gray-800';

const Story = () => {
  const step = useRecoilValue(stepAtom);
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);
  const setLayers = useSetRecoilState(layersAtom);

  const { id } = useParams();
  const { data: storyData } = useGetStoriesId(+id, {
    populate: 'deep',
  });

  const story = useMemo(() => storyData?.data?.attributes, [storyData]);
  const steps = useMemo(() => story?.steps?.data || [], [story]);

  useEffect(() => {
    if (!steps) return;
    const stepLayout = steps[step]?.attributes?.layout?.[0];
    // Location
    const stepLocation = stepLayout?.map?.location;
    if (stepLocation) {
      const { bbox, ...options } = stepLocation as StepLocation;
      setTmpBbox({
        bbox,
        options,
      });
    }
    // Layers
    const stepLayers = stepLayout?.layers;
    if (stepLayers) {
      const _layers: number[] =
        stepLayers.data?.reduce(
          (acc: number[], layer: { id: number }) => (layer.id ? [...acc, layer.id] : acc),
          []
        ) || [];
      setLayers(_layers);
    }
  }, [story, setTmpBbox, setLayers, steps, step]);

  return (
    <div className="text-primary flex flex-col justify-between">
      <div className="fixed z-30 mt-6 flex w-full items-center justify-between px-12 text-center text-2xl font-bold">
        <Link className={headerButtonClassName} href="/">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1>{story?.title}</h1>
        <Button value="icon" className={headerButtonClassName}>
          <Share2 className="h-6 w-6" />
        </Button>
      </div>
      <ScrollProvider>
        {steps?.map((mapStep, index) => {
          return (
            <ScrollItem step={index} key={index}>
              <Step index={index} step={mapStep} category={story?.category} />
            </ScrollItem>
          );
        })}
        <div className="fixed right-6 z-30 flex h-full flex-col justify-center space-y-2">
          {steps?.map((_, index) => (
            <ScrollItemController
              className={cn(
                'hover:bg-secondary block h-2 w-2 rounded-full transition-all duration-200',
                index === step ? 'bg-secondary scale-125' : 'scale-100 bg-gray-800'
              )}
              key={index}
              newStep={index}
            />
          ))}
        </div>
      </ScrollProvider>
    </div>
  );
};

export default Story;
