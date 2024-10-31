'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MapLayerMouseEvent, useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useAtomValue, useSetAtom } from 'jotai';
import { LngLatBoundsLike } from 'mapbox-gl';

import { cn } from '@/lib/classnames';

import { bboxAtom, layersInteractiveIdsAtom, tmpBboxAtom } from '@/store/map';

import { Bbox } from '@/types/map';

import { MAPBOX_STYLES } from '@/constants/map';

import GlobeMarkers from '@/containers/map/markers/globe-markers';
import StoryMarkers from '@/containers/map/markers/story-markers';

import Map from '@/components/map';
import { DEFAULT_PROPS } from '@/components/map/constants';
import { CustomMapProps } from '@/components/map/types';

import SelectedStoriesMarker from './markers/selected-stories-marker';

const LayerManager = dynamic(() => import('@/containers/map/layer-manager'), {
  ssr: false,
});

export default function MapContainer() {
  const { id, initialViewState, minZoom, maxZoom } = DEFAULT_PROPS;
  const router = useRouter();
  const { [id]: map } = useMap();

  const [markers, setMarkers] = useState<(GeoJSON.Feature<GeoJSON.Point> | null)[]>([]);

  const bbox = useAtomValue(bboxAtom);
  const tmpBbox = useAtomValue(tmpBboxAtom);

  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const setBbox = useSetAtom(bboxAtom);
  const setTmpBbox = useSetAtom(tmpBboxAtom);

  const pathname = usePathname();

  const isStoriesPage = useMemo(() => pathname.includes('stories'), [pathname]);
  const isLandingPage = useMemo(() => pathname.includes('home'), [pathname]);
  const isGlobePage = useMemo(() => pathname.includes('globe'), [pathname]);

  const tmpBounds: CustomMapProps['bounds'] = useMemo(() => {
    if (tmpBbox?.bbox) {
      return {
        bbox: tmpBbox?.bbox,
        options: tmpBbox?.options ?? {
          padding: initialViewState?.padding,
        },
      };
    }
  }, [tmpBbox]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMapViewStateChange = useCallback(() => {
    if (map) {
      const b = map
        .getBounds()
        .toArray()
        .flat()
        .map((v: number) => {
          return parseFloat(v.toFixed(2));
        }) as Bbox;
      setBbox(b);
      setTmpBbox(undefined);
    }
  }, [map, setBbox, setTmpBbox]);

  const handleMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      if (!isGlobePage) return;
      if (e.features?.length) {
        const storyMarkersFeatures = e.features
          .filter((f) => f.source === 'story-markers')
          .map((f) => ({
            ...f,
            geometry: f.geometry as GeoJSON.Point,
          }));

        if (storyMarkersFeatures.length) {
          setMarkers(storyMarkersFeatures as GeoJSON.Feature<GeoJSON.Point>[]);
        } else {
          setMarkers([]);
        }
      }

      if (e.features?.length === 0) {
        setMarkers([]);
      }
    },
    [isGlobePage]
  );

  useEffect(() => {
    if (map && tmpBbox?.options) {
      const { bearing, pitch, zoom, latitude, longitude } = tmpBbox.options;
      map.flyTo({
        bearing,
        pitch,
        zoom,
        center: [longitude, latitude],
        duration: 1000,
        animate: true,
        padding: initialViewState?.padding,
      });
    }
  }, [map, initialViewState, tmpBbox]);

  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    axis: 'y',
    offset: ['start start', 'end end'],
    layoutEffect: false,
    smooth: 0.5,
    container: containerRef,
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (isLandingPage && v > 0.9) {
      router.push('/globe');
    }
  });

  return (
    <div
      className={cn(
        'absolute left-0 top-0 h-screen w-screen overflow-hidden',
        isLandingPage && 'h-[150vh] overflow-y-auto sm:h-screen'
      )}
      ref={containerRef}
    >
      <div
        ref={targetRef}
        className={cn(
          'bg-map-background left-0 top-0 w-screen',
          isLandingPage
            ? 'sticky top-[120vh] h-[200vh] sm:fixed sm:top-0 sm:h-screen'
            : 'fixed h-screen'
        )}
      >
        <Map
          id={id}
          initialViewState={{
            ...initialViewState,
            ...(bbox && {
              bounds: bbox as LngLatBoundsLike,
            }),
          }}
          projection={{
            name: 'globe',
          }}
          minZoom={minZoom}
          maxZoom={maxZoom}
          bounds={tmpBounds}
          mapStyle={MAPBOX_STYLES.default}
          interactiveLayerIds={layersInteractiveIds}
          onMouseMove={handleMouseMove}
          onMapViewStateChange={handleMapViewStateChange}
          boxZoom={false}
          scrollZoom={false}
          dragPan={false}
          dragRotate={false}
          keyboard={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
          className={cn(
            isGlobePage
              ? 'pointer-events-auto cursor-pointer'
              : 'pointer-events-none cursor-default'
          )}
        >
          <LayerManager />
          <GlobeMarkers />
          <SelectedStoriesMarker markers={markers} onCloseMarker={() => setMarkers([])} />
          {isStoriesPage && <StoryMarkers />}
        </Map>
      </div>
    </div>
  );
}
