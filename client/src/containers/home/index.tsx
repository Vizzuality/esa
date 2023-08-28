'use client';

import { useEffect } from 'react';

import { useSetRecoilState } from 'recoil';

import { tmpBboxAtom } from '@/store';

import Sidebar from '@/containers/home/sidebar';

import Categories from './categories';
import Dashboard from './dashboard';
import Header from './header';
import ItemsLayout from './item-layout';
import TopStories from './top-stories';

export default function Home() {
  const setBbox = useSetRecoilState(tmpBboxAtom);

  useEffect(() => {
    const bbox: [number, number, number, number] = [-50.45, -66.05, 107.79, 85.05];
    setBbox(bbox);
  }, [setBbox]);

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
            <ItemsLayout title="Impact indicator">IMPACT INDICATOR</ItemsLayout>
            <div className="bg-header-line my-4 h-[1px]"></div>
            <ItemsLayout title="Top stories (6)">
              <TopStories />
            </ItemsLayout>
          </div>
        </Sidebar>
      </div>
      <div className="z-10 mx-auto">
        <Categories />
      </div>
    </div>
  );
}
