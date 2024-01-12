'use client';
import { useRef, useState } from 'react';

import Image from 'next/image';

import { ExpandIcon } from 'lucide-react';

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

  const [hovered, setHovered] = useState(false);
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

  const handleHover = (mouseOver: boolean) => {
    setHovered(mouseOver);
  };

  return (
    <div
      className={cn(
        'relative flex h-full max-h-screen w-full items-center justify-center',
        hovered ? 'z-20' : 'z-10'
      )}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {hovered && (
        <Button
          variant="icon"
          className="absolute z-50 h-14 w-14 rounded-full text-white backdrop-blur-lg transition-all duration-500"
          onClick={onClickExpand}
        >
          <ExpandIcon className="h-6 w-6" />
        </Button>
      )}
      {mediaType === 'image' ? (
        <Image
          width={hovered ? 200 : 70}
          height={hovered ? 200 : 70}
          src={mediaSrc}
          className="h-full w-full rounded-full object-cover transition-all duration-700"
          alt={name}
        />
      ) : mediaType === 'video' ? (
        <video
          width="100%"
          height="100%"
          src={mediaSrc}
          ref={videoRef}
          muted
          loop
          className="h-full w-full rounded-full object-cover transition-all duration-700"
          onMouseEnter={(e) => handlePlayVideo(e, 'play')}
          onMouseLeave={(e) => handlePlayVideo(e, 'pause')}
        >
          <source src={mediaSrc} type={mediaMime} />
        </video>
      ) : null}
    </div>
  );
};

export default StoryMarker;
