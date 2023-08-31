import { cn } from '@/lib/classnames';

import { useGetCategories } from '@/types/generated/category';

import ContentLoader from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';

import Category from './item';

const Categories = () => {
  const { data, isError, isSuccess, isPlaceholderData, isFetched, isFetching } = useGetCategories();

  const categories = data?.data;

  return (
    <div className="w-full">
      <ContentLoader
        isPlaceholderData={isPlaceholderData}
        data={data}
        isError={isError}
        isFetched={isFetched}
        isFetching={isFetching}
        errorMessage="Error loading the categories"
        className="3xl:mb-4 mx-auto mb-14 h-10 w-full max-w-3xl text-center"
        SkeletonComponent={
          <div className="flex w-full gap-8">
            {[...Array(11)].map((_, i) => (
              <Skeleton key={i} className="bg-background h-10 w-10 rounded-full" />
            ))}
          </div>
        }
      >
        <div className="3xl:mb-4 mx-auto mb-14 mt-4 w-full max-w-3xl">
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
