import { NextResponse } from 'next/server';

import type { DashboardProps } from '@/hooks/dashboard';

export const runtime = 'nodejs';

// Hardcoded values served when the upstream master-data call fails, so the
// dashboard panel always renders numbers instead of going blank.
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
      headers: { 'x-functions-key': key },
      // Azure Function cold starts can exceed 10s; stay under the 60s proxy limit.
      signal: AbortSignal.timeout(30_000),
    });

    if (res.ok) {
      return NextResponse.json(await res.json());
    }

    console.error('Dashboard upstream returned', res.status);
    return NextResponse.json(FALLBACK_DASHBOARD);
  } catch (error: unknown) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(FALLBACK_DASHBOARD);
  }
}
