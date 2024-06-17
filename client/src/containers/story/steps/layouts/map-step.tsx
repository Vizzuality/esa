'use client';

import { useMemo, useState } from 'react';

import dynamic from 'next/dynamic';

import { InfoIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

import { useSyncStep } from '@/store/stories';

import {
  StepLayoutMapStepComponent,
  StoryIfisDataItem,
  StoryStepsItem,
  StoryTagsDataItem,
  WidgetWidgetComponent,
} from '@/types/generated/strapi.schemas';
import { StoryStepMap } from '@/types/story';

import Chart from '@/components/chart';
import Carousel from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import RichText from '@/components/ui/rich-text';
import ScrollExplanation from '@/components/ui/scroll-explanation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// import StoryMarkerMedia from '@/containers/map/markers/story-markers/media';

import MapContent from './components/map-content';

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
  quote?: {
    name: string;
    content: string;
    image: {
      data:
        | {
            attributes: {
              url: string;
              image: string;
            };
          }[]
        | null;
    } | null;
  };
};

const MapStepLayout = ({ step, showContent, storySummary }: MapStepLayoutProps) => {
  const { card, widget, map, quote } = step as StepLayoutMapStepComponent & {
    map: StoryStepMap;
    quote: MapStepLayoutProps['quote'];
  };
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

  // const handleClickMarker = (markerIndex: number) => {
  //   setCurrentMedia(markerIndex);
  // };

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
              title={
                currentStep === 1 ? (
                  <span className="text-enlight-yellow-400">{card.title}</span>
                ) : (
                  card.title
                )
              }
              titlePlaceholder={card.content}
            >
              <RichText>{card.content}</RichText>
            </MapContent>
          )}
          {!!widget?.id && (
            <MapContent showContent={showContent} title={widget.title}>
              <div className="mt-2 space-y-2">
                <div className="mx-auto w-fit space-y-6">
                  {widget.type !== 'multiple' ? (
                    <Chart widget={widget as WidgetWidgetComponent} />
                  ) : (
                    Object.entries(widget?.data as Record<string, any>).map(
                      ([variable, block], index, array) => {
                        return (
                          <Chart
                            key={variable}
                            isLast={index === array.length - 1}
                            widget={{
                              ...widget,
                              type: block.type || 'line',
                              data: {
                                ...block,
                              },
                              title: variable,
                            }}
                          />
                        );
                      }
                    )
                  )}
                </div>
                {(widget as any)?.legend && <RichText>{(widget as any).legend}</RichText>}
              </div>
            </MapContent>
          )}

          {quote && (
            <MapContent key={quote.name} showContent={showContent}>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="font-notes flex align-text-top text-[88px] leading-[0.9] text-teal-500">
                    “
                  </span>

                  <div className="flex flex-col space-y-2">
                    <RichText>{quote.content}</RichText>
                    <div className="flex items-center space-x-2">
                      {!!quote?.image?.data?.length && (
                        <div
                          className="border-primary flex h-14 w-14 shrink-0 rounded-full border bg-cover bg-top bg-no-repeat"
                          style={{
                            backgroundImage: `url(${getImageSrc(
                              quote?.image?.data?.[0]?.attributes?.url ||
                                quote.image?.data?.[0]?.attributes?.image
                            )})`,
                          }}
                        />
                      )}
                      <RichText className="text-sm">{quote.name}</RichText>
                    </div>
                  </div>
                </div>
              </div>
            </MapContent>
          )}

          {/* {!!medias?.length && (
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
                  {item.link ? (
                    <a
                      className="font-open-sans"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="font-open-sans">{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="relative min-h-screen pt-[84px]">
        <div className="flex min-h-full flex-col items-end justify-end space-y-6 pb-16">
          {!!card && (
            <div
              className={cn(
                'pointer-events-auto overflow-hidden rounded border border-gray-800 bg-[#335e6f] bg-opacity-50 p-8 backdrop-blur transition-all duration-300 ease-in-out',
                showContent ? 'opacity-100' : 'opacity-0'
              )}
            >
              <div className="w-[400px] space-y-2">
                {card?.title && <h2 className="font-notes text-2xl font-bold">{card?.title}</h2>}
                <div className="font-open-sans space-y-4">
                  <RichText className="text-white">{card?.content}</RichText>
                </div>
              </div>
            </div>
          )}
          {!!widget?.id && (
            <div
              className={cn(
                'pointer-events-auto overflow-hidden rounded border border-gray-800 bg-[#335e6f] bg-opacity-50 p-8 backdrop-blur transition-all duration-300 ease-in-out',
                showContent ? 'opacity-100' : 'opacity-0'
              )}
            >
              <div className="w-[400px] space-y-2">
                {widget?.title && <h2 className="font-notes text-xl font-bold">{widget?.title}</h2>}
                <Chart widget={widget as WidgetWidgetComponent} />
                {(widget as any)?.legend && <RichText>{(widget as any).legend}</RichText>}
              </div>
            </div>
          )} */}
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
                                className="font-open-sans block leading-none hover:underline"
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
              title={
                currentStep === 1 ? (
                  <span className="text-enlight-yellow-400">{card.title}</span>
                ) : (
                  card.title
                )
              }
              titlePlaceholder={card.content}
            >
              <RichText>{card.content}</RichText>
            </MapContent>
          )}
          {!!widget?.id && (
            <MapContent showContent={showContent} title={widget.title}>
              <div className="mt-2 space-y-2">
                <div className="mx-auto w-fit space-y-6">
                  {widget.type !== 'multiple' ? (
                    <Chart widget={widget as WidgetWidgetComponent} />
                  ) : (
                    Object.entries(widget?.data as Record<string, any>).map(
                      ([variable, block], index, array) => {
                        return (
                          <Chart
                            key={variable}
                            isLast={index === array.length - 1}
                            widget={{
                              ...widget,
                              type: block.type || 'line',
                              data: {
                                ...block,
                              },
                              title: variable,
                            }}
                          />
                        );
                      }
                    )
                  )}
                </div>
                {(widget as any)?.legend && <RichText>{(widget as any).legend}</RichText>}
              </div>
            </MapContent>
          )}
          {/* {!!medias?.length && (
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
          )} */}
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
                                className="font-open-sans block leading-none hover:underline"
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
