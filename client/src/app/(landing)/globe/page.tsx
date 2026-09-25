import { dehydrate } from '@tanstack/react-query';

import getQueryClient from '@/lib/react-query';
import Hydrate from '@/lib/react-query/hydrate';
import { getStoriesParams } from '@/lib/stories';

import { getGetCategoriesQueryOptions } from '@/types/generated/category';
import { getGetStoriesQueryOptions } from '@/types/generated/story';
import { CategoryListResponse } from '@/types/generated/strapi.schemas';
// NOTE: top-story prefetch is disabled for now — the globe side panel renders
// regular stories (see containers/globe/top-stories). We no longer distinguish
// between featured/top stories and stories. The top-story entity/API is kept
// in place so this can be re-enabled later.
// import { getGetTopStoriesQueryOptions } from '@/types/generated/top-story';

import Globe from '@/containers/globe';

export const metadata = {
  title: 'Impact sphere',
  description: 'Impact sphere',
};

type HomePageProps = {
  searchParams: {
    [key: string]: string | string[];
  };
};

async function prefetchQueries(searchParams: HomePageProps['searchParams']) {
  const queryClient = getQueryClient();
  try {
    // Categories
    const { queryKey: categoriesQueryKey, queryFn: categoriesQueryFn } =
      getGetCategoriesQueryOptions({
        sort: 'id:asc',
        populate: 'stories',
      });

    await queryClient.prefetchQuery({
      queryKey: categoriesQueryKey,
      queryFn: categoriesQueryFn,
    });

    // Stories
    let categoryId: string | undefined;

    // If there is a category in the search params, we need to get the category id to use as a category filter
    if (searchParams.category) {
      const categories = queryClient.getQueryData<CategoryListResponse>(categoriesQueryKey);

      categoryId = categories?.data?.find((category) => {
        return `${category.attributes?.slug}` === searchParams.category;
      })?.attributes?.slug;
    }

    const params = getStoriesParams(categoryId ? { category: categoryId } : {});

    const { queryKey: storiesQueryKey, queryFn: storiesQueryFn } =
      getGetStoriesQueryOptions(params);

    await queryClient.prefetchQuery({
      queryKey: storiesQueryKey,
      queryFn: storiesQueryFn,
    });

    // Top stories prefetch disabled — see note on the import above. The panel
    // now uses the regular stories prefetched above (no featured/top distinction).
    // const { queryKey: topStoriesQueryKey, queryFn: topStoriesQueryFn } =
    //   getGetTopStoriesQueryOptions({
    //     'pagination[limit]': 5,
    //     populate: 'story,cover_image',
    //     sort: 'index:asc',
    //   });
    //
    // await queryClient.prefetchQuery({
    //   queryKey: topStoriesQueryKey,
    //   queryFn: topStoriesQueryFn,
    // });

    return dehydrate(queryClient);
  } catch (error) {
    console.info(error);
    return null;
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const dehydratedState = await prefetchQueries(searchParams);

  return (
    <Hydrate state={dehydratedState}>
      <Globe />
    </Hydrate>
  );
}
