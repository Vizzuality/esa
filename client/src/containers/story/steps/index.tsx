'use client';
import { PropsWithChildren, useMemo } from 'react';

import { cn } from '@/lib/classnames';

import { useSyncStep } from '@/store/stories';

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
  const { step: currentStep } = useSyncStep();
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
    <div
      className={cn('pointer-events-none min-h-screen w-full ', type !== 'outro-step' && 'px-14')}
    >
      {STEP_COMPONENT}
    </div>
  );
};

export default Step;
