import dynamic from 'next/dynamic';

import { InfoIcon } from 'lucide-react';

import {
  StepLayoutMapStepComponent,
  StepLayoutItem,
  StoryCategoryDataAttributes,
} from '@/types/generated/strapi.schemas';

import CategoryIcon from '@/components/ui/category-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Legend = dynamic(() => import('@/containers/map/legend'), {
  ssr: false,
});

type MapStepLayoutProps = {
  step: StepLayoutItem;
  category: StoryCategoryDataAttributes | undefined;
};

const MapStepLayout = ({ step, category }: MapStepLayoutProps) => {
  const { story_summary, card } = step as StepLayoutMapStepComponent;

  return (
    <div className="flex h-full justify-between">
      <div className="space-y-8">
        <div className="pointer-events-auto w-fit space-y-4">
          {story_summary?.length && (
            <div className="space-x-2">
              <CategoryIcon className="inline h-10 w-10 fill-gray-200" slug={category?.slug} />
              <span className="font-open-sans text-sm">{category?.name}</span>
            </div>
          )}
          {story_summary?.map((item) => (
            <div className="w-fit" key={item.id}>
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
      <div className="pointer-events-auto space-y-10 self-end">
        <div className="rounded border border-gray-800 bg-[#335e6f] bg-opacity-50 p-8 backdrop-blur">
          <div className="h-full w-96 space-y-1">
            {card?.title && <h3 className="text-2xl font-bold">{card?.title}</h3>}
            <p className="font-inter text-sm">{card?.content}</p>
          </div>
        </div>
        <Legend />
      </div>
    </div>
  );
};

export default MapStepLayout;
