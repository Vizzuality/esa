'use client';

import { useEffect } from 'react';

import { useMap } from 'react-map-gl';

import { useSetAtom } from 'jotai';
import { ExternalLinkIcon } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

import { cn } from '@/lib/classnames';

import { useSyncFilters } from '@/store/globe';
import { layersAtom, tmpBboxAtom } from '@/store/map';
import { useSyncStep } from '@/store/stories';

import useStories from '@/hooks/stories/useStories';

import { DEFAULT_VIEW_STATE } from '@/components/map/constants';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import GradientLine from '@/components/ui/gradient-line';

import Header from '../header';

import Categories from './categories';
import Dashboard from './dashboard';
import Filters from './filters';
import SearchStories from './search';
import TopStories from './top-stories';

type StoryMarker = {
  markers: {
    lat: number;
    lng: number;
  }[];
};

export default function Home() {
  const setTmpBbox = useSetAtom(tmpBboxAtom);
  const setLayers = useSetAtom(layersAtom);
  const [filters, setFilters] = useSyncFilters();
  const { removeStep } = useSyncStep();

  const { data: storiesData } = useStories();
  const storiesLength = storiesData?.data?.length;
  const { default: map } = useMap();

  useEffect(() => {
    const bounds = new mapboxgl.LngLatBounds();
    storiesData?.data?.forEach(({ attributes }) => {
      if (!(attributes?.marker as StoryMarker)?.markers?.length) return;
      const { lat, lng } = (attributes?.marker as StoryMarker)?.markers?.[0] || {};
      if (typeof lat != 'number' || typeof lng != 'number') return;
      bounds.extend([lng, lat]);
    });
    if (bounds.isEmpty() || !map) return;
    const center = bounds.getCenter();

    setTmpBbox({
      bbox: bounds.toArray().flat() as [number, number, number, number],
      options: { ...DEFAULT_VIEW_STATE, latitude: center.lat, longitude: center.lng },
    });
  }, [map, setTmpBbox, storiesData?.data]);

  useEffect(() => {
    setLayers([]);
    removeStep();
  }, []);

  const handleClearFilters = () => {
    setFilters({ ifis: null, tags: null, status: null });
  };

  const filtersActive = Object.values(filters).some((filter) => !!filter?.length);

  return (
    <div className="home text-primary flex h-screen w-screen flex-col justify-between overflow-y-hidden px-12">
      <Header />
      <div className="flex max-h-full flex-1 justify-between overflow-hidden pb-6 pt-12">
        <div className="flex h-full max-h-full w-[280px] flex-col space-y-6 2xl:w-80">
          <div className="z-50 space-y-1">
            <div className="flex gap-2">
              <SearchStories />
              <Filters filtersActive={filtersActive} />
            </div>
            <div className="font-open-sans flex justify-between text-sm font-semibold">
              <p className="pl-1 text-gray-800">{!!storiesLength && `${storiesLength} stories`}</p>
              <Button
                variant="link"
                className={cn(
                  'h-fit py-0 pl-0 pr-1 font-semibold transition-opacity duration-300',
                  !filtersActive && 'pointer-events-none opacity-0'
                )}
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
            </div>
          </div>
          <div className="max-h-[calc(100%-88px)]">
            <Dashboard />
          </div>
        </div>
        <div className="flex h-full w-[280px] flex-col 2xl:w-80">
          <div className="flex max-h-[calc(100%-100px)] flex-col justify-between">
            <Card title="Top stories" className="max-h-[calc(100%-33px)]">
              <TopStories />
            </Card>
            <GradientLine />
          </div>
          <div className="h-fit">
            <Card title="Programme Dashboard">
              <a
                target="_blank"
                className="font-open-sans flex justify-between gap-4 px-4 text-sm leading-snug"
                href="https://lookerstudio.google.com/reporting/b6d8f54c-558e-48dc-bc79-a7eca193da6f/page/p_2ehvdzg47c"
              >
                Detailed report dashboard on ESA GDA programme.
                <ExternalLinkIcon className="h-4 w-4 shrink-0" />
              </a>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex-0 z-10 h-fit">
        <Categories />
      </div>
    </div>
  );
}
