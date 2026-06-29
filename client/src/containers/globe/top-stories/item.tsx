import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

import {
  Story,
  StoryListResponseDataItem,
  TopStoryCoverImage,
} from '@/types/generated/strapi.schemas';

// The generated `Story` type lacks `cover_image` (Strapi OpenAPI doc is stale);
// it has the same media shape as the top story cover.
type StoryWithCover = Story & { cover_image?: TopStoryCoverImage };

type TopStoriesItemProps = {
  story?: StoryListResponseDataItem;
};

const TopStoriesItem = ({ story }: TopStoriesItemProps) => {
  const attributes = story?.attributes as StoryWithCover | undefined;

  const coverImageUrl = attributes?.cover_image?.data?.attributes?.url;

  if (!coverImageUrl) return null;

  const src = getImageSrc(coverImageUrl);

  return (
    <Link
      href={`/stories/${story?.id}`}
      className={cn(
        'relative flex gap-2 px-4 py-2 hover:bg-white/10',
        attributes?.active && 'cursor-pointer'
      )}
    >
      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full">
        <Image
          alt={attributes?.title || 'story cover image'}
          src={src}
          width={72}
          height={72}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="space-y-1 text-gray-300">
        <h3 className="line-clamp-3 text-sm font-bold leading-4 text-gray-300">
          {attributes?.title}
        </h3>
        <p className="font-open-sans text-xs font-light italic">{attributes?.location}</p>
      </div>
    </Link>
  );
};

export default TopStoriesItem;
