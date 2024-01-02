'use client';

import { PropsWithChildren } from 'react';

import { cn } from '@/lib/classnames';

import { Skeleton } from '@/components/ui/skeleton';

export interface ContentLoaderProps extends PropsWithChildren {
  skeletonClassName?: string;
  data: unknown | undefined;
  isPlaceholderData: boolean;
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
  errorMessage?: string;
  className?: string;
  SkeletonComponent?: JSX.Element;
}

const ContentLoader = ({
  SkeletonComponent,
  children,
  data,
  isPlaceholderData,
  isFetching,
  isFetched,
  isError,
  errorMessage,
  className,
}: ContentLoaderProps) => {
  return (
    <>
      {isFetching && !isFetched && !SkeletonComponent && <Skeleton className={cn('h-20 w-full')} />}
      {isFetching && !isFetched && SkeletonComponent}
      {/* <Loading
        className="absolute z-10 flex h-full w-full items-center justify-center bg-white/50 py-2"
        iconClassName="w-5 h-5"
        visible={isFetching && !isPlaceholderData}
      /> */}

      {isError && isFetched && !isFetching && (errorMessage || 'Error')}

      {!isPlaceholderData && !isError && isFetched && !!data && children}

      {!isPlaceholderData && !isError && isFetched && !data && 'No data'}
    </>
  );
};

export default ContentLoader;
