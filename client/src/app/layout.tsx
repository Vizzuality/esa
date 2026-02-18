import '@/styles/globals.css';
import '@/styles/mapbox.css';

import { Suspense } from 'react';

import Providers from '@/app/layout-providers';

import { MatomoAnalytics } from '@/containers/matomo-analytics';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <Suspense fallback={null}>
          <body className="font-notes min-h-screen  overflow-x-hidden">
            <main>{children}</main>
            <MatomoAnalytics />
          </body>
        </Suspense>
      </html>
    </Providers>
  );
}
