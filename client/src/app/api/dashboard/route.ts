import { NextResponse } from 'next/server';

import { DASHBOARD_FALLBACK } from '@/hooks/dashboard';

export const runtime = 'nodejs';

type FallbackReason = 'upstream-status' | 'timeout' | 'network' | 'invalid-json';

/**
 * Serve the placeholder figures, but say why in response headers so the
 * failure class can be diagnosed from the public endpoint alone (ESA prod is
 * hosted outside our pipeline and we have no access to its server logs).
 * Header values carry only an HTTP status, a Node error code or an error name;
 * never the upstream URL, host or key.
 */
function fallbackResponse(reason: FallbackReason, detail?: string) {
  const headers: Record<string, string> = {
    'x-dashboard-source': 'fallback',
    'x-dashboard-reason': reason,
    // Never let an intermediary (e.g. Cloudflare in front of ESA prod) pin the
    // placeholder payload.
    'Cache-Control': 'no-store',
  };

  if (detail) {
    headers['x-dashboard-detail'] = detail;
  }

  return NextResponse.json(DASHBOARD_FALLBACK, { headers });
}

function errorDetail(error: unknown): { reason: FallbackReason; detail: string } {
  if (!(error instanceof Error)) {
    return { reason: 'network', detail: 'unknown' };
  }

  if (error.name === 'TimeoutError' || error.name === 'AbortError') {
    return { reason: 'timeout', detail: error.name };
  }

  // undici wraps network failures as `TypeError: fetch failed` with the real
  // reason (ENOTFOUND, ECONNREFUSED, CERT errors, UND_ERR_*) on `cause.code`.
  const cause = error.cause as { code?: unknown } | undefined;
  const code = cause?.code ?? (error as { code?: unknown }).code;

  return { reason: 'network', detail: typeof code === 'string' ? code : error.name };
}

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

  // Hostname only: lets whoever reads the server logs confirm the configured
  // upstream without printing the key or full URL.
  let upstreamHost = 'invalid-url';
  try {
    upstreamHost = new URL(baseUrl).host;
  } catch {
    // Keep the placeholder; the fetch below will surface the real error.
  }

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/ExcelWebAPI`, {
      headers: { 'x-functions-key': key },
      // Azure Function cold starts can exceed 10s; stay under the 60s proxy limit.
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error: unknown) {
    const { reason, detail } = errorDetail(error);
    console.error(
      `Dashboard upstream fetch failed (host=${upstreamHost}, reason=${reason}, detail=${detail}):`,
      error
    );
    return fallbackResponse(reason, detail);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(
      `Dashboard upstream returned ${res.status} ${res.statusText} (host=${upstreamHost}):`,
      body.slice(0, 200)
    );
    return fallbackResponse('upstream-status', String(res.status));
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch (error: unknown) {
    console.error(`Dashboard upstream returned non-JSON body (host=${upstreamHost}):`, error);
    return fallbackResponse('invalid-json');
  }

  return NextResponse.json(data, { headers: { 'x-dashboard-source': 'upstream' } });
}
