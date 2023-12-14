import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/classnames';

type TopStoriesItemProps = {
  story: {
    title: string;
    region: string;
    id: string;
    image: string;
    active: boolean;
  };
};

const TopStoriesItem = ({ story }: TopStoriesItemProps) => {
  const { push } = useRouter();

  const handleClickStory = () => {
    if (story.active) {
      push(`/stories/${story.id}`);
    }
  };

  return (
    <div onClick={handleClickStory} className={cn('flex gap-2', story.active && 'cursor-pointer')}>
      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full">
        <Image
          alt={story.title}
          src={story.image}
          width={72}
          height={72}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="space-y-1 text-gray-300">
        <h3 className="text-sm font-bold leading-4 text-gray-300">{story.title}</h3>
        <p className="font-open-sans text-xs font-light italic">{story.region}</p>
      </div>
    </div>
  );
};

export default TopStoriesItem;
