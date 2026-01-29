import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { GDAMasterDataAPI } from '@/services/api';

export type DashboardProps = {
  supportedCountries: number;
  caseStudiesInProgress: number;
  caseStudiesCompleted: number;
  ifiProjects: number;
  allCountries: string[];
};

type DashboardQueryKey = ['dashboard-data'];

export function useDashboard<TSelected = DashboardProps>(
  options?: UseQueryOptions<DashboardProps, Error, TSelected, DashboardQueryKey>
): UseQueryResult<TSelected, Error> {
  const fetchDashboard = async (): Promise<DashboardProps> => {
    const res = await GDAMasterDataAPI.get<DashboardProps>('');
    return res.data;
  };

  return useQuery<DashboardProps, Error, TSelected, DashboardQueryKey>({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboard,
    ...options,
  });
}
