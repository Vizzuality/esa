import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';

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
}>;

const Step = ({ step, category }: StepProps) => {
  const { image, video } = getMedia(step?.attributes?.layout[0]?.media);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video?.href && videoRef.current) {
      videoRef.current.play();
    }
  }, [video?.href]);

  const STEP_COMPONENT = useMemo(() => {
    const type = getStepType(step);
    const stepLayout = step?.attributes?.layout?.[0];
    if (!type || !stepLayout) return null;

    switch (type) {
      case 'map-step': {
        return <MapStepLayout category={category?.data?.attributes} step={stepLayout} />;
      }
      case 'media-step':
        return <MediaStepLayout step={stepLayout} />;
      case 'outro-step':
        return <OutroStepLayout step={stepLayout} categoryId={category?.data?.id} />;
      default:
        return null;
    }
  }, [category?.data?.attributes, category?.data?.id, step]);

  return (
    <div
      style={{
        ...(image && { backgroundImage: `url(${image})` }),
      }}
      className="pointer-events-none z-10 h-screen w-screen bg-cover bg-no-repeat"
    >
      {video && (
        <video
          className="pointer-events-none absolute -z-10 h-screen w-screen object-cover"
          loop
          muted
          ref={videoRef}
          src={video.href}
        >
          <source src={video.href} type={video.type} />
        </video>
      )}
      <div className="z-20 h-full w-full px-14 pb-5 pt-[84px]">{STEP_COMPONENT}</div>
    </div>
  );
};

export default Step;
