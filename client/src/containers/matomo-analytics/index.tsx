'use client';

import { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { trackAppRouter } from '@socialgouv/matomo-next';

import { env } from '@/env.mjs';

// https://github.com/SocialGouv/matomo-next

const MATOMO_URL = env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = env.NEXT_PUBLIC_MATOMO_SITE_ID;

export function MatomoAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.info('Matomo env (staging check):', { MATOMO_URL, MATOMO_SITE_ID });
    if (!MATOMO_URL || !MATOMO_SITE_ID) {
      return;
    }
    const urlSearchParams = searchParams
      ? new URLSearchParams(Array.from(searchParams.entries()))
      : new URLSearchParams();

    trackAppRouter({
      url: MATOMO_URL!,
      siteId: MATOMO_SITE_ID!,
      pathname,
      searchParams: urlSearchParams,
      onInitialization: () => console.info('Initializing Matomo'),
      onScriptLoadingError: () => console.error('Error loading Matomo script'),
    });
  }, [pathname, searchParams]);
  return null;
}
