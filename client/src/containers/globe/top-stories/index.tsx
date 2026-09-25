import { useSyncCategory } from '@/store/globe';

import { useGetStories } from '@/types/generated/story';

import TopStoriesItem from './item';

const TopStories = () => {
  const category = useSyncCategory()[0];
  const { data: stories } = useGetStories({
    populate: 'cover_image,category',
    sort: 'title:asc',
    filters: {
      active: { $eq: true },
      ...(category ? { category: { slug: { $eq: category } } } : {}),
    },
    'pagination[pageSize]': 1000,
  });

  return (
    <div>
      {stories?.data?.length === 0 && (
        <p className="mb-4 text-center text-sm italic text-gray-500">No stories found.</p>
      )}
      {stories?.data?.map((story) => (
        <TopStoriesItem key={story.id} story={story} />
      ))}
    </div>
  );
};

export default TopStories;
