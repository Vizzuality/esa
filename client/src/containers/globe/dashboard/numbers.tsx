'use client';

import { useDashboard, DashboardProps } from '@/hooks/dashboard';

import ContentLoader from '@/components/ui/loader';

type DashboardStat = {
  [slug in keyof Pick<
    DashboardProps,
    'supportedCountries' | 'caseStudiesInProgress' | 'totalIFIs'
  >]: number;
};

type DashboardNumberPattern = {
  stat: string;

  slug: keyof DashboardStat;
};

const DashboardNumbersPattern: DashboardNumberPattern[] = [
  {
    stat: 'Supported countries',
    slug: 'supportedCountries',
  },
  {
    stat: 'Case Studies in progress',
    slug: 'caseStudiesInProgress',
  },
  {
    stat: 'IFI projects',
    slug: 'totalIFIs',
  },
];

const DashboardNumbers = () => {
  const { data, isFetched, isError, isFetching } = useDashboard<DashboardStat>({
    select: (data) => ({
      supportedCountries: data.supportedCountries,
      caseStudiesInProgress: data.caseStudiesInProgress,
      totalIFIs: data.totalIFIs,
    }),
  });

  return (
    <div className="flex gap-x-1 px-4">
      {DashboardNumbersPattern?.map(({ stat, slug }) => (
        <div key={stat} className="flex-1 space-y-1 text-center text-xs">
          {!isFetching ? (
            <p className="text-4xl font-bold">{data?.[slug]}</p>
          ) : (
            <ContentLoader
              skeletonClassName="h-2"
              data={data?.[slug]}
              isFetching={isFetching}
              isFetched={isFetched}
              isPlaceholderData={false}
              isError={isError}
            />
          )}
          <p className="font-open-sans font-semibold text-gray-400">{stat}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardNumbers;
