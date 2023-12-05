import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { ExpandIcon, Play } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { StoryStepMapMarkerMedia } from '@/types/story';

import { Button } from '@/components/ui/button';

type StoryMarkerMediaProps = {
  isFullScreen: boolean;
  name: string;
  media: StoryStepMapMarkerMedia;
  onClickExpand: () => void;
};

const StoryMarker = ({ media, name, isFullScreen, onClickExpand }: StoryMarkerMediaProps) => {
  const [hovered, setHovered] = useState(false);
  const mediaType = media?.mime?.split('/')[0];

  const mediaMime = media?.mime;

  // MOCKUP IMAGE FOR STORY 1 STEP 1 !! REMOVE WHEN REAL IMAGE IS AVAILABLE
  // !TODO: Add video thumbnail
  const mediaSrc = mediaMime.includes('image')
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}/images/story-1-image-mockup.png`
    : `${process.env.NEXT_PUBLIC_BASE_PATH}${media?.url}`;

  const mediaClassName = useMemo(
    () =>
      cn(
        'h-full w-full transition-all duration-700',
        isFullScreen ? 'rounded-none  object-contain' : 'rounded-full object-cover '
      ),
    [isFullScreen]
  );

  const handleHover = (mouseOver: boolean) => {
    setHovered(mouseOver);
  };

  useEffect(() => {
    if (isFullScreen) {
      setHovered(false);
    }
  }, [isFullScreen]);

  return (
    <div
      className="relative flex h-full max-h-screen w-full items-center justify-center"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {hovered && !isFullScreen && (
        <Button
          variant="icon"
          className="absolute z-50 h-14 w-14 rounded-full text-white backdrop-blur-lg transition-all duration-500"
          onClick={onClickExpand}
        >
          <ExpandIcon className="h-6 w-6" />
        </Button>
      )}
      {mediaType === 'image' && (
        <Image
          width={isFullScreen ? 1500 : hovered ? 200 : 70}
          height={isFullScreen ? 1500 : hovered ? 200 : 70}
          src={mediaSrc}
          className={mediaClassName}
          alt={name}
        />
      )}
      {mediaType === 'video' && !hovered && (
        <>
          <Image
            width={isFullScreen ? 1500 : hovered ? 200 : 70}
            height={isFullScreen ? 1500 : hovered ? 200 : 70}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/story-1-image-mockup.png`}
            className={mediaClassName}
            alt={name}
          />
          <Play className="absolute z-10 h-6 w-6 fill-white" />
        </>
      )}
      {mediaType === 'video' && hovered && (
        <>
          <Image
            width={isFullScreen ? 1500 : hovered ? 200 : 70}
            height={isFullScreen ? 1500 : hovered ? 200 : 70}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/story-1-image-mockup.png`}
            className={mediaClassName}
            alt={name}
          />
        </>
      )}
    </div>
  );
};

export default StoryMarker;
