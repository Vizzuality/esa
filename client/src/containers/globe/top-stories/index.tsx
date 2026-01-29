import { useSyncCategory } from '@/store/globe';

import { useGetTopStories } from '@/types/generated/top-story';

import TopStoriesItem from './item';

const TopStories = () => {
  const category = useSyncCategory()[0];
  const { data: topStories } = useGetTopStories({
    // 'pagination[limit]': 10,
    populate: 'cover_image,story,story.category',
    sort: 'index:asc',
    filters: { story: { category: { slug: { $eq: category } } } },
  });

  return (
    <div>
      {topStories?.data?.length === 0 && (
        <p className="mb-4 text-center text-sm italic text-gray-500">No top stories found.</p>
      )}
      {topStories?.data?.map((topStory) => (
        <TopStoriesItem key={topStory.id} topStory={topStory.attributes} />
      ))}

      {/* {window.innerHeight < 1250 && (
        <div className="absolute bottom-0 left-0 right-0 mt-2 flex h-6 items-end justify-center bg-gray-600">
          <div
            className="relative flex h-full w-full items-center justify-center
                        before:pointer-events-none before:absolute before:inset-0
                        before:z-0 before:rounded-none
                        before:bg-gray-900/30 before:backdrop-blur-md before:content-['']"
          >
            <ChevronDownIcon className="relative z-10 h-6 w-6 stroke-2 text-white" />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TopStories;
