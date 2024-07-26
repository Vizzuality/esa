import { getStoriesParams } from '@/lib/stories';

import { useSyncCategory, useSyncSearch, useSyncFilters } from '@/store/globe';

import { useGetStories } from '@/types/generated/story';

const useStories = () => {
  const [category] = useSyncCategory();
  const [search] = useSyncSearch();
  const [filters] = useSyncFilters();

  const params = getStoriesParams({ category, title: search, ...filters });
  return useGetStories(params);
};

export default useStories;
