'use client';

import { InfoIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { useScrollToItem } from '@/lib/scroll';

import {
  StepLayoutMapStepComponent,
  StoryStepsItem,
  StoryCategoryDataAttributes,
  WidgetWidgetComponent,
  MapLayerCardComponent,
} from '@/types/generated/strapi.schemas';

import Chart from '@/components/chart';
import CategoryIcon from '@/components/ui/category-icon';
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
  const scrollToItem = useScrollToItem();

  const handleClickCard = () => {
    scrollToItem(stepIndex + 1);
  };

  return (
    <div className="pointer-events-none h-full max-h-screen ">
      <div className="flex h-full justify-between px-14 pt-[84px]">
        <div className="flex flex-1 flex-col space-y-8">
          {!!story_summary?.length && (
            <div className="pointer-events-auto min-w-fit space-y-4 lg:w-[280px]">
              <div className={cn(cardClassName, 'space-x-2')}>
                <CategoryIcon className="inline h-10 w-10 fill-gray-200" slug={category?.slug} />
                <span className="font-open-sans text-sm">{category?.name}</span>
              </div>

              <div className={cn(cardClassName, 'space-y-4')}>
                {story_summary?.map((item) => (
                  <div className="space-y-1" key={item.id}>
                    <div className="text-enlight-yellow-400 flex items-center gap-2">
                      <h2 className="tetx-sm font-bold uppercase">{item.title}</h2>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">{item.info}</TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="font-open-sans">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="">
          <div className="flex h-fit min-h-full flex-col items-end justify-center space-y-6 pb-6">
            {[card, widget]?.map((item, index) => {
              if (!item) return null;
              return (
                <div
                  key={item?.id}
                  onClick={handleClickCard}
                  className={cn(
                    'pointer-events-auto cursor-pointer overflow-hidden rounded border border-gray-800 bg-[#335e6f] bg-opacity-50 p-8 backdrop-blur transition-all duration-300 ease-in-out',
                    showContent ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <div className="w-[400px] space-y-1">
                    {item?.title && (
                      <h2 className="font-notes text-2xl font-bold">{item?.title}</h2>
                    )}
                    {index === 0 ? (
                      <div className="font-open-sans space-y-4">
                        {(item as MapLayerCardComponent)?.content?.split('\n').map((p, i) => (
                          <p key={i} className="text-sm">
                            {p}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <Chart widget={item as WidgetWidgetComponent} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStepLayout;
