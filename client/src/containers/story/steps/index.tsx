'use client';
import { PropsWithChildren, useMemo } from 'react';

import { cn } from '@/lib/classnames';

import { useSyncStep } from '@/store/stories';

import { Story } from '@/types/generated/strapi.schemas';

import { ScrollItem } from './controller/scroll-item';
import MapStepLayout, { StorySummary } from './layouts/map-step';
import OutroStepLayout from './layouts/outro-step';
import { getStepType } from './utils';

type StepProps = PropsWithChildren<{
  story?: Story;
}>;

const Step = ({ story }: StepProps) => {
  const steps = useMemo(() => story?.steps || [], [story]);
  const { step: currentStep } = useSyncStep();

  const storySummary = useMemo(() => {
    if (currentStep !== 1) {
      return null;
    }
    const summary: StorySummary[] = [];
    if (story?.location) {
      summary.push({
        title: 'Location',
        content: [{ attributes: { name: story.location } }],
      });
    }
    if (story?.ifis) {
      summary.push({
        title: 'Institutions',
        content: story.ifis?.data,
      });
    }
    if (story?.tags) {
      summary.push({
        title: 'Tags',
        content: story.tags?.data,
      });
    }
    if (story?.impacted_people) {
      summary.push({
        title: 'People Impacted',
        content: [{ attributes: { name: story.impacted_people } }],
      });
    }
    return summary;
  }, [currentStep, story]);

  const disclaimer = useMemo(() => {
    const categoryAttributes = story?.category?.data?.attributes;
    if (!!categoryAttributes && 'disclaimer' in categoryAttributes) {
      return categoryAttributes.disclaimer;
    }
    return [];
  }, [story?.category?.data?.attributes]);

  return (
    <div>
      {steps.map((step, index) => {
        const type = getStepType(step);
        return (
          <ScrollItem step={index + 1} key={index + 1}>
            <div
              className={cn(
                'pointer-events-none min-h-screen w-full ',
                type !== 'outro-step' && 'px-14'
              )}
            >
              {type === 'map-step' && (
                <MapStepLayout
                  storySummary={storySummary}
                  step={step}
                  showContent={currentStep === index + 1}
                />
              )}
              {type === 'outro-step' && (
                <OutroStepLayout
                  disclaimer={disclaimer}
                  step={step}
                  showContent={currentStep === index + 1}
                />
              )}
            </div>
          </ScrollItem>
        );
      })}
    </div>
  );
};

export default Step;
