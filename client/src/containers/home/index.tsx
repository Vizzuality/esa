import Link from 'next/link';

import Datasets from '@/containers/home/datasets';
import Map from '@/containers/home/map';
import Sidebar from '@/containers/home/sidebar';
import SyncStoreHome from '@/containers/home/sync-store';

export default async function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="h-screen w-screen">
          <Map />
          <Sidebar>
            <Link href="/links">Links</Link>
            <Datasets />
          </Sidebar>
        </div>
      </main>

      <SyncStoreHome />
    </>
  );
}
