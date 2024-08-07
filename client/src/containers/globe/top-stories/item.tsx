import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

import { TopStory } from '@/types/generated/strapi.schemas';

type TopStoriesItemProps = {
  topStory?: TopStory;
};

const TopStoriesItem = ({ topStory }: TopStoriesItemProps) => {
  const storyData = topStory?.story?.data;

  const src = getImageSrc(topStory?.cover_image?.data?.attributes?.url);

  return (
    <Link
      href={`/stories/${storyData?.id}`}
      className={cn(
        'relative flex gap-2 px-4 py-2 hover:bg-white/10',
        storyData?.attributes?.active && 'cursor-pointer'
      )}
    >
      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full">
        <Image
          alt={storyData?.attributes?.title || 'story cover image'}
          src={src}
          width={72}
          height={72}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="space-y-1 text-gray-300">
        <h3 className="line-clamp-3 text-sm font-bold leading-4 text-gray-300">
          {storyData?.attributes?.title}
        </h3>
        <p className="font-open-sans text-xs font-light italic">{topStory?.location}</p>
      </div>
    </Link>
  );
};

export default TopStoriesItem;
