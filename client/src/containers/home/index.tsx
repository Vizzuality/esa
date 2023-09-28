'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { useSetRecoilState } from 'recoil';

import { tmpBboxAtom } from '@/store';

import Sidebar from '@/containers/home/sidebar';

import Card from '@/components/ui/card';
import GradientLine from '@/components/ui/gradient-line';

import Categories from './categories';
import Dashboard from './dashboard';
import { Filters } from './filters';
import Header from './header';
import TopStories from './top-stories';

const HOME_MAP_OPTIONS = {
  longitude: 0,
  latitude: 0,
  zoom: 2.01,
  pitch: 0,
  bearing: 0,
};

export default function Home() {
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);

  useEffect(() => {
    const tmpbbox: [number, number, number, number] = [-50.45, -66.05, 107.79, 85.05];
    setTmpBbox({ bbox: tmpbbox, options: HOME_MAP_OPTIONS });
  }, [setTmpBbox]);

  return (
    <div className="home text-primary flex h-screen w-screen flex-col justify-between px-12">
      <Header />
      <Filters />
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
      <div className="z-10">
        <Categories />
      </div>
    </div>
  );
}
