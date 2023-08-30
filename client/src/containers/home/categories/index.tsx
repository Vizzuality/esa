import { cn } from '@/lib/classnames';

import { useGetCategories } from '@/types/generated/category';

import { defaultCategories } from './constants';
import Category from './item';

const Categories = () => {
  const { data, isError, isSuccess } = useGetCategories();

  const categories = data?.data || defaultCategories.data;

  return (
    <div className="3xl:mb-4 mb-14 mt-4 w-full max-w-3xl">
      {isError ? (
        <p>Error loading the categories</p>
      ) : (
        <div className="flex w-full gap-8">
          <div className="w-12">
            <p
              className={cn(
                'text-center text-sm leading-4',
                isSuccess ? 'text-primary' : 'text-gray-500'
              )}
            >
              Select category
            </p>
          </div>
          <div className="flex gap-6">
            {categories?.map(({ id, attributes }) => {
              const { name, slug } = attributes || defaultCategories.data[0].attributes;
              return <Category name={name} slug={slug} key={id} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
