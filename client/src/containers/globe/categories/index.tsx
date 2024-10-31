import { cn } from '@/lib/classnames';

import { useGetCategories } from '@/types/generated/category';

import ContentLoader from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';

import Category from './item';

type CategoriesProps = {
  className?: string;
};
const Categories = ({ className }: CategoriesProps) => {
  const { data, isError, isPlaceholderData, isFetched, isFetching } = useGetCategories();

  const categories = data?.data;

  return (
    <div className={cn('pointer-events-none w-full', className)}>
      <ContentLoader
        isPlaceholderData={isPlaceholderData}
        data={data}
        isError={isError}
        isFetched={isFetched}
        isFetching={isFetching}
        errorMessage="Error loading the categories"
        className="mx-auto mb-8 h-10 w-full max-w-3xl text-center"
        SkeletonComponent={
          <div className="mb-8 flex w-full items-center justify-center gap-8">
            {[...Array(11)].map((_, i) => (
              <Skeleton key={i} className="bg-background h-10 w-10 rounded-full" />
            ))}
          </div>
        }
      >
        <div className="mx-auto mb-8 mt-4 w-full max-w-3xl">
          <div className="flex w-full gap-8 xl:flex-col xl:items-center xl:gap-4">
            <div className="w-min xl:w-fit">
              <p className="font-notes text-center text-sm font-bold leading-4 text-gray-500">
                Select category
              </p>
            </div>
            <div className="flex gap-6">
              {categories?.map(({ id, attributes }) => {
                if (attributes?.name && attributes?.slug) {
                  return <Category name={attributes.name} slug={attributes.slug} key={id} />;
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </ContentLoader>
    </div>
  );
};

export default Categories;
