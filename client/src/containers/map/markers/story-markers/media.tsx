import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import { ExpandIcon, Play } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { StoryStepMapMarkerMedia } from '@/types/story';

import Video from '@/containers/story/video';

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
          // !TODO: Add real image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/story-1-image-mockup.png`}
          className={mediaClassName}
          alt={name}
        />
      )}
      {mediaType === 'video' && !hovered && (
        <>
          <Image
            width={isFullScreen ? 1500 : hovered ? 200 : 70}
            height={isFullScreen ? 1500 : hovered ? 200 : 70}
            // !TODO: Add video thumbnail
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/story-1-image-mockup.png`}
            className={mediaClassName}
            alt={name}
          />
          <Play className="absolute z-10 h-5 w-5 fill-white stroke-white" />
        </>
      )}
      {mediaType === 'video' && hovered && (
        <>
          <Video
            playing
            loop
            muted
            // !TODO: Add real video
            url="https://youtu.be/vCzmxg9y7gA?si=A9TTn_tvyzo-r00c"
            height="100%"
            width="100%"
          />
        </>
      )}
    </div>
  );
};

export default StoryMarker;
