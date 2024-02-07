import Image from 'next/image';

import { StoryListResponseDataItem } from '@/types/generated/strapi.schemas';

type StorySummaryProps = {
  story: StoryListResponseDataItem;
};

const StorySummary = ({ story }: StorySummaryProps) => {
  return (
    <div className="flex gap-2">
      <div className="shrink-0">
        <Image
          alt={story.attributes?.title || 'Story image'}
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/story-card-image.png`}
          width={72}
          height={72}
        />
      </div>
      <div className="space-y-1 text-gray-300">
        <h3 className="text-sm font-bold leading-4 text-gray-300">{story.attributes?.title}</h3>
        <p className="font-open-sans text-xs font-light italic">Warri, Nigeria</p>
      </div>
    </div>
  );
};

export default StorySummary;
