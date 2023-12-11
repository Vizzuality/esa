import { useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

import Video from '@/containers/story/video';

const MOCK_MEDIA = [
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

const Carousel = () => {
  const [currentMedia, setCurrentMedia] = useState(MOCK_MEDIA[1]);

  const setPrevImage = () => {
    setCurrentMedia(MOCK_MEDIA[currentMedia.id - 1]);
  };

  const setNextImage = () => {
    setCurrentMedia(MOCK_MEDIA[currentMedia.id + 1]);
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
    <>
      <p className="font-notes mt-10 text-2xl text-white">
        {currentMedia?.id + 1} of {MOCK_MEDIA.length}
      </p>
      <div className="flex h-full w-screen items-center justify-center">
        <div className="relative flex h-3/6 w-2/12 items-center">
          {MOCK_MEDIA[currentMedia?.id - 1]?.img && (
            <button onClick={setPrevImage} className="h-full">
              <Image
                src={MOCK_MEDIA[currentMedia.id - 1].img || ''}
                style={{
                  objectFit: 'cover',
                  height: '100%',
                  minWidth: '100px',
                  position: 'absolute',
                  top: 0,
                  right: '20%',
                }}
                height={1200}
                width={500}
                alt="mock"
              />
            </button>
          )}
          {MOCK_MEDIA[currentMedia?.id - 1]?.video && (
            <button
              onClick={setPrevImage}
              className="h-full"
              style={{
                position: 'absolute',
                top: 0,
                left: '-60%',
              }}
            >
              <Video
                loop
                playing={false}
                url={MOCK_MEDIA[currentMedia.id - 1].video}
                height={300}
                width={500}
              />
            </button>
          )}
        </div>
        <motion.div
          key={currentMedia.id}
          className="flex w-8/12 flex-col items-center space-y-3"
          variants={variants}
          animate={'show'}
          initial="hide"
        >
          {currentMedia?.img && (
            <Image src={currentMedia.img} height={1000} width={1000} alt="mock" />
          )}
          {currentMedia?.video && (
            <Video loop playing={false} url={currentMedia?.video} height={600} width={1000} />
          )}
          <p className="font-sans text-sm text-white">{MOCK_MEDIA[currentMedia?.id]?.legend}</p>
        </motion.div>
        <motion.div
          className="relative flex h-3/6 w-2/12 items-center"
          key={currentMedia.legend}
          variants={variants}
          animate={'show'}
          initial="hide"
        >
          {MOCK_MEDIA[currentMedia?.id + 1]?.img && (
            <button onClick={setNextImage} className="h-full">
              <Image
                src={MOCK_MEDIA[currentMedia?.id + 1].img || ''}
                style={{
                  objectFit: 'cover',
                  height: '100%',
                  minWidth: '100px',
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                }}
                height={1200}
                width={500}
                alt="mock"
              />
            </button>
          )}
          {MOCK_MEDIA[currentMedia?.id + 1]?.video && (
            <button
              onClick={setPrevImage}
              className="h-full"
              style={{
                position: 'absolute',
                top: 0,
                right: '-60%',
              }}
            >
              <Video
                loop
                playing={false}
                url={MOCK_MEDIA[currentMedia?.id + 1].video}
                height={300}
                width={500}
              />
            </button>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Carousel;
