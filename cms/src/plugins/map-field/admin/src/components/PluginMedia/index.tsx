import './index.css';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Box } from '@strapi/design-system';
import { apiBaseUrl } from '../../constants';

interface PluginMediaProps {
  media: any;
  name: string;
  playable?: boolean;
  width?: string | number;
  height?: string | number;
  isMarker?: boolean;
  isDragging?: boolean;
}

const PluginMedia = ({
  media,
  playable = false,
  name,
  height = '40px',
  width = '40px',
  isMarker = false,
  isDragging = false,
}: PluginMediaProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mediaType = useMemo(() => media?.mime?.split('/')[0], [media?.mime]);

  const handlePlayVideo = (
    e: React.MouseEvent<HTMLVideoElement, MouseEvent>,
    action: 'play' | 'pause'
  ) => {
    if (!playable) return;
    if (action === 'play') e.currentTarget.play();
    else e.currentTarget.pause();
  };

  useEffect(() => {
    if (isDragging && playable && mediaType === 'video') {
      videoRef.current?.pause();
    }
  }, [isDragging, playable]);

  const mediaSrc =
    process.env.NEXT_PUBLIC_API_URL === 'development' ? `${apiBaseUrl}${media?.url}` : media?.url;

  const MediaComponent = useCallback(() => {
    {
      switch (mediaType) {
        case 'image':
          return <img width="100%" height="100%" src={mediaSrc} alt={name} />;
        case 'video':
          return (
            <video
              style={{
                objectFit: 'cover',
              }}
              width="100%"
              height="100%"
              src={mediaSrc}
              ref={videoRef}
              muted
              onMouseEnter={(e) => handlePlayVideo(e, 'play')}
              onMouseLeave={(e) => handlePlayVideo(e, 'pause')}
            />
          );
        default:
          return null;
      }
    }
  }, [mediaType, media?.url, name]);

  return (
    <Box
      width={width}
      height={height}
      borderRadius="50%"
      backgroundColor="neutral800"
      overflow="hidden"
      className={`media ${isMarker && !isDragging && 'media-preview'} ${
        isDragging && 'is-dragging'
      }`}
    >
      <MediaComponent />
    </Box>
  );
};

export default PluginMedia;
