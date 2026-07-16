import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { env } from '@/env.mjs';

export type DashboardProps = {
  supportedCountries: number;
  caseStudiesInProgress: number;
  caseStudiesCompleted: number;
  totalIFIs: number;
};

export const DASHBOARD_FALLBACK: DashboardProps = {
  supportedCountries: 92,
  caseStudiesInProgress: 23,
  caseStudiesCompleted: 115,
  totalIFIs: 133,
};

type DashboardQueryKey = ['dashboard-data'];

export function useDashboard<TSelected = DashboardProps>(
  options?: Omit<
    UseQueryOptions<DashboardProps, Error, TSelected, DashboardQueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TSelected, Error> {
  const fetchDashboard = async (): Promise<DashboardProps> => {
    const basePath = (env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
    const res = await fetch(`${basePath}/api/dashboard`);

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
