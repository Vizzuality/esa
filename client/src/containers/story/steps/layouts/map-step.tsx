import dynamic from 'next/dynamic';

import { InfoIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { useScrollToItem } from '@/lib/scroll';

import {
  StepLayoutMapStepComponent,
  StepLayoutItem,
  StoryCategoryDataAttributes,
} from '@/types/generated/strapi.schemas';

import CategoryIcon from '@/components/ui/category-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Chart from '@/components/chart';

const Legend = dynamic(() => import('@/containers/map/legend'), {
  ssr: false,
});

type MapStepLayoutProps = {
  step: StepLayoutItem;
  category: StoryCategoryDataAttributes | undefined;
  stepIndex: number;
  showContent?: boolean;
};

const cardClassName =
  'rounded border border-gray-800 bg-[#335e6f] bg-opacity-50 py-6 px-4 backdrop-blur';

const MapStepLayout = ({ step, category, showContent, stepIndex }: MapStepLayoutProps) => {
  const { story_summary, card } = step as StepLayoutMapStepComponent;
  const scrollToItem = useScrollToItem();

  const handleClickCard = () => {
    scrollToItem(stepIndex + 1);
  };

  return (
    <div className="pointer-events-none h-full">
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
                      <h3 className=" tetx-sm font-bold uppercase">{item.title}</h3>
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
          <div
            className={cn(
              'pointer-events-auto fixed bottom-14 left-14 min-h-[44px] min-w-[280px]',
              {
                'opacity-100': showContent,
                'opacity-0': !showContent,
              }
            )}
          >
            <Legend />
          </div>
        </div>
        <div className="flex flex-1 items-end justify-end">
          <div className="h-[150vh] w-fit">
            <div className="sticky top-0 flex h-screen flex-col justify-end space-y-6 pb-6">
              {card?.map((item) => (
                <div
                  key={item?.id}
                  onClick={handleClickCard}
                  className={cn(
                    'pointer-events-auto cursor-pointer overflow-hidden rounded border border-gray-800 bg-[#335e6f] bg-opacity-50 p-8 backdrop-blur transition-all duration-300 ease-in-out',
                    showContent ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <div className="h-full w-[500px] space-y-1">
                    {item?.title && <h3 className="text-2xl font-bold">{item?.title}</h3>}
                    {!!item?.content && (
                      <div className="space-y-4">
                        {item.content.split('\n').map((p, i) => (
                          <p key={i} className="font-inter text-sm">
                            {p}
                          </p>
                        ))}
                      </div>
                    )}
                    {!!item?.widget && <Chart options={item?.widget} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStepLayout;
