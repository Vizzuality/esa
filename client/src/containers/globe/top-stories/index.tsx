import { useGetTopStories } from '@/types/generated/top-story';

import TopStoriesItem from './item';

const TopStories = () => {
  const { data: topStories } = useGetTopStories({
    'pagination[limit]': 5,
    populate: 'story,cover_image',
    sort: 'index:asc',
  });

  return (
    <div>
      {topStories?.data?.map((topStory) => (
        <TopStoriesItem key={topStory.id} topStory={topStory.attributes} />
      ))}
    </div>
  );
};

export default TopStories;
