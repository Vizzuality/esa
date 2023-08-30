'use client';

import { PropsWithChildren } from 'react';

import { RecoilRoot } from 'recoil';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <RecoilRoot>{children}</RecoilRoot>
    </>
  );
}
