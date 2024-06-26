'use client';

import { useEffect } from 'react';

import { useSetAtom } from 'jotai';

import { layersAtom, tmpBboxAtom } from '@/store/map';
import { useSyncStep } from '@/store/stories';

import { DEFAULT_MAP_BBOX, DEFAULT_MAP_STATE } from '@/constants/map';

import Sidebar from '@/containers/home/sidebar';

import Card from '@/components/ui/card';
import GradientLine from '@/components/ui/gradient-line';

import Categories from './categories';
import Dashboard from './dashboard';
import { Filters } from './filters';
import Header from './header';
import TopStories from './top-stories';

export default function Home() {
  const setTmpBbox = useSetAtom(tmpBboxAtom);
  const setLayers = useSetAtom(layersAtom);
  const { removeStep } = useSyncStep();

  useEffect(() => {
    const tmpbbox: [number, number, number, number] = DEFAULT_MAP_BBOX;
    setTmpBbox({ bbox: tmpbbox, options: DEFAULT_MAP_STATE });
  }, [setTmpBbox]);

  useEffect(() => {
    setLayers([]);
    removeStep();
  }, []);

  return (
    <div className="home text-primary flex h-screen w-screen flex-col justify-between px-12">
      <Header />
      <Filters />
      <div className="mt-12 flex flex-1 justify-between">
        <Sidebar>
          <div className="2xl:w-70 w-[280px]">
            <Dashboard />
          </div>
        </Sidebar>
        <Sidebar>
          <div className="2xl:w-70 w-[280px]">
            <Card title="Impact indicator">
              <a
                target="_blank"
                href="https://lookerstudio.google.com/reporting/b6d8f54c-558e-48dc-bc79-a7eca193da6f/page/p_2ehvdzg47c"
              >
                View links
              </a>
            </Card>
            <GradientLine />
            <Card title="Top stories">
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
