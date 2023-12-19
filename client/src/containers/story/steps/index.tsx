'use client';
import { PropsWithChildren, useMemo } from 'react';

import { useRecoilValue } from 'recoil';

import { cn } from '@/lib/classnames';

import { stepAtom } from '@/store/stories';

import {
  StepLayoutOutroStepComponentMedia,
  StoryCategory,
  StoryStepsItem,
} from '@/types/generated/strapi.schemas';

import MapStepLayout from './layouts/map-step';
import OutroStepLayout from './layouts/outro-step';
import { getStepType } from './utils';

type StepProps = PropsWithChildren<{
  media?: StepLayoutOutroStepComponentMedia;
  step: StoryStepsItem;
  category?: StoryCategory;
  index: number;
}>;

const Step = ({ step, category, index }: StepProps) => {
  const currentStep = useRecoilValue(stepAtom);
  const type = getStepType(step);

  const STEP_COMPONENT = useMemo(() => {
    const stepLayout = step;
    if (!type || !stepLayout) return null;

    switch (type) {
      case 'map-step': {
        return (
          <MapStepLayout
            stepIndex={index}
            category={category?.data?.attributes}
            step={step}
            showContent={currentStep === index}
          />
        );
      }

      case 'outro-step':
        return (
          <OutroStepLayout
            step={step}
            showContent={currentStep === index}
            categoryId={category?.data?.id}
          />
        );
      default:
        return null;
    }
  }, [step, type, currentStep, index, category?.data?.id, category?.data?.attributes]);

  return (
    <div className="pointer-events-none h-screen w-full ">
      <div className={cn('h-full w-full', type !== 'outro-step' && 'px-14')}>{STEP_COMPONENT}</div>
    </div>
  );
};

export default Step;
