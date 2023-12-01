import { PropsWithChildren, useMemo } from 'react';

import { useRecoilValue } from 'recoil';

import { stepAtom } from '@/store/stories';

import {
  StepLayoutMediaStepComponentMedia,
  StepLayoutOutroStepComponentMedia,
  StoryCategory,
  StoryStepsDataItem,
} from '@/types/generated/strapi.schemas';

import MapStepLayout from './layouts/map-step';
import MediaStepLayout from './layouts/media-step';
import OutroStepLayout from './layouts/outro-step';
import { getStepType } from './utils';

type StepProps = PropsWithChildren<{
  media?: StepLayoutMediaStepComponentMedia | StepLayoutOutroStepComponentMedia;
  step: StoryStepsDataItem;
  category?: StoryCategory;
  index: number;
}>;

const Step = ({ step, category, index }: StepProps) => {
  const currentStep = useRecoilValue(stepAtom);

  const STEP_COMPONENT = useMemo(() => {
    const type = getStepType(step);
    const stepLayout = step?.attributes?.layout?.[0];
    if (!type || !stepLayout) return null;

    switch (type) {
      case 'map-step': {
        return (
          <MapStepLayout
            stepIndex={index}
            category={category?.data?.attributes}
            step={stepLayout}
            showContent={currentStep === index}
          />
        );
      }
      case 'media-step':
        return <MediaStepLayout step={stepLayout} />;
      case 'outro-step':
        return (
          <OutroStepLayout
            step={stepLayout}
            showContent={currentStep === index}
            categoryId={category?.data?.id}
          />
        );
      default:
        return null;
    }
  }, [category?.data?.attributes, category?.data?.id, step, index, currentStep]);

  return (
    <div className="pointer-events-none h-screen w-full ">
      <div className="h-full w-full px-14">{STEP_COMPONENT}</div>
    </div>
  );
};

export default Step;
