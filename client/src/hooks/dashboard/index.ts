import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

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
    const res = await fetch('/api/dashboard', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
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
