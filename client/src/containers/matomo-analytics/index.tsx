'use client';

import { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { trackAppRouter } from '@socialgouv/matomo-next';
// https://github.com/SocialGouv/matomo-next

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

export function MatomoAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!MATOMO_URL || !MATOMO_SITE_ID) {
      return;
    }

    const urlSearchParams = searchParams
      ? new URLSearchParams(Array.from(searchParams.entries()))
      : new URLSearchParams();

    trackAppRouter({
      url: MATOMO_URL,
      siteId: MATOMO_SITE_ID,
      pathname,
      searchParams: urlSearchParams,
      enableHeatmapSessionRecording: true,
      enableHeartBeatTimer: true,
    });
  }, [pathname, searchParams]);
  return null;
}
