import '@/styles/globals.css';
import '@/styles/mapbox.css';

import Providers from '@/app/(static)/layout-providers';

export default function StaticLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
