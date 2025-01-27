'use client';

import dynamic from 'next/dynamic';

import { InfoIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useSyncStep } from '@/store/stories';

import {
  StepLayoutMapStepComponent,
  StoryIfisDataItem,
  StoryStepsItem,
  StoryTagsDataItem,
  WidgetWidgetComponent,
} from '@/types/generated/strapi.schemas';

import Chart from '@/components/chart';
import RichText from '@/components/ui/rich-text';
import ScrollExplanation from '@/components/ui/scroll-explanation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import StoryMarkerMedia from '@/containers/map/markers/story-markers/media';

import MapContent from './components/map-content';
import { useMemo, useState } from 'react';
import { StoryStepMap } from '@/types/story';
import Image from 'next/image';
import Carousel from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const MapLegends = dynamic(() => import('@/containers/map/legend'), {
  ssr: false,
});

export type StorySummary = {
  title: string;
  content?: (StoryIfisDataItem | StoryTagsDataItem)[];
};

type MapStepLayoutProps = {
  step: StoryStepsItem;
  showContent?: boolean;
  storySummary?: StorySummary[] | null;
  map?: StoryStepMap;
};

const MapStepLayout = ({ step, showContent, storySummary }: MapStepLayoutProps) => {
  const { card, widget, map } = step as StepLayoutMapStepComponent & { map: StoryStepMap };
  const medias = useMemo(() => {
    return map?.markers?.map((marker) => ({
      title: marker?.name,
      id: marker?.id,
      url: marker?.media?.url,
      mime: marker?.media?.mime,
      type: marker?.media?.mime?.includes('video') ? 'video' : 'image',
    }));
  }, [map]);

  const { step: currentStep } = useSyncStep();

  const [currentMedia, setCurrentMedia] = useState<number>();

  const handleClickMarker = (markerIndex: number) => {
    setCurrentMedia(markerIndex);
  };

  return (
    <div className="flex justify-end">
      <div
        className={cn(
          'relative space-y-4 pt-[80vh] sm:pt-[84px]',
          currentStep === 1 ? 'sm:min-h-[calc(100vh-48px)]' : 'min-h-screen',
          showContent ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="absolute left-0 top-[80vh] z-10 w-full -translate-y-full px-4 sm:fixed sm:bottom-8 sm:left-14 sm:top-auto sm:w-fit sm:translate-y-0 sm:px-0">
          <MapLegends className="" />
        </div>

        {/* Desktop */}
        <div className="hidden min-h-full w-[468px] flex-col items-end justify-end space-y-1 rounded-none pb-8 sm:flex">
          {!!card && (
            <MapContent
              showContent={showContent}
              title={card.title}
              titlePlaceholder={card.content}
            >
              <RichText>{card.content}</RichText>
            </MapContent>
          )}
          {!!widget?.id && (
            <MapContent showContent={showContent} title={widget.title}>
              <div className="mt-2 space-y-2">
                <div className="mx-auto w-fit">
                  <Chart widget={widget as WidgetWidgetComponent} />
                </div>
                {(widget as any)?.legend && <RichText>{(widget as any).legend}</RichText>}
              </div>
            </MapContent>
          )}
          {!!medias?.length && (
            <div className="pointer-events-auto w-full max-w-full justify-between gap-4 space-y-4 rounded border-gray-800 px-6 py-4 sm:border sm:bg-[#335e6f]/80 sm:backdrop-blur">
              <div className="text-enlight-yellow-400 flex items-center gap-2">
                <h2 className="font-bold uppercase sm:text-sm">Multimedia Gallery</h2>
              </div>
              <div className="flex gap-2">
                {medias.map((marker, index) => (
                  <div key={marker.id}>
                    <StoryMarkerMedia
                      onClickExpand={() => handleClickMarker(index)}
                      media={marker}
                      name={marker.title}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {!!storySummary?.length && (
            <div className="pointer-events-auto flex w-full max-w-full flex-wrap justify-between gap-4 rounded border-gray-800 px-6 py-4 sm:border sm:bg-[#335e6f]/80 sm:backdrop-blur">
              {storySummary?.map((item) => (
                <div className="space-y-1" key={item.title}>
                  <div
                    key={`${item.title}-title`}
                    className="text-enlight-yellow-400 flex items-center gap-2"
                  >
                    <h2 className="font-bold uppercase sm:text-sm">{item.title}</h2>
                  </div>
                  <div key={`${item.title}-content`} className="space-y-2">
                    {item.content?.map((c) => {
                      return (
                        <div key={`${c.id}-${c.attributes?.name}`} className="flex gap-2">
                          <>
                            {c.attributes?.link ? (
                              <a
                                className="font-open-sans block w-max leading-none hover:underline"
                                href={c.attributes.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {c.attributes?.name}
                              </a>
                            ) : (
                              <p className="font-open-sans leading-tight">{c.attributes?.name}</p>
                            )}
                            {c.attributes?.description && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <InfoIcon className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md">
                                  {c.attributes?.description}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="bg-background/80 flex flex-col items-end justify-end rounded-2xl pb-4 backdrop-blur sm:hidden">
          {!!card && (
            <MapContent
              showContent={showContent}
              title={card.title}
              titlePlaceholder={card.content}
            >
              <RichText>{card.content}</RichText>
            </MapContent>
          )}
          {!!widget?.id && (
            <MapContent showContent={showContent} title={widget.title}>
              <div className="mt-2 space-y-2">
                <div className="mx-auto w-fit">
                  <Chart widget={widget as WidgetWidgetComponent} />
                </div>
                {(widget as any)?.legend && <RichText>{(widget as any).legend}</RichText>}
              </div>
            </MapContent>
          )}
          {!!storySummary?.length && (
            <div className="pointer-events-auto flex w-full max-w-full flex-wrap justify-between gap-4 rounded border-gray-800 px-6 py-4 sm:border sm:bg-[#335e6f]/80 sm:backdrop-blur">
              {storySummary?.map((item) => (
                <div className="space-y-1" key={item.title}>
                  <div
                    key={`${item.title}-title`}
                    className="text-enlight-yellow-400 flex items-center gap-2"
                  >
                    <h2 className="font-bold uppercase sm:text-sm">{item.title}</h2>
                  </div>
                  <div key={`${item.title}-content`} className="space-y-2">
                    {item.content?.map((c) => {
                      return (
                        <div key={`${c.id}-${c.attributes?.name}`} className="flex gap-2">
                          <>
                            {c.attributes?.link ? (
                              <a
                                className="font-open-sans block w-max leading-none hover:underline"
                                href={c.attributes.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {c.attributes?.name}
                              </a>
                            ) : (
                              <p className="font-open-sans leading-tight">{c.attributes?.name}</p>
                            )}
                            {c.attributes?.description && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <InfoIcon className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md">
                                  {c.attributes?.description}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {currentStep === 1 && (
        <div className="bottom-8 left-0  hidden w-screen items-center sm:fixed sm:flex">
          <ScrollExplanation>Scroll down to explore the story</ScrollExplanation>
        </div>
      )}
      <Dialog
        onOpenChange={() => setCurrentMedia(undefined)}
        open={typeof currentMedia === 'number'}
      >
        <DialogContent className="h-screen rounded-none border-0 bg-transparent sm:rounded-none">
          <Carousel selected={currentMedia} options={{ loop: true }} medias={medias} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapStepLayout;
