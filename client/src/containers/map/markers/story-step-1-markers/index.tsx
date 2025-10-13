'use client';

import { useMemo, useState } from 'react';

import { Marker } from 'react-map-gl';

import Image from 'next/image';

import { env } from '@/env.mjs';

import { cn } from '@/lib/classnames';

import { StoryStepMapMarker } from '@/types/story';

import StoryMarkerMediaMap from '@/containers/map/markers/story-markers/media-map';

import Carousel from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const MARKER = ({ name }: { name: string }) => (
  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gray-800">
    {/* Label outside, to the left */}
    <div className="absolute left-full top-1/2 ml-2 flex -translate-y-1/2 items-center justify-center">
      <div
        className="font-notes whitespace-nowrap rounded border 
                 border-gray-800 bg-gray-800/80 px-2 py-1 text-sm 
                 font-bold uppercase leading-5 tracking-[0.05em] text-gray-200"
      >
        {name}
      </div>
    </div>

    {/* Pin centered inside */}
    <Image
      src={`${env.NEXT_PUBLIC_BASE_PATH}/images/map/pin-marker.svg`}
      width={32}
      height={32}
      priority
      alt="Story marker"
      className="h-6 w-6 origin-bottom animate-bounce object-cover"
    />
  </div>
);
export default function Step1Markers({ markers }: { markers: StoryStepMapMarker[] }) {
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
    const { media, lat, lng, name, id } = marker;

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
                <div className={cn('full flex h-12 w-12 items-center justify-center rounded')}>
                  <div className="full group absolute h-12 w-12 rounded-full border-[3px] border-gray-200 px-0 py-0 shadow-md shadow-gray-950/25 transition-all duration-300 hover:h-[105px] hover:w-[105px]">
                    {media ? (
                      <StoryMarkerMediaMap
                        onClickExpand={() => handleClickMarker(markers.indexOf(marker))}
                        media={media}
                        name={name}
                        isExpanded={currentMedia === markers.indexOf(marker)}
                      />
                    ) : (
                      <MARKER name={name} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Marker>
      </>
    );
  });
}
