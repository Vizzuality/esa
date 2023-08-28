import { useGetCategories } from '@/types/generated/category';

import categories from '@/constants/categories';

import Category from './item';

const Categories = () => {
  const { data } = useGetCategories();
  console.info(data);

  return (
    <div className="3xl:mb-4 mb-14 mt-4 flex max-w-3xl gap-8">
      <div className="w-12">
        <p className="text-center text-sm leading-4">Select category</p>
      </div>
      <div className="space-x-6">
        {categories.map(({ name, id, icon }) => (
          <Category name={name} id={id} Icon={icon} key={id} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
