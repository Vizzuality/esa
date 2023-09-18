import { useMemo } from 'react';

import { Marker } from 'react-map-gl';

import { useParams } from 'next/navigation';

import { useRecoilValue } from 'recoil';

import { stepAtom } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';

import StoryMarkerMedia from './media';

type StoryMarker = {
  id: number;
  lng: number;
  lat: number;
  media: {
    mime: string;
    url: string;
  };
  name: string;
};

const StoryMarkers = () => {
  const step = useRecoilValue(stepAtom);

  const { id } = useParams();
  const { data: storyData } = useGetStoriesId(+id, {
    populate: 'deep',
  });

  const markers: StoryMarker[] = useMemo(
    () =>
      storyData?.data?.attributes?.steps?.data?.[step]?.attributes?.layout[0].location?.markers ||
      [],
    [step, storyData?.data?.attributes?.steps?.data]
  );

  return (
    <div>
      {markers?.map(({ id, lng, lat, media, name }) => {
        if (lng && lat) {
          return (
            <Marker key={id} longitude={lng} latitude={lat}>
              <div className="h-[70px] w-[70px] overflow-hidden rounded-full bg-white p-2 shadow-md">
                <StoryMarkerMedia media={media} name={name} />
              </div>
            </Marker>
          );
        }
        return null;
      })}
    </div>
  );
};

export default StoryMarkers;
