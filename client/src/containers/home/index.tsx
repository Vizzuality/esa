'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { useSetRecoilState } from 'recoil';

import { tmpBboxAtom } from '@/store';

import Datasets from '@/containers/home/datasets';
import Sidebar from '@/containers/home/sidebar';

export default async function Home() {
  const bbox: [number, number, number, number] = [-50.45, -66.05, 107.79, 85.05];
  const setBbox = useSetRecoilState(tmpBboxAtom);

  useEffect(() => {
    setBbox(bbox);
  }, [setBbox]);

  return (
    <>
      <main className="w absolute left-0 top-0 flex h-screen flex-col">
        <div>
          <Sidebar>
            <Link href="/links">Links</Link>
            <Link href="/story1/1">Story 1</Link>
            <Datasets />
          </Sidebar>
        </div>
      </main>
    </>
  );
}
