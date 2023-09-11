import { useGetStories } from '@/types/generated/story';
import { StepLayoutItem, StepLayoutOutroStepComponent } from '@/types/generated/strapi.schemas';

import StorySummary from '@/components/ui/story-summary';

type MediaStepLayoutProps = {
  step: StepLayoutItem;
  categoryId?: number;
};

const OutroStepLayout = ({ step, categoryId }: MediaStepLayoutProps) => {
  const { content, title } = step as StepLayoutOutroStepComponent;

  const { data: suggestions } = useGetStories(
    {
      filters: {
        category: categoryId,
      },
      'pagination[limit]': 3,
    },
    {
      query: {
        enabled: !!categoryId,
      },
    }
  );

  return (
    <div className="h-full w-full">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-end space-y-16 py-10">
        <div className="max-w-lg">
          <h3 className="text-enlight-yellow-500 text-[40px] font-bold tracking-wider">{title}</h3>
          <p>{content}</p>
        </div>
        <div className="flex flex-col gap-y-4">
          <p className="text-gray-500">Explore more stories</p>
          <div className="flex gap-x-8">
            {suggestions?.data?.map((story) => (
              <StorySummary key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutroStepLayout;
