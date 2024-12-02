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

import { useIsMobile } from '@/hooks/screen-size';
import useStories from '@/hooks/stories/useStories';

import { DEFAULT_MOBILE_ZOOM, DEFAULT_VIEW_STATE } from '@/components/map/constants';
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
  const storiesLength = storiesData?.data?.length || 0;
  const { default: map } = useMap();

  const isMobile = useIsMobile();

  useEffect(() => {
    const bounds = new mapboxgl.LngLatBounds();
    map?.setPadding(DEFAULT_VIEW_STATE.padding);

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
      options: {
        ...DEFAULT_VIEW_STATE,
        latitude: center.lat,
        longitude: center.lng,
        pitch: 0,
        bearing: 0,
        zoom: isMobile ? DEFAULT_MOBILE_ZOOM : DEFAULT_VIEW_STATE.zoom,
      },
    });
    map?.resize();
  }, [isMobile, map, setTmpBbox, storiesData?.data]);

  useEffect(() => {
    setLayers([]);
    removeStep();
  }, []);

  const handleClearFilters = () => {
    setFilters({ ifis: null, tags: null, status: null });
  };

  const filtersActive = Object.values(filters).some((filter) => !!filter?.length);

  return (
    <div className="home text-primary flex h-screen w-screen flex-col justify-between overflow-x-hidden sm:px-12">
      <Header />
      <div className="flex max-h-full flex-1 flex-col justify-between overflow-x-hidden sm:flex-row sm:pb-6 sm:pt-12">
        <div className="sticky top-0 flex max-h-full flex-col space-y-6 px-4 sm:relative sm:h-full sm:w-[280px] sm:px-0 2xl:w-80">
          <div className="space-y-1">
            <div className="flex gap-2">
              <SearchStories />
              <Filters filtersActive={filtersActive} />
            </div>
            <div className="font-open-sans flex justify-between text-sm font-semibold">
              <p className="pl-1 text-gray-800">
                {`${storiesLength} featured ${storiesLength === 1 ? 'story' : 'stories'}`}
              </p>
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
          <div className="hidden max-h-[calc(100%-88px)] sm:block">
            <Dashboard />
          </div>
        </div>
        {/* Desktop */}
        <div className="hidden h-full w-[280px] flex-col sm:flex 2xl:w-80">
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
                href="https://gda.esa.int/impact-dashboard/"
              >
                Detailed report dashboard on ESA GDA programme.
                <ExternalLinkIcon className="h-4 w-4 shrink-0" />
              </a>
            </Card>
          </div>
        </div>
        {/* Mobile */}
        <div className="pointer-events-none fixed bottom-0 top-[160px] flex flex-col items-start overflow-y-hidden sm:hidden">
          <div className="z-10 max-h-[calc(100vh-150px)] overflow-y-auto rounded-t">
            <div className="bg-background/50 pointer-events-auto z-10 mt-[60vh] rounded-t p-4 backdrop-blur-[6px]">
              <div className="mx-auto mb-4 h-0.5 w-9 rounded-lg bg-gray-400"></div>
              <Dashboard />
              <GradientLine />
              <Card title="Top stories" className="max-h-[calc(100%-33px)]">
                <TopStories />
              </Card>
              <GradientLine />
              <Card className="h-min" title="Programme Dashboard">
                <a
                  target="_blank"
                  className="font-open-sans gap- flex justify-between px-4 text-sm leading-snug"
                  href="https://gda.esa.int/impact-dashboard/"
                >
                  Detailed report dashboard on ESA GDA programme.
                  <ExternalLinkIcon className="h-4 w-4 shrink-0" />
                </a>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-0 z-10 hidden h-fit sm:block">
        <Categories />
      </div>
    </div>
  );
}
