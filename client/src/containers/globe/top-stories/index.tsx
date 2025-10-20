// import { ChevronDownIcon } from 'lucide-react';

import { useGetTopStories } from '@/types/generated/top-story';

import TopStoriesItem from './item';

const TopStories = () => {
  const { data: topStories } = useGetTopStories({
    'pagination[limit]': 10,
    populate: 'story,cover_image',
    sort: 'index:asc',
  });

  return (
    <div>
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
