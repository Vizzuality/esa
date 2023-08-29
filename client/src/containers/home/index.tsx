'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { bboxAtom, tmpBboxAtom } from '@/store';

import Sidebar from '@/containers/home/sidebar';

import Card from '@/components/ui/card';
import GradientLine from '@/components/ui/gradient-line';

import Categories from './categories';
import Dashboard from './dashboard';
import Header from './header';
import TopStories from './top-stories';

export default function Home() {
  const bbox = useRecoilValue(bboxAtom);
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);

  useEffect(() => {
    if (!bbox) {
      const tmpbbox: [number, number, number, number] = [-50.45, -66.05, 107.79, 85.05];
      setTmpBbox(tmpbbox);
    }
  }, [bbox, setTmpBbox]);

  return (
    <div className="home text-primary flex h-screen w-screen flex-col justify-between px-12">
      <Header />
      <div className="mt-12 flex flex-1 justify-between">
        <Sidebar>
          <div className="2xl:w-70 w-64">
            <Dashboard />
          </div>
        </Sidebar>
        <Sidebar>
          <div className="2xl:w-70 w-64">
            <Card title="Impact indicator">
              <Link href="/links">View links</Link>
            </Card>
            <GradientLine />
            <Card title="Top stories (6)">
              <TopStories />
            </Card>
          </div>
        </Sidebar>
      </div>
      <div className="z-10 mx-auto">
        <Categories />
      </div>
    </div>
  );
}
