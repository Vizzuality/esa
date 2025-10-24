import '@/styles/globals.css';
import '@/styles/mapbox.css';

import { Suspense } from 'react';

import Providers from '@/app/layout-providers';

import { MatomoAnalytics } from '@/containers/matomo-analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className="font-notes min-h-screen  overflow-x-hidden">
          <main>{children}</main>
          <Suspense fallback={null}>
            <MatomoAnalytics />
          </Suspense>
        </body>
      </html>
    </Providers>
  );
}
