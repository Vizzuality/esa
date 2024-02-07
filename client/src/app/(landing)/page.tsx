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
    const { queryKey: categoriesQueryKey, queryFn: categoriesQueryFn } =
      getGetCategoriesQueryOptions();

    await queryClient.prefetchQuery({
      queryKey: categoriesQueryKey,
      queryFn: categoriesQueryFn,
    });

    // Stories
    let categoryId;

    // If there is a category in the search params, we need to get the category id to use as a category filter
    if (searchParams.category) {
      const categories = queryClient.getQueryData<CategoryListResponse>(categoriesQueryKey);

      categoryId = categories?.data?.find((category) => {
        return `"${category.attributes?.slug}"` === searchParams.category;
      })?.id;
    }

    const params = getStoriesParams(categoryId ? { category: categoryId } : {});

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
