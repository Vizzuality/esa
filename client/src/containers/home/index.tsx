'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { useSetRecoilState } from 'recoil';

import { tmpBboxAtom } from '@/store';

import Datasets from '@/containers/home/datasets';
import Sidebar from '@/containers/home/sidebar';

export default function Home() {
  const setBbox = useSetRecoilState(tmpBboxAtom);

  useEffect(() => {
    const bbox: [number, number, number, number] = [-50.45, -66.05, 107.79, 85.05];
    setBbox(bbox);
  }, [setBbox]);

  return (
    <div>
      <Sidebar>
        <Link href="/links">Links</Link>
        <Link href="/stories/story1">Story 1</Link>
        <Datasets />
      </Sidebar>
    </div>
  );
}
