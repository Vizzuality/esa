'use client';

import { useMemo, useState } from 'react';

import { Marker } from 'react-map-gl';

import { cn } from '@/lib/classnames';

import { StoryStepMapMarker } from '@/types/story';

import StoryMarkerMediaMap from '@/containers/map/markers/story-map-markers/media-map';

import Carousel from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import { StoryPin } from './pin';

export default function StoryMapMarkers({ markers }: { markers: StoryStepMapMarker[] }) {
  const [currentMedia, setCurrentMedia] = useState<number>();

  const handleClickMarker = (markerIndex: number) => {
    setCurrentMedia(markerIndex);
  };

  const medias = useMemo(() => {
    return (
      markers
        ?.filter((marker) => marker?.media?.url && marker?.media?.mime)
        .map((marker) => ({
          title: marker?.name,
          id: marker?.id,
          url: marker?.media?.url,
          mime: marker?.media?.mime,
          type: marker?.media?.mime?.includes('video') ? 'video' : 'image',
        })) || []
    );
  }, [markers]);

  return markers?.map((marker) => {
    const { media, lat, lng, name } = marker;
    return (
      <>
        <Dialog
          onOpenChange={() => setCurrentMedia(undefined)}
          open={typeof currentMedia === 'number'}
        >
          <DialogContent className="h-screen rounded-none border-0 bg-transparent sm:rounded-none">
            <Carousel selected={currentMedia} options={{ loop: true }} medias={medias} />
          </DialogContent>
        </Dialog>

        <Marker key={name} anchor="right" latitude={lat} longitude={lng}>
          <div className="relative flex w-full items-center">
            <div
              className={cn(
                'relative z-50 hidden -translate-x-1/2 cursor-pointer items-center justify-center sm:flex'
              )}
            >
              <div className="absolute left-0 top-0 h-8 w-8 -translate-x-1/2 -translate-y-full">
                <div
                  className={cn({
                    'full group absolute h-14 w-14 rounded-full  px-0 py-0 shadow-md shadow-gray-950/25 transition-all duration-300':
                      true,
                    'hover:h-16 hover:w-16': media,
                  })}
                >
                  {media ? (
                    <StoryMarkerMediaMap
                      onClickExpand={() => handleClickMarker(markers.indexOf(marker))}
                      media={media}
                      name={name}
                      isExpanded={currentMedia === markers.indexOf(marker)}
                    />
                  ) : (
                    <StoryPin name={name} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Marker>
      </>
    );
  });
}
