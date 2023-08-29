import { dehydrate } from '@tanstack/query-core';
import type { Metadata } from 'next';

import getQueryClient from '@/lib/react-query';
import Hydrate from '@/lib/react-query/hydrate';

import { getGetStoriesIdQueryOptions, getStoriesId } from '@/types/generated/story';

import Story from '@/containers/story';

type StoryPageProps = { params: { id: string } };

// export async function generateStaticParams() {
//   try {
//     const { data: storiesData } = await getStories({
//       'pagination[limit]': 200,
//     });

//     if (!storiesData) {
//       throw new Error('Failed to parse storiesData');
//     }

//     console.log('storiesData', storiesData);

//     return storiesData.map((s) => ({
//       id: `${s.id}`,
//     }));
//   } catch (e) {
//     console.error(e);
//     return [];
//   }
// }

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

async function prefetchQueries(params: StoryPageProps['params']) {
  // Prefetch datasets
  const queryClient = getQueryClient();
  const { queryKey, queryFn } = getGetStoriesIdQueryOptions(+params.id);

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
  return dehydrate(queryClient);
}

export default async function StoryPage({ params }: StoryPageProps) {
  const dehydratedState = await prefetchQueries(params);

  return (
    <Hydrate state={dehydratedState}>
      <Story />
    </Hydrate>
  );
}
