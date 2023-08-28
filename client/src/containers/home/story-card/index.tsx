import categories from '@/constants/categories';

import { Button } from '@/components/ui/button';

type StoryCardProps = {
  story: {
    title: string;
    category: string;
    place: string;
    country: string;
    id: string;
    image: string;
  };
};

const StoryCard = ({ story }: StoryCardProps) => {
  const category = categories.find(({ id }) => id === story.category);
  return (
    <div className="flex gap-2">
      <div className="shrink-0">
        <div>
          {category?.icon}
          <p>{category?.name}</p>
        </div>
      </div>
      <div className="space-y-1 text-gray-300">
        <h3 className="text-sm font-bold leading-4 text-gray-300">{story.title}</h3>
        <p className="font-open-sans text-xs font-light italic">
          {story.place}, {story.country}
        </p>
      </div>
      <div>
        <Button variant="secondary">Discover story</Button>
      </div>
    </div>
  );
};

export default StoryCard;
