import { dehydrate } from '@tanstack/react-query';

import getQueryClient from '@/lib/react-query';
import Hydrate from '@/lib/react-query/hydrate';
import { getStoriesParams } from '@/lib/stories';

import { getGetCategoriesQueryOptions } from '@/types/generated/category';
import { getGetStoriesQueryOptions } from '@/types/generated/story';
import { CategoryListResponse } from '@/types/generated/strapi.schemas';

import Home from '@/containers/home';

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
    const { queryKey: categorieqQueryKey, queryFn: categoriesQueryFn } =
      getGetCategoriesQueryOptions();

    await queryClient.prefetchQuery({
      queryKey: categorieqQueryKey,
      queryFn: categoriesQueryFn,
    });

    // Stories
    const categories = queryClient.getQueryData<CategoryListResponse>(categorieqQueryKey);

    const category = categories?.data?.find((category) => {
      return `"${category.attributes?.slug}"` === searchParams.category;
    })?.id;

    const params = getStoriesParams({ category });

    const { queryKey: storiesQueryKey, queryFn: storiesQueryFn } =
      getGetStoriesQueryOptions(params);

    await queryClient.prefetchQuery({
      queryKey: storiesQueryKey,
      queryFn: storiesQueryFn,
    });

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
      <Home />
    </Hydrate>
  );
}
