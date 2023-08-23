import { Suspense } from 'react';

import Home from '@/containers/home';

export default async function HomePage() {
  return (
    <Suspense fallback={<div>FALLBACK</div>}>
      <Home />
    </Suspense>
  );
}
