import Story from '@/containers/story';

export default async function StoryPage({
  params,
}: {
  params: {
    storyId: string;
    step: string;
  };
}) {
  return <Story storyId={params.storyId} step={params.step} />;
}
