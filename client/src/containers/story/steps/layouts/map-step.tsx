'use client';

import { InfoIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
// import { useScrollToItem } from '@/lib/scroll';

import {
  StepLayoutMapStepComponent,
  StoryStepsItem,
  StoryCategoryDataAttributes,
  WidgetWidgetComponent,
} from '@/types/generated/strapi.schemas';

import Chart from '@/components/chart';
import CategoryIcon from '@/components/ui/category-icon';
import RichText from '@/components/ui/rich-text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type MapStepLayoutProps = {
  step: StoryStepsItem;
  category: StoryCategoryDataAttributes | undefined;
  stepIndex: number;
  showContent?: boolean;
};

const cardClassName =
  'rounded border border-gray-800 bg-[#335e6f] bg-opacity-50 py-6 px-4 backdrop-blur';

const MapStepLayout = ({ step, category, showContent, stepIndex }: MapStepLayoutProps) => {
  const { story_summary, card, widget } = step as StepLayoutMapStepComponent;
  // const scrollToItem = useScrollToItem();

  // const handleClickCard = () => {
  //   scrollToItem(stepIndex + 1);
  // };

  return (
    <div className="flex justify-between">
      <div className="flex flex-1 flex-col space-y-8 pt-[84px]">
        {!!story_summary?.length && (
          <div className="pointer-events-auto w-72 space-y-4 ">
            <div className={cn(cardClassName, 'space-x-2')}>
              <CategoryIcon className="inline h-10 w-10 fill-gray-200" slug={category?.slug} />
              <span className="font-open-sans text-sm">{category?.name}</span>
            </div>

            <div className={cn(cardClassName, 'space-y-4')}>
              {story_summary?.map((item) => (
                <div className="space-y-1" key={item.id}>
                  <div className="text-enlight-yellow-400 flex items-center gap-2">
                    <h2 className="text-sm font-bold uppercase">{item.title}</h2>
                    {item.info && (
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger disabled={true}>
                          <InfoIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">{item.info}</TooltipContent>
                      </Tooltip>
                    )}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MapStepLayout;
