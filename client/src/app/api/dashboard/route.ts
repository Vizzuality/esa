import { NextResponse } from 'next/server';

import type { DashboardProps } from '@/hooks/dashboard';

export const runtime = 'nodejs';

// ISR: serve from the data cache and revalidate in the background every 15 min.
export const revalidate = 900;

// Placeholder values served when the upstream master-data function is
// unavailable, so the dashboard panel always renders numbers instead of going
// blank. Swap these for real fallback figures as needed.
const FALLBACK_DASHBOARD: DashboardProps = {
  supportedCountries: 92,
  caseStudiesInProgress: 23,
  caseStudiesCompleted: 115,
  totalIFIs: 133,
};

export async function GET() {
  const baseUrl = process.env.GDA_MASTER_DATA_FUNCTION_BASE_URL;
  const key = process.env.GDA_MASTER_DATA_FUNCTION_KEY;

  if (!baseUrl) {
    return NextResponse.json(
      { error: 'Missing API configuration' },

      { status: 500 }
    );
  }

  if (!key) {
    return NextResponse.json(
      { error: 'Missing KEY configuration' },

      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${baseUrl}/ExcelWebAPI`, {
      headers: {
        'x-functions-key': key,
      },
      // Upstream Azure Function cold starts can exceed 10s; stay well under the
      // 60s ALB/nginx limits.
      signal: AbortSignal.timeout(30_000),
      // Serve from the data cache and revalidate in the background; on
      // revalidation failure Next.js keeps serving the stale payload, so
      // transient upstream outages don't surface as 502s.
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      console.error('Error fetching dashboard data: upstream returned', res.status);
      return NextResponse.json(FALLBACK_DASHBOARD);
    }

    return NextResponse.json(await res.json());
  } catch (error: unknown) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(FALLBACK_DASHBOARD);
  }
}
