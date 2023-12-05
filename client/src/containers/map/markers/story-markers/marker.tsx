import { useState } from 'react';

import { Marker } from 'react-map-gl';

import Image from 'next/image';

import { motion } from 'framer-motion';

import { StoryStepMapMarker } from '@/types/story';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import StoryMarkerMedia from './media';

type StoryMarkerProps = {
  marker: StoryStepMapMarker;
};

const MOCK_IMAGES = [
  {
    id: 0,
    img: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/mock/carousel.png`,
    legend: 'Summary of GDA Urban EO Information and Use Cases 1',
  },
  {
    id: 1,
    img: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/mock/carousel.png`,
    legend: 'Summary of GDA Urban EO Information and Use Cases 2',
  },
  {
    id: 2,
    img: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/mock/carousel.png`,
    legend: 'Summary of GDA Urban EO Information and Use Cases 3',
  },
];

const StoryMarker = ({ marker: { media, name, id, lat, lng } }: StoryMarkerProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleClickExpand = () => setIsFullScreen((prev) => !prev);

  const [currentImage, setCurrentImage] = useState(MOCK_IMAGES[1]);

  const setPrevImage = () => {
    setCurrentImage(MOCK_IMAGES[currentImage.id - 1]);
  };

  const setNextImage = () => {
    setCurrentImage(MOCK_IMAGES[currentImage.id + 1]);
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
      <Marker key={id} longitude={lng} latitude={lat}>
        <div className="h-[70px] w-[70px] overflow-hidden rounded-full border-[3px] border-gray-200 shadow-md shadow-gray-950/25 transition-all duration-500 hover:h-[200px] hover:w-[200px]">
          <StoryMarkerMedia
            isFullScreen={isFullScreen}
            onClickExpand={handleClickExpand}
            media={media}
            name={name}
          />
        </div>
      </Marker>
      <Dialog modal onOpenChange={(open) => setIsFullScreen(open)} open={isFullScreen}>
        <DialogContent className="flex h-screen w-screen flex-col items-center bg-transparent text-white backdrop-blur-lg">
          <p className="font-notes mt-10 text-2xl text-white">
            {currentImage.id + 1} of {MOCK_IMAGES.length}
          </p>
          <div className="flex h-full w-screen items-center justify-center">
            <div className="relative flex h-3/6 w-2/12 items-center">
              {MOCK_IMAGES[currentImage.id - 1] && (
                <button onClick={setPrevImage} className="h-full">
                  <Image
                    src={MOCK_IMAGES[currentImage.id - 1].img}
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
            </div>
            <motion.div
              key={currentImage.id}
              className="flex w-8/12 flex-col items-center space-y-3"
              variants={variants}
              animate={'show'}
              initial="hide"
            >
              <Image src={currentImage.img} height={1000} width={1000} alt="mock" />
              <p className="font-sans text-sm text-white">{MOCK_IMAGES[currentImage.id].legend}</p>
            </motion.div>
            <motion.div
              className="relative flex h-3/6 w-2/12 items-center"
              key={currentImage.legend}
              variants={variants}
              animate={'show'}
              initial="hide"
            >
              {MOCK_IMAGES[currentImage.id + 1] && (
                <button onClick={setNextImage} className="h-full">
                  <Image
                    src={MOCK_IMAGES[currentImage.id + 1].img}
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
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryMarker;
