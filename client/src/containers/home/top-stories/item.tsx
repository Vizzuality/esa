import Image from 'next/image';

type TopStoriesItemProps = {
  story: {
    title: string;
    place: string;
    country: string;
    id: string;
    image: string;
  };
};

const TopStoriesItem = ({ story }: TopStoriesItemProps) => {
  return (
    <div className="flex gap-2">
      <div className="shrink-0">
        <Image alt={story.title} src="/images/story-card-image.png" width={72} height={72} />
      </div>
      <div className="space-y-1 text-gray-300">
        <h3 className="text-sm font-bold leading-4 text-gray-300">{story.title}</h3>
        <p className="font-open-sans text-xs font-light italic">
          {story.place}, {story.country}
        </p>
      </div>
    </div>
  );
};

export default TopStoriesItem;
