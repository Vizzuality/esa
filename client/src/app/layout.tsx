import '@/styles/globals.css';
import '@/styles/mapbox.css';

import Providers from '@/app/layout-providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className="font-notes min-h-screen w-screen">
          <main>{children}</main>
        </body>
      </html>
    </Providers>
  );
}
