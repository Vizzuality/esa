import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export type DashboardProps = {
  supportedCountries: number;
  caseStudiesInProgress: number;
  caseStudiesCompleted: number;
  totalIFIs: number;
  allCountries: string[];
};

type DashboardQueryKey = ['dashboard-data'];

export function useDashboard<TSelected = DashboardProps>(
  options?: Omit<
    UseQueryOptions<DashboardProps, Error, TSelected, DashboardQueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TSelected, Error> {
  const fetchDashboard = async (): Promise<DashboardProps> => {
    const res = await fetch('/api/dashboard');

    if (!res.ok) {
      throw new Error(`Dashboard API error: ${res.status}`);
    }

    return res.json();
  };

  return useQuery<DashboardProps, Error, TSelected, DashboardQueryKey>({
    queryKey: ['dashboard-data'],

    queryFn: fetchDashboard,

    ...options,
  });
}
