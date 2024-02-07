import Providers from '@/app/(landing)/layout-providers';

import Map from '@/containers/map';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Map />

      {children}
    </Providers>
  );
}
