import {
  StepLayoutOutroStepComponentMedia,
  StoryStepsItem,
} from '@/types/generated/strapi.schemas';

export const getStepType = (step: StoryStepsItem) => {
  return step?.__component?.split('.')?.[1];
};

export const getMedia = (media?: StepLayoutOutroStepComponentMedia) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${
    media?.data?.attributes?.url
  }`;

  const mediaMime = media?.data?.attributes?.mime;
  const mediaType = mediaMime?.split('/')[0];

  const stepMedia =
    mediaType === 'image' ? { image: url } : { video: { href: url, play: true, type: mediaMime } };

  return stepMedia;
};
