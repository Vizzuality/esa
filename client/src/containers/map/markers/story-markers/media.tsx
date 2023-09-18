import Image from 'next/image';
import { useEffect, useRef } from 'react';
import env from '@/env.mjs';

const apiBaseUrl = 'http://localhost:1337';
// const apiBaseUrl = env.NEXT_PUBLIC_API_URL;

type StoryMarkerMediaProps = {
  media: {
    mime: string;
    url: string;
  };
  name: string;
};

const StoryMarkerMedia = ({ media, name }: StoryMarkerMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaType = media?.mime?.split('/')[0];

  const handlePlayVideo = (
    e: React.MouseEvent<HTMLVideoElement, MouseEvent>,
    action: 'play' | 'pause'
  ) => {
    if (action === 'play') e.currentTarget.play();
    else e.currentTarget.pause();
  };

  if (mediaType === 'image') {
    return <Image width={70} height={70} src={`${apiBaseUrl}${media?.url}`} alt={name} />;
  } else if (mediaType === 'video') {
    return (
      <video
        style={{
          objectFit: 'cover',
        }}
        width="100%"
        height="100%"
        src={`${apiBaseUrl}${media?.url}`}
        ref={videoRef}
        muted
        onMouseEnter={(e) => handlePlayVideo(e, 'play')}
        onMouseLeave={(e) => handlePlayVideo(e, 'pause')}
      />
    );
  }

  return null;
};

export default StoryMarkerMedia;
