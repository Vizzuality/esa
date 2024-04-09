import { StepLayoutMapStepComponent, StoryStepsItem } from '@/types/generated/strapi.schemas';
import { StoryStepMap } from '@/types/story';

export const isMapStep = (step: StoryStepsItem): step is StepLayoutMapStepComponent => {
  return !!step?.__component?.includes('map-step');
};

export const isMapNotEmpty = (map: StoryStepsItem['map']): map is StoryStepMap => {
  return (
    !!map && typeof map === 'object' && Object.values((map as StoryStepMap)?.location).length > 0
  );
};
