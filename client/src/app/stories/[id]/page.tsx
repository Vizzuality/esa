import type { Metadata } from 'next';

import { getStories, getStoriesId } from '@/types/generated/story';

import Story from '@/containers/story';

type StoryPageProps = { params: { id: string } };

export async function generateStaticParams() {
  try {
    const { data: storiesData } = await getStories({
      'pagination[limit]': 1000,
    });

    if (!storiesData) {
      throw new Error('Failed to parse storiesData');
    }

    return storiesData.map(
      (s) =>
        ({
          params: {
            id: `${s.id}`,
          },
        } satisfies StoryPageProps)
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  try {
    // read route params
    const { id } = params;

    // fetch data
    const { data: storyData } = await getStoriesId(+id);

    return {
      title: storyData?.attributes?.title,
    };
  } catch (e) {
    console.error(e);
    return {
      title: 'Story',
    };
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  console.log(params);

  return <Story />;
}
