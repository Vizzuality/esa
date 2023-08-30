import { dehydrate } from '@tanstack/react-query';

import getQueryClient from '@/lib/react-query';
import Hydrate from '@/lib/react-query/hydrate';

import { getGetCategoriesQueryOptions } from '@/types/generated/category';

import Home from '@/containers/home';

export const metadata = {
  title: 'Impact sphere',
  description: 'Impact sphere',
};

async function prefetchQueries() {
  const queryClient = getQueryClient();
  try {
    const { queryKey, queryFn } = getGetCategoriesQueryOptions();

    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });

    return dehydrate(queryClient);
  } catch (error) {
    console.info(error);
    return null;
  }
}

export default async function HomePage() {
  const dehydratedState = await prefetchQueries();
  return (
    <Hydrate state={dehydratedState}>
      <Home />
    </Hydrate>
  );
}
