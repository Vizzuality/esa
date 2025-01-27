'use client';
import { useRef } from 'react';

import Image from 'next/image';

import { ExpandIcon, PlayIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

import { StoryStepMapMarkerMedia } from '@/types/story';

import { Button } from '@/components/ui/button';

type StoryMarkerMediaProps = {
  name: string;
  media: StoryStepMapMarkerMedia;
  onClickExpand: () => void;
};

const StoryMarker = ({ media, name, onClickExpand }: StoryMarkerMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const mediaType = media?.mime?.split('/')[0];

  const mediaMime = media?.mime;

  const mediaSrc = getImageSrc(media?.url);

  const handlePlayVideo = (
    e: React.MouseEvent<HTMLVideoElement, MouseEvent>,
    action: 'play' | 'pause'
  ) => {
    if (action === 'play') e.currentTarget.play();
    else e.currentTarget.pause();
  };

  return (
    <div className={cn('flex h-[88px] w-[88px] items-center justify-center')}>
      <Button
        variant="icon"
        className="group absolute h-[88px] w-[88px]  border-[3px] border-gray-200 px-0 py-0 shadow-md shadow-gray-950/25 transition-all duration-300 hover:h-[105px] hover:w-[105px]"
        onClick={onClickExpand}
      >
        {mediaType === 'image' ? (
          <Image
            width={88}
            height={88}
            src={mediaSrc}
            className="h-full w-full object-cover"
            alt={name}
          />
        ) : mediaType === 'video' ? (
          <div className="h-full w-full">
            <video
              width="100%"
              height="100%"
              src={mediaSrc}
              ref={videoRef}
              muted
              loop
              className="h-full w-full object-cover"
              onMouseEnter={(e) => handlePlayVideo(e, 'play')}
              onMouseLeave={(e) => handlePlayVideo(e, 'pause')}
            >
              <source src={mediaSrc} type={mediaMime} />
            </video>
            <PlayIcon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform fill-gray-200  opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
          </div>
        ) : null}
        <ExpandIcon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform fill-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Button>
    </div>
  );
};

export default StoryMarker;
