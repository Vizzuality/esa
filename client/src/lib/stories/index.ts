import { GetCategoriesParams } from '@/types/generated/strapi.schemas';

export const getStoriesParams = (params?: {
  category?: string | null;
  title?: string | null;
  ifis?: number[] | null;
  tags?: number[] | null;
  status?: string[] | null;
}): GetCategoriesParams => {
  const { category, title, ifis, tags, status } = params || {};

  return {
    populate: '*',
    'pagination[limit]': 1000,
    filters: {
      ...(category && { category: { slug: category } }),
      ...(ifis && { ifis }),
      ...(tags && { tags }),
      ...(status && { status }),
      ...(title && {
        $or: [
          {
            title: {
              $containsi: title,
            },
          },
          {
            location: {
              $containsi: title,
            },
          },
        ],
      }),
    },
  };
};
