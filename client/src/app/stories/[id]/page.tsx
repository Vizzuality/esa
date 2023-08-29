import { getStories } from '@/types/generated/story';

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

export default async function StoryPage({ params }: StoryPageProps) {
  console.log(params);

  return <Story />;
}
