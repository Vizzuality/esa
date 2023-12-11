import { useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

const medias = [
  {
    id: 0,
    img: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/mock/carousel.png`,
    legend: 'Summary of GDA Urban EO Information and Use Cases 1',
  },
  {
    id: 1,
    video: 'https://youtu.be/vCzmxg9y7gA?si=JLwAHz3sPJzNR3DM',
    legend: 'Summary of GDA Urban EO Information and Use Cases 2',
  },
  {
    id: 2,
    img: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/mock/carousel.png`,
    legend: 'Summary of GDA Urban EO Information and Use Cases 3',
  },
];

type CarouselMediaProps = {
  media: any;
  isCurrentMedia?: boolean;
};

const CarouselMedia = ({ media, isCurrentMedia }: CarouselMediaProps) => {
  if (media?.type === 'video') {
    return (
      <video
        width="100%"
        height="100%"
        src={media?.url}
        muted={!isCurrentMedia}
        loop
        controls={isCurrentMedia}
        autoPlay={isCurrentMedia}
        className=""
      >
        <source src={media.url} type={media.mime} />
      </video>
    );
  }
  return (
    <Image
      src={media?.url}
      className="h-full w-full object-cover"
      height={1200}
      width={500}
      alt="mock"
    />
  );
};

type CarouselProps = {
  medias: any[];
  currentMedia: number;
  setCurrentMedia: (currentMedia: number) => void;
};

const Carousel = ({ medias, currentMedia, setCurrentMedia }: CarouselProps) => {
  const setPrevImage = () => {
    setCurrentMedia(currentMedia - 1);
  };

  const setNextImage = () => {
    setCurrentMedia(currentMedia + 1);
  };

  const variants = {
    show: {
      opacity: 1,
      transition: {
        ease: 'easeOut',
        duration: 0.3,
      },
    },
    hide: {
      opacity: 0,
    },
  };

  return (
    <div className="mb-24 flex h-screen flex-col">
      <p className="flex-0 font-notes mt-10 text-center text-2xl text-white">
        {currentMedia} of {medias.length}
      </p>
      <div className="flex h-full w-screen flex-1 items-center justify-center">
        <motion.div
          key={currentMedia - 1}
          className="relative flex h-3/6 w-2/12 items-center"
          style={{
            transform: 'translateX(-40%)',
          }}
        >
          {currentMedia - 1 && (
            <button onClick={setPrevImage} className="h-full w-full">
              <CarouselMedia media={medias[currentMedia - 1]} />
            </button>
          )}
        </motion.div>
        <motion.div
          key={currentMedia}
          className="flex w-8/12 flex-col items-center space-y-3"
          variants={variants}
          animate={'show'}
          initial="hide"
        >
          <CarouselMedia media={medias[currentMedia]} isCurrentMedia />
        </motion.div>
        <motion.div
          className="relative flex h-3/6 w-2/12 items-center"
          key={currentMedia + 1}
          variants={variants}
          animate={'show'}
          initial="hide"
          style={{
            transform: 'translateX(40%)',
          }}
        >
          {currentMedia + 1 && (
            <button
              onClick={setNextImage}
              className="h-full"
              style={{
                position: 'absolute',
                top: 0,
                right: '60%',
              }}
            >
              <CarouselMedia media={medias[currentMedia + 1]} />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Carousel;
