import TopStoriesItem from './item';
import topStories from './mockup.json';

const TopStories = () => {
  return (
    <div className="max-h-[35vh] space-y-4 overflow-y-auto">
      {topStories.map((story) => (
        <TopStoriesItem key={story.id} story={story} />
      ))}
    </div>
  );
};

export default TopStories;
