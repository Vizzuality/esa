'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';

<<<<<<< HEAD
import { useMap } from 'react-map-gl';

import Link from 'next/link';

import { motion, useTransform } from 'framer-motion';
import { useAtomValue, useSetAtom } from 'jotai';
=======
import { useSetAtom } from 'jotai';

import { layersAtom, tmpBboxAtom } from '@/store/map';
import { useSyncStep } from '@/store/stories';
>>>>>>> ebf3e15 (Update main (#52))

import { homeMarkerAtom } from '@/store/home';
import { mapScrollAtom } from '@/store/map';

import { getThemeSize, useIsMobile, useMediaQuery } from '@/hooks/screen-size';

import { DEFAULT_MOBILE_ZOOM, DEFAULT_VIEW_STATE } from '@/components/map/constants';
import { Dialog, DialogContentHome } from '@/components/ui/dialog';

import Header from '../header';

<<<<<<< HEAD
import { SATELLITE_MARKERS, SatelliteMarkerId } from './constants';
import SatelliteButton from './satellite-button';
import Satellite from './satellite-content';

const Home = () => {
  const { default: map } = useMap();

  const selectedMarker = useAtomValue(homeMarkerAtom);
  const setSelectedMarker = useSetAtom(homeMarkerAtom);

  const [size, setSize] = useState({
    width: 1,
    height: 1,
  });

  const isMobile = useIsMobile();
  const isXl = useMediaQuery(`(min-width: ${getThemeSize('2xl')}px)`);

  const spin = useCallback(() => {
    if (!map) return;

    const currCenter = map.getCenter();
    const nextLng = (currCenter.lng + 0.5) % 360;
    const nextLat = currCenter.lat + 0.3;
    const lat = nextLat < -90 ? nextLat + 180 : nextLat > 90 ? nextLat - 180 : nextLat;
    map?.easeTo({
      bearing: 0,
      pitch: 0,
      zoom: isMobile
        ? DEFAULT_MOBILE_ZOOM
        : isXl
        ? DEFAULT_VIEW_STATE.zoom
        : DEFAULT_VIEW_STATE.zoom - 0.5,
      center: { lng: nextLng, lat },
      duration: 500,
      padding: {
        left: size.width * 0.45,
        right: 0,
        top: isMobile ? size.height * 0.8 : 0,
        bottom: 0,
      },
      easing: (n) => n,
    });
  }, [isMobile, isXl, map, size.height, size.width]);
=======
export default function Home() {
  const setTmpBbox = useSetAtom(tmpBboxAtom);
  const setLayers = useSetAtom(layersAtom);
  const { removeStep } = useSyncStep();
>>>>>>> ebf3e15 (Update main (#52))

  useEffect(() => {
    if (map) {
      spin();
      map?.resize();
      map.on('moveend', spin);
      return () => {
        map.stop();
        map.off('moveend', spin);
      };
    }
  }, [map, spin, size]);

  useEffect(() => {
<<<<<<< HEAD
    setSelectedMarker(null);

    const handleResize = () => {
      const w = window?.innerWidth || 1;
      const h = window?.innerHeight || 1;
      setSize({ width: w, height: h });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window?.addEventListener('resize', handleResize);
      return () => {
        window?.removeEventListener('resize', handleResize);
      };
    }
  }, [setSelectedMarker]);

  const w = useMemo(() => size.width * 0.6, [size.width]);

  const handleSelectMarker = (id: SatelliteMarkerId) => {
    setSelectedMarker(id);
  };

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const mapScroll = useAtomValue(mapScrollAtom);
  const opacity = useTransform(mapScroll, [0, 0.2, 0.8], [1, 1, 0]);
=======
    setLayers([]);
    removeStep();
  }, []);
>>>>>>> ebf3e15 (Update main (#52))

  return (
    <>
      <div className="text-primary font-notes pointer-events-none absolute flex h-screen min-h-screen w-screen flex-col justify-between">
        <motion.div
          style={{ opacity: isMobile ? opacity : 1 }}
          className="fixed top-0 flex h-screen w-screen flex-col overflow-hidden"
        >
          <div className="sm:mx-12">
            <Header pathname="home" />
          </div>
          <div className="container flex flex-1 pb-12 pt-4 sm:items-end sm:pt-0 xl:items-center xl:justify-start">
            <div className="max-w-full xl:max-w-lg">
              <div className="flex flex-col items-start justify-center gap-4  sm:gap-8">
                <div className="flex flex-col items-start justify-center gap-2">
                  <div className="font-notes text-xs font-bold uppercase leading-loose tracking-[1.2px] text-slate-400 sm:leading-normal sm:tracking-wide">
                    Welcome to the
                  </div>
                  <div className="font-notes text-[20px] font-bold uppercase leading-[32px] tracking-[8px] text-zinc-100 lg:text-[40px] xl:tracking-[16px]">
                    Impact Sphere
                  </div>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-teal-500/70 via-teal-500/60 to-teal-500/0"></div>
                <div className="text-balance w-[455px] max-w-full sm:space-y-4">
                  <p className="font-open-sans text-base font-normal leading-normal text-stone-200">
                    Discover how Earth Observation (EO) is driving impact on the ground. The GDA
                    Impact Sphere showcases real-world stories from ESA’s Global Development
                    Assistance (GDA) programme, highlighting how satellite data supports
                    international development efforts — from guiding climate adaptation to improving
                    food systems, water access, infrastructure resilience, and more.
                  </p>
                  <p className="font-open-sans hidden text-base font-normal leading-normal text-stone-200 sm:block">
                    Through this interactive globe, development professionals and decision-makers
                    can explore how EO is being integrated into operations by International
                    Financial Institutions (IFIs) and local partners. Each story reflects a concrete
                    example of how space-based insights are helping tackle complex challenges and
                    accelerating sustainable development.
                  </p>

                  <p className="font-open-sans text-base font-bold leading-normal text-stone-200 sm:hidden">
                    Ready to explore EO in action?
                  </p>
                </div>
              </div>
              <div className="pointer-events-auto relative z-50 mt-6  h-[124px] w-[124px] rounded-full bg-teal-500/50 p-2.5 transition-all duration-500 hover:p-0 sm:block">
                <Link
                  onClick={() => map?.stop()}
                  className="font-bold uppercase tracking-wide"
                  href="/globe"
                  prefetch
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-teal-500">
                    Explore
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop orbiting satellites */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 2, delay: 1, ease: 'easeIn' }}
            style={{ width: w, height: '100%', right: w * -0.045, top: 0 }}
            className="3xl:scale-100 absolute z-50 hidden max-h-screen scale-125 items-center overflow-hidden lg:flex xl:scale-110"
          >
            <div style={{ height: w }} className="w-full">
              <div className="flex h-full rotate-45 items-end justify-center rounded-full border border-dashed border-slate-600 p-[50px] xl:rotate-[55deg] xl:p-[70px]">
                <div className="relative flex h-full w-full -rotate-90 justify-center rounded-full border border-dashed border-slate-600 xl:rotate-[-100deg]">
                  <SatelliteButton
                    handleSelectMarker={handleSelectMarker}
                    satellite={SATELLITE_MARKERS[0]}
                    className="-translate-y-1/2"
                  />
                  <SatelliteButton
                    handleSelectMarker={handleSelectMarker}
                    satellite={SATELLITE_MARKERS[0]}
                    className="translate-y-1/2 rotate-90 place-self-end"
                  />
                </div>
                <SatelliteButton
                  handleSelectMarker={handleSelectMarker}
                  satellite={SATELLITE_MARKERS[1]}
                  className="translate-y-[calc(50px+50%)] xl:translate-y-[calc(70px+50%)]"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <Dialog
          open={!!selectedMarker}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedMarker(null);
            }
          }}
        >
          <DialogContentHome className="w-[498px]">
            <Satellite id={selectedMarker} handleSelectSatellite={(id) => setSelectedMarker(id)} />
          </DialogContentHome>
        </Dialog>
      </div>
    </>
  );
};

export default Home;
