import { useState } from 'react';

import { Marker } from 'react-map-gl';

import { StoryStepMapMarker } from '@/types/story';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import StoryMarkerMedia from './media';

type StoryMarkerProps = {
  marker: StoryStepMapMarker;
};

const StoryMarker = ({ marker: { media, name, id, lat, lng } }: StoryMarkerProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleClickExpand = () => setIsFullScreen((prev) => !prev);

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
        <DialogContent className="h-screen w-screen bg-transparent text-white backdrop-blur-lg">
          <StoryMarkerMedia
            isFullScreen={isFullScreen}
            onClickExpand={handleClickExpand}
            media={media}
            name={name}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryMarker;
