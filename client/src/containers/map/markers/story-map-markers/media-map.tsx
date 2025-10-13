'use client';
import { useRef } from 'react';

import Image from 'next/image';

import { ExpandIcon, PlayIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

import { StoryStepMapMarkerMedia } from '@/types/story';

type StoryMarkerMediaProps = {
  name: string;
  media: StoryStepMapMarkerMedia;
  onClickExpand: () => void;
  isExpanded: boolean;
};

const StoryMarker = ({ media, name, isExpanded }: StoryMarkerMediaProps) => {
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
    <div className="h-full w-full rounded-full border-[3px] border-gray-200 shadow-md shadow-gray-950/25 transition-all duration-300">
      {mediaType === 'image' ? (
        <Image
          width={88}
          height={88}
          src={mediaSrc}
          className={cn({
            'h-full w-full object-cover text-gray-200': true,
            'rounded-none': isExpanded,
            'rounded-full': !isExpanded,
          })}
          alt={name}
        />
      ) : mediaType === 'video' ? (
        <div
          className={cn({
            'h-full w-full': true,
            'rounded-none': isExpanded,
            'rounded-full': !isExpanded,
          })}
        >
          <video
            width="100%"
            height="100%"
            src={mediaSrc}
            ref={videoRef}
            muted
            loop
            className={cn({
              'h-full w-full object-cover': true,
              'rounded-none': isExpanded,
              'rounded-full': !isExpanded,
            })}
            onMouseEnter={(e) => handlePlayVideo(e, 'play')}
            onMouseLeave={(e) => handlePlayVideo(e, 'pause')}
          >
            <source src={mediaSrc} type={mediaMime} />
          </video>
          <PlayIcon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform fill-gray-200  opacity-100 transition-opacity duration-300 group-hover:opacity-0" />
        </div>
      ) : null}
      <ExpandIcon className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform fill-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};

export default StoryMarker;
