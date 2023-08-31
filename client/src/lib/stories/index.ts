import { GetCategoriesParams } from '@/types/generated/strapi.schemas';

export const getStoriesParams = (params?: {
  [key: string]: string | string[] | number | undefined;
}): GetCategoriesParams => {
  return {
    populate: '*',
    'pagination[limit]': 1000,
    filters: {
      ...(params?.category && { category: Number(params?.category) }),
    },
  };
};
