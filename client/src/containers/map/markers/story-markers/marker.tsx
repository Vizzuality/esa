import { useState } from 'react';

import { Marker } from 'react-map-gl';

import Image from 'next/image';

import { StoryStepMapMarker } from '@/types/story';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import StoryMarkerMedia from './media';

type StoryMarkerProps = {
  marker: StoryStepMapMarker;
};

const MOCK_IMAGES = [
  {
    id: 0,
    img: '/images/mock/carousel.png',
  },
  {
    id: 1,
    img: '/images/mock/carousel.png',
  },
  {
    id: 2,
    img: '/images/mock/carousel.png',
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
        <DialogContent className="flex h-screen w-screen items-center justify-center space-x-14 bg-transparent text-white backdrop-blur-lg">
          <div className="relative flex h-2/6 w-1/6 items-center">
            {MOCK_IMAGES[currentImage.id - 1] && (
              <button onClick={setPrevImage} className="absolute -left-[150px]">
                <Image
                  src={MOCK_IMAGES[currentImage.id - 1].img}
                  height={300}
                  width={300}
                  alt="mock"
                />
              </button>
            )}
          </div>
          <div className="w-4/6">
            <Image src={currentImage.img} height={800} width={800} alt="mock" />
          </div>
          <div className="relative flex h-2/6 w-1/6 items-center">
            {MOCK_IMAGES[currentImage.id + 1] && (
              <button onClick={setNextImage} className="absolute -right-[150px]">
                <Image
                  src={MOCK_IMAGES[currentImage.id + 1].img}
                  height={300}
                  width={300}
                  alt="mock"
                />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryMarker;
