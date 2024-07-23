import { GetCategoriesParams } from '@/types/generated/strapi.schemas';

export const getStoriesParams = (params?: {
  [key: string]: string | string[] | number | number[] | undefined | null;
}): GetCategoriesParams => {
  const { category, title, ...rest } = params || {};

  return {
    populate: '*',
    'pagination[limit]': 1000,
    filters: {
      ...(category && { category: Number(category) }),
      ...(title && { title: { $containsi: title } }),
      ...rest,
    },
  };
};
