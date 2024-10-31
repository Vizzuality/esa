'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';

import { useMap } from 'react-map-gl';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { useAtomValue, useSetAtom } from 'jotai';

import { homeMarkerAtom } from '@/store/home';

import { useBreakpoint, useIsMobile } from '@/hooks/screen-size';

import { DEFAULT_MOBILE_ZOOM } from '@/components/map/constants';
import { Dialog, DialogContentHome } from '@/components/ui/dialog';
import ScrollExplanation from '@/components/ui/scroll-explanation';

import Header from '../header';

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
  const isLg = useBreakpoint('xl');
  const isMobile = useIsMobile();

  const spin = useCallback(() => {
    if (!map) return;

    const currCenter = map.getCenter();
    const nextLng = (currCenter.lng + 0.5) % 360;
    const nextLat = currCenter.lat + 0.3;
    const lat = nextLat < -90 ? nextLat + 180 : nextLat > 90 ? nextLat - 180 : nextLat;
    map?.easeTo({
      bearing: 0,
      pitch: 0,
      zoom: isMobile ? DEFAULT_MOBILE_ZOOM : 2,
      center: { lng: nextLng, lat },
      duration: 500,
      padding: {
        left: !isMobile ? size.width * 0.45 : 0,
        right: 0,
        top: isMobile ? 0 : 0,
        bottom: isLg || isMobile ? 0 : size.height * 0.5,
      },
      easing: (n) => n,
    });
  }, [isLg, isMobile, map, size.height, size.width]);

  useEffect(() => {
    if (map) {
      spin();
      map.resize();
      map.on('moveend', spin);
      return () => {
        map.stop();
        map.off('moveend', spin);
      };
    }
  }, [map, spin, size]);

  useEffect(() => {
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

  return (
    <>
      <div className="text-primary font-notes pointer-events-none absolute flex h-screen min-h-screen w-screen flex-col justify-between">
        <div className="fixed top-0 flex h-screen w-screen flex-col overflow-hidden">
          <div className="sm:mx-12">
            <Header pathname="home" />
          </div>
          <div className="container flex flex-1 pb-12 sm:items-end xl:items-center xl:justify-start">
            <div className="max-w-full xl:max-w-lg">
              <div className="flex flex-col items-start justify-center gap-4  sm:gap-8">
                <div className="flex flex-col items-start justify-center gap-2">
                  <div className="font-notes text-xs font-bold uppercase leading-normal tracking-wide text-slate-400">
                    Welcome to the
                  </div>
                  <div className="font-notes text-[32px] font-bold uppercase leading-none tracking-[12.8px] text-zinc-100 lg:text-[40px] xl:tracking-[16px]">
                    Impact Sphere
                  </div>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-teal-500/70 via-teal-500/60 to-teal-500/0"></div>
                <div className="text-balance w-[455px] max-w-full sm:space-y-4">
                  <p className="font-open-sans text-base font-normal leading-normal text-stone-200">
                    Uncover the stories told by powerful satellites, revealing their crucial role in
                    addressing global challenges. From monitoring climate change to enhancing
                    precision agriculture, the GDA program utilises satellite data to accelerate
                    impact.
                  </p>
                  <p className="font-open-sans hidden text-base font-normal leading-normal text-stone-200 sm:block">
                    Dive into these uplifting stories and discover how satellites are shaping a more
                    sustainable and interconnected future for our planet.{' '}
                    <span className="font-open-sans text-base font-bold leading-normal text-stone-200">
                      Ready to explore GDA stories?
                    </span>
                  </p>
                  <p className="font-open-sans text-base font-bold leading-normal text-stone-200 sm:hidden">
                    Ready to explore GDA stories?
                  </p>
                </div>
              </div>
              <div className="pointer-events-auto relative z-50 mt-6 hidden h-[124px] w-[124px] rounded-full bg-teal-500/50 p-2.5 transition-all duration-500 hover:p-0 sm:block">
                <Link
                  onClick={() => map?.stop()}
                  className="font-bold uppercase tracking-wide"
                  href="/globe"
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-teal-500">
                    Explore
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mb-16 flex h-fit w-fit flex-col items-center justify-center gap-2 sm:hidden">
            <ScrollExplanation />
            <span className="bg-background/30  mx-auto rounded px-2 backdrop-blur-sm">
              Scroll to explore
            </span>
          </div>

          {/* Desktop orbiting satellites */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 2, delay: 1, ease: 'easeIn' }}
            style={{ width: w, height: '100%', right: w * -0.045, top: 0 }}
            className="3xl:scale-100 absolute z-50 hidden max-h-screen scale-125 items-center overflow-hidden xl:flex xl:scale-110"
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
        </div>

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
