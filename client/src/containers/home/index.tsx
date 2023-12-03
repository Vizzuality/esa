'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { layersAtom, tmpBboxAtom } from '@/store';

import { stepAtom } from '@/store/stories';

import { DEFAULT_MAP_BBOX, DEFAULT_MAP_STATE } from '@/constants/map';

import Sidebar from '@/containers/home/sidebar';

import Card from '@/components/ui/card';
// import GradientLine from '@/components/ui/gradient-line';

import Categories from './categories';
import Dashboard from './dashboard';
import { Filters } from './filters';
import Header from './header';
// import TopStories from './top-stories';

export default function Home() {
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);
  const resetLayers = useResetRecoilState(layersAtom);
  const resetStep = useResetRecoilState(stepAtom);

  useEffect(() => {
    const tmpbbox: [number, number, number, number] = DEFAULT_MAP_BBOX;
    setTmpBbox({ bbox: tmpbbox, options: DEFAULT_MAP_STATE });
  }, [setTmpBbox]);

  useEffect(() => {
    resetLayers();
    resetStep();
  }, []);

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
              <Link href="#">View links</Link>
            </Card>
            {/* <GradientLine />
            <Card title="Top stories (6)">
              <TopStories />
            </Card> */}
          </div>
        </Sidebar>
      </div>
      <div className="z-10">
        <Categories />
      </div>
    </div>
  );
}
