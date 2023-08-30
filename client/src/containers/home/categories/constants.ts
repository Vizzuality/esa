export const defaultCategories = {
  data: [...Array(11).keys()].map((i) => ({
    id: i,
    attributes: {
      name: 'Placeholder Category',
      slug: 'placeholder-category',
    },
  })),
};
