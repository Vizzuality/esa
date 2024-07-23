'use client';

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

import MapContent from './components/map-content';

export type StorySummary = {
  title: string;
  content?: (StoryIfisDataItem | StoryTagsDataItem)[];
};

type MapStepLayoutProps = {
  step: StoryStepsItem;
  showContent?: boolean;
  storySummary?: StorySummary[] | null;
};

const MapStepLayout = ({ step, showContent, storySummary }: MapStepLayoutProps) => {
  const { card, widget } = step as StepLayoutMapStepComponent;

  const { step: currentStep } = useSyncStep();

  return (
    <div className="flex justify-end">
      <div
        className={cn(
          'relative pt-[84px]',
          currentStep === 1 ? 'min-h-[calc(100vh-48px)]' : 'min-h-screen'
        )}
      >
        <div className="flex min-h-full w-[468px] flex-col items-end justify-end space-y-6 pb-8">
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
                <Chart widget={widget as WidgetWidgetComponent} />
                {(widget as any)?.legend && <RichText>{(widget as any).legend}</RichText>}
              </div>
            </MapContent>
          )}
          {!!storySummary?.length && (
            <div className="pointer-events-auto flex w-full max-w-full flex-wrap justify-between gap-4 rounded border border-gray-800 bg-[#335e6f] bg-opacity-50 px-6 py-4 backdrop-blur">
              {storySummary?.map((item) => (
                <div className="space-y-1" key={item.title}>
                  <div className="text-enlight-yellow-400 flex items-center gap-2">
                    <h2 className="text-sm font-bold uppercase">{item.title}</h2>
                  </div>
                  <div className="space-y-2">
                    {item.content?.map((c) => {
                      return (
                        <div key={c.id} className="flex gap-2">
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
                              <p className="font-open-sans w-max leading-none">
                                {c.attributes?.name}
                              </p>
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
        <div className="absolute bottom-8 left-0 flex w-screen items-center">
          <ScrollExplanation>Scroll down to explore the story</ScrollExplanation>
        </div>
      )}
    </div>
  );
};

export default MapStepLayout;
