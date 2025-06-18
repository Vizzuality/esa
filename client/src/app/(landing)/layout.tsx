import Providers from '@/app/(landing)/layout-providers';

import Banners from '@/containers/banners';
import Map from '@/containers/map';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Banners />
      <Map />

      {children}
    </Providers>
  );
}
