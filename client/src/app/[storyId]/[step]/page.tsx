import Hydrate from '@/lib/react-query/hydrate';

import { prefetchQueries } from '@/app/prefetch';

import Story from '@/containers/story';

export default async function StoryPage({
  params,
}: {
  params: {
    storyId: string;
    step: string;
  };
}) {
  const dehydratedState = await prefetchQueries();

  return (
    <Hydrate state={dehydratedState}>
      <Story storyId={params.storyId} step={params.step} />
    </Hydrate>
  );
}
