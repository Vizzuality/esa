import TopStoriesItem from './item';

const topStories = [
  {
    id: '1',
    title: 'From Coastlines to Space: EO Satellites for Advanced Risk Assessment ',
    place: 'Warri',
    country: 'Nigeria',
    image: '/images/story-card-image.png',
  },
  {
    id: '2',
    title: 'From Coastlines to Space: EO Satellites for Advanced Risk Assessment ',
    place: 'Warri',
    country: 'Nigeria',
    image: '/images/story-card-image.png',
  },
  {
    id: '3',
    title: 'From Coastlines to Space: EO Satellites for¡ Advanced Risk Assessment ',
    place: 'Warri',
    country: 'Nigeria',
    image: '/images/story-card-image.png',
  },
  {
    id: '4',
    title: 'From Coastlines to Space: EO Satellites for Advanced Risk Assessment ',
    place: 'Warri',
    country: 'Nigeria',
    image: '/images/story-card-image.png',
  },
  {
    id: '5',
    title: 'From Coastlines to Space: EO Satellites for¡ Advanced Risk Assessment ',
    place: 'Warri',
    country: 'Nigeria',
    image: '/images/story-card-image.png',
  },
  {
    id: '6',
    title: 'From Coastlines to Space: EO Satellites for Advanced Risk Assessment ',
    place: 'Warri',
    country: 'Nigeria',
    image: '/images/story-card-image.png',
  },
];

const TopStories = () => {
  return (
    <div className="max-h-[45vh] space-y-4 overflow-y-auto">
      {topStories.map((story) => (
        <TopStoriesItem key={story.id} story={story} />
      ))}
    </div>
  );
};

export default TopStories;
