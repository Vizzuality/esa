import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import { ExpandIcon } from 'lucide-react';

import env from '@/env.mjs';

import { cn } from '@/lib/classnames';

import { StoryStepMapMarkerMedia } from '@/types/story';

import { Button } from '@/components/ui/button';

const apiBaseUrl = env.NEXT_PUBLIC_API_URL.replace('/api', '');

type StoryMarkerMediaProps = {
  isFullScreen: boolean;
  name: string;
  media: StoryStepMapMarkerMedia;
  onClickExpand: () => void;
};

const StoryMarker = ({ media, name, isFullScreen, onClickExpand }: StoryMarkerMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hovered, setHovered] = useState(false);
  const mediaType = media?.mime?.split('/')[0];

  const mediaSrc = `${apiBaseUrl}${media?.url}`;
  const mediaMime = media?.mime;

  const handlePlayVideo = useCallback(
    (e: React.MouseEvent<HTMLVideoElement, MouseEvent>, action: 'play' | 'pause') => {
      if (isFullScreen) return;
      if (action === 'play') e.currentTarget.play();
      else e.currentTarget.pause();
    },
    [isFullScreen]
  );

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
      className="flex h-full max-h-screen w-full items-center justify-center"
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
      {mediaType === 'image' ? (
        <Image
          width={isFullScreen ? 1500 : hovered ? 200 : 70}
          height={isFullScreen ? 1500 : hovered ? 200 : 70}
          src={mediaSrc}
          className={mediaClassName}
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
          controls={isFullScreen}
          autoPlay={isFullScreen}
          className={mediaClassName}
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
