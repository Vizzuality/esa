'use client';

import { useCallback, useEffect, useMemo } from 'react';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Share2 } from 'lucide-react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';
import { ScrollProvider } from '@/lib/scroll';

import { layersAtom, tmpBboxAtom } from '@/store';

import { lastStepAtom, stepAtom, stepCountAtom } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';

import { Button } from '@/components/ui/button';

import Step from './steps';
import { ScrollItemController } from './steps/controller/controller-item';
import { ScrollItem } from './steps/controller/scroll-item';

const Story = () => {
  const { push } = useRouter();

  const [step, setStep] = useRecoilState(stepAtom);
  const setStepCount = useSetRecoilState(stepCountAtom);
  const setLastStep = useSetRecoilState(lastStepAtom);
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);
  const setLayers = useSetRecoilState(layersAtom);

  const { id } = useParams();
  const { data: storyData } = useGetStoriesId(+id, {
    populate: 'deep',
  });

  const steps = useMemo(() => storyData?.data?.attributes?.steps?.data || [], [storyData]);

  useEffect(() => {
    const stepLocation = steps?.[step]?.attributes?.layout?.[0]?.location?.location;
    if (stepLocation) {
    }
    if (storyData?.data?.attributes?.bbox) {
      setTmpBbox(storyData?.data?.attributes?.bbox as [number, number, number, number]);
    }
    setStepCount(storyData?.data?.attributes?.steps?.data?.length || 0);
  }, [storyData, setTmpBbox, setStepCount]);

  useEffect(() => {
    const stepLayers = steps?.[step]?.attributes?.layout?.[0]?.layers;
    if (stepLayers) {
      const _layers: number[] =
        stepLayers.data?.reduce(
          (acc: number[], layer: { id: number }) => (layer.id ? [...acc, layer.id] : acc),
          []
        ) || [];
      setLayers(_layers);
    }
  }, [setLayers, step, steps]);

  const handleClickBack = () => {
    push('/');
  };

  const onChange = useCallback(
    (s: any) => {
      if (s.data.step !== step) {
        setLastStep(step);
        setStep(s.data.step);
      }
    },
    [setLastStep, setStep, step]
  );

  return (
    <div className="text-primary flex flex-col justify-between">
      <div className="fixed z-30 mt-6 flex w-full items-center justify-between px-12 text-center text-2xl font-bold">
        <Button
          onClick={handleClickBack}
          className="bg-background rounded-full border-gray-800  bg-opacity-50 hover:bg-gray-800"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1>{storyData?.data?.attributes?.title}</h1>
        <Button className="bg-background rounded-full border-gray-800 bg-opacity-50 hover:bg-gray-800">
          <Share2 className="h-6 w-6" />
        </Button>
      </div>
      <ScrollProvider onStepChange={onChange}>
        {steps?.map((step, index) => {
          return (
            <ScrollItem step={index} key={index}>
              <Step index={index} step={step} category={storyData?.data?.attributes?.category} />
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
