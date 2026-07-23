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

    // The route can 404 outright when the basePath/proxy is misconfigured, so
    // the server-side fallback never runs. Serve the shared hardcoded values
    // here too, so the dashboard renders numbers instead of going blank.
    if (!res.ok) {
      return DASHBOARD_FALLBACK;
    }

    try {
      return await res.json();
    } catch {
      return DASHBOARD_FALLBACK;
    }
  };

  return useQuery<DashboardProps, Error, TSelected, DashboardQueryKey>({
    queryKey: ['dashboard-data'],

    queryFn: fetchDashboard,

    ...options,
  });
}
