'use client';
import { useRef, useEffect, useCallback } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

import { cn } from '@/lib/classnames';

type CarouselMediaProps = {
  media: {
    id: number;
    url: string;
    mime: string;
    type: string;
    title: string;
  };
  isCurrentMedia?: boolean;
};

const CarouselMedia = ({ media, isCurrentMedia }: CarouselMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isCurrentMedia && videoRef.current) {
      videoRef.current?.pause();
    }
  }, [isCurrentMedia]);

  if (media?.type === 'video') {
    return (
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        src={media?.url}
        muted={!isCurrentMedia}
        loop
        controls={isCurrentMedia}
        autoPlay={isCurrentMedia}
        className={cn(
          'h-full max-h-[calc(100vh-152px)] w-full',
          isCurrentMedia ? 'object-contain' : 'object-cover'
        )}
      >
        <source src={media.url} type={media.mime} />
      </video>
    );
  }
  return (
    <Image
      src={media?.url}
      className={cn(
        'h-full max-h-[calc(100vh-152px)] w-full',
        isCurrentMedia ? 'object-contain' : 'object-cover'
      )}
      height={1200}
      width={500}
      alt={media.title}
    />
  );
};

type CarouselProps = {
  medias: CarouselMediaProps['media'][];
  currentMedia?: number;
  setCurrentMedia: (currentMedia: number) => void;
};

const variants = {
  isCurrentMedia: {
    x: '0%',
    width: '75%',
    height: '100%',
  },
  isPrevMedia: {
    x: '-30%',
    width: '12.5%',
    height: '50%',
  },
  isNextMedia: {
    x: '30%',
    width: '12.5%',
    height: '50%',
  },
  isNotVisible: {
    x: '0%',
    width: '0%',
    height: '50%',
  },
};

const Carousel = ({ medias, currentMedia, setCurrentMedia }: CarouselProps) => {
  const getVariant = useCallback(
    (index: number) => {
      if (typeof currentMedia !== 'number') return 'isNotVisible';
      if (index === currentMedia) {
        return 'isCurrentMedia';
      }
      if (index === currentMedia - 1) {
        return 'isPrevMedia';
      }
      if (index === currentMedia + 1) {
        return 'isNextMedia';
      }
      return 'isNotVisible';
    },
    [currentMedia]
  );

  if (typeof currentMedia !== 'number') {
    return null;
  }

  return (
    <div className="flex h-screen flex-col space-y-10 py-10">
      <p className="flex-0 font-notes text-center text-2xl text-white">
        {currentMedia + 1} of {medias.length}
      </p>
      <div className="flex flex-1 items-center">
        <div className={cn(currentMedia === 0 ? 'w-[12.5%]' : 'w-0')}></div>
        {medias.map((media, index) => {
          const isCurrentMedia = index === currentMedia;
          return (
            <motion.div key={index} animate={variants[getVariant(index)]}>
              <button
                disabled={isCurrentMedia}
                className="h-full w-full"
                onClick={() => setCurrentMedia(index)}
              >
                <CarouselMedia media={media} isCurrentMedia={isCurrentMedia} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
