'use client';

import { useEffect, useState } from 'react';

import { useMap } from 'react-map-gl';

import Image from 'next/image';

import { useAtomValue, useSetAtom } from 'jotai';
import { ExternalLinkIcon, X } from 'lucide-react';
import mapboxgl from 'mapbox-gl';

import { cn } from '@/lib/classnames';

import { updateBrowserClickedAtom, useSyncFilters } from '@/store/globe';
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

  const updateBrowserClicked = useAtomValue(updateBrowserClickedAtom);

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

  const [interactWithMapClicked, setInteractWithMapClicked] = useState<string | undefined>();

  const handleCloseInteractWithMap = () => {
    setInteractWithMapClicked('true');
    localStorage.setItem('esa-interact-with-map-clicked', 'true');
  };

  useEffect(() => {
    const updateBrowserStorage =
      typeof window !== undefined && localStorage?.getItem('esa-interact-with-map-clicked');
    if (updateBrowserStorage) {
      setInteractWithMapClicked('true');
    } else {
      setInteractWithMapClicked('false');
    }
  }, []);

  return (
    <div>
      {interactWithMapClicked === 'false' && (
        <div className="bg-background/30 fixed left-1/2 top-1/2 z-50 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center  gap-4 rounded border border-[#335E6F] px-4 py-1.5 text-white backdrop-blur-sm  sm:flex">
          <p>DRAG TO ROTATE, SCROLL TO ZOOM</p>
          <Button
            onClick={handleCloseInteractWithMap}
            className="bg-map-background hover:border-secondary hover:text-secondary w-min rounded-full border border-gray-800 px-4 py-2 text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {/* Desktop */}
      <div
        className={cn(
          'home text-primary hidden h-screen w-screen flex-col justify-between overflow-x-hidden sm:flex sm:px-12',
          updateBrowserClicked === 'false' && 'pb-[54px]'
        )}
      >
        <Header />
        <div className="flex h-[calc(100vh-40px)] flex-1 flex-col justify-between overflow-x-hidden sm:flex-row sm:pb-6 sm:pt-12">
          <div className="sticky top-0 flex max-h-full flex-col space-y-6 px-4 sm:relative sm:h-full sm:w-[280px] sm:px-0 2xl:w-80">
            <div className="space-y-1">
              <div className="flex gap-2">
                <SearchStories />
                <Filters filtersActive={filtersActive} />
              </div>
              <div className="font-open-sans flex justify-between text-sm font-semibold">
                <p className="pl-1 text-gray-800">
                  {`${storiesLength} ${storiesLength === 1 ? 'story' : 'stories'}`}
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
          <div className="hidden h-full w-[280px] flex-col sm:flex 2xl:w-80">
            <div className="flex max-h-[calc(100%-220px)] flex-col justify-between">
              <Card title="Find more stories" className="relative max-h-[calc(100%-33px)]">
                <TopStories />
              </Card>
              <GradientLine />
            </div>
            <div className="space-y-2">
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
              <div className="h-fit">
                <Card title="Knowledge Hub">
                  <a
                    target="_blank"
                    className="font-open-sans flex justify-between gap-4 px-4 text-sm leading-snug"
                    href="https://knowledge-hub-gda.esa.int/"
                  >
                    Extensive and interactive repository of European Earth Observation service
                    capabilities.
                    <ExternalLinkIcon className="h-4 w-4 shrink-0" />
                  </a>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-0 relative z-10 flex h-fit w-full items-center">
          <div className="flex-0 mb-2 text-sm lg:absolute">
            <div className="flex items-center">
              Impact stories
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/map/story-marker-lg.png`}
                width={28}
                height={28}
                alt="Story marker"
                priority
                className="h-7 w-7 object-cover"
              />
            </div>
            <div className="-mt-2 flex items-center gap-1">
              Case Studies
              <div className="pt-0.5">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/map/eoids-marker.png`}
                  width={24}
                  height={24}
                  priority
                  alt="Story marker"
                  className="h-6 w-6 object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <Categories />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="text-primary block sm:hidden">
        <div className="fixed left-0 top-0 w-screen">
          <Header />
          <div className="space-y-1 px-4">
            <div className="flex gap-2">
              <SearchStories />
              <Filters filtersActive={filtersActive} />
            </div>
            <div className="font-open-sans flex justify-between text-sm font-semibold">
              <p className="pl-1 text-gray-800">
                {`${storiesLength} ${storiesLength === 1 ? 'story' : 'stories'}`}
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
            <div className="flex items-center gap-4 pl-1 pt-1 text-sm">
              <div className="flex items-center">
                Impact stories
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/map/story-marker-lg.png`}
                  width={28}
                  height={28}
                  alt="Story marker"
                  priority
                  className="h-7 w-7 object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                Case Studies
                <div className="pt-0.5">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/map/eoids-marker.png`}
                    width={24}
                    height={24}
                    priority
                    alt="Story marker"
                    className="h-6 w-6 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-background/50 absolute top-[75vh] p-4 backdrop-blur-[6px]">
          <div className="flex w-full flex-col justify-between overflow-x-hidden">
            <div className="flex-1 overflow-x-hidden">
              <Dashboard />
            </div>
            <div className="flex-0">
              <GradientLine />
              <Card title="Find more stories" className="max-h-[calc(100%-33px)]">
                <TopStories />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
