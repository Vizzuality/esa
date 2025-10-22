import Providers from '@/app/(landing)/layout-providers';

import Banners from '@/containers/banners';
import Map from '@/containers/map';

// Activate banner when experiende production issues that can't be solved quickly
// import WarningBanner from '@/components/warning-banner';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {/* <WarningBanner /> */}
      <Banners />
      <Map />

      {children}
    </Providers>
  );
}
