import { Marker } from 'react-map-gl';

import { StoryStepMapMarker } from '@/types/story';

import StoryMarkerMedia from './media';

type StoryMarkerProps = {
  marker: StoryStepMapMarker;
  onClick: () => void;
};

const StoryMarker = ({ marker: { media, name, id, lat, lng }, onClick }: StoryMarkerProps) => {
  return (
    <>
      <Marker key={id} longitude={lng} latitude={lat}>
        <div className="h-[70px] w-[70px] overflow-hidden rounded-full border-[3px] border-gray-200 shadow-md shadow-gray-950/25 transition-all duration-500 hover:h-[200px] hover:w-[200px]">
          <StoryMarkerMedia onClickExpand={onClick} media={media} name={name} />
        </div>
      </Marker>
    </>
  );
};

export default StoryMarker;
