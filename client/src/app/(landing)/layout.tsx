import Providers from '@/app/(landing)/layout-providers';

import Banners from '@/containers/banners';
import Map from '@/containers/map';

import WarningBanner from '@/components/warning-banner';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <WarningBanner />
      <Banners />
      <Map />

      {children}
    </Providers>
  );
}
