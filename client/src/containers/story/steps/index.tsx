import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';

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
import { getMedia, getStepType } from './utils';

type StepProps = PropsWithChildren<{
  media?: StepLayoutMediaStepComponentMedia | StepLayoutOutroStepComponentMedia;
  step: StoryStepsDataItem;
  category?: StoryCategory;
  index: number;
}>;

const Step = ({ step, category, index }: StepProps) => {
  const currentStep = useRecoilValue(stepAtom);

  const { image, video } = getMedia(step?.attributes?.layout[0]?.media);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video?.href && videoRef.current) {
      if (index === currentStep) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentStep, index, video?.href]);

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
        return <OutroStepLayout step={stepLayout} categoryId={category?.data?.id} />;
      default:
        return null;
    }
  }, [category?.data?.attributes, category?.data?.id, step, index, currentStep]);

  return (
    <div
      style={{
        ...(image && { backgroundImage: `url(${image})` }),
      }}
      className="pointer-events-none z-10 h-screen w-full bg-cover bg-no-repeat"
    >
      {video && (
        <video
          className="pointer-events-none absolute -z-10 h-screen w-full object-cover"
          loop
          muted
          ref={videoRef}
          src={video.href}
        >
          <source src={video.href} type={video.type} />
        </video>
      )}
      <div className="z-20 h-full w-full px-14 pb-6 pt-[84px]">{STEP_COMPONENT}</div>
    </div>
  );
};

export default Step;
