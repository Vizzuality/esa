'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { MapLayerMouseEvent, useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { useAtomValue, useSetAtom } from 'jotai';
import { LngLatBoundsLike } from 'mapbox-gl';

import { cn } from '@/lib/classnames';

import { bboxAtom, layersInteractiveIdsAtom, tmpBboxAtom } from '@/store/map';

import { Bbox } from '@/types/map';

import { useIsMobile } from '@/hooks/screen-size';

import { MAPBOX_STYLES } from '@/constants/map';

import GlobeMarkers from '@/containers/map/markers/globe-markers';

import Map from '@/components/map';
import { DEFAULT_PROPS } from '@/components/map/constants';
import { CustomMapProps } from '@/components/map/types';

import SelectedStoriesMarker from './markers/selected-stories-marker';

const LayerManager = dynamic(() => import('@/containers/map/layer-manager'), {
  ssr: false,
});

export default function MapContainer() {
  const { id, initialViewState, minZoom, maxZoom } = DEFAULT_PROPS;
  const { [id]: map } = useMap();

  const [markers, setMarkers] = useState<(GeoJSON.Feature<GeoJSON.Point> | null)[]>([]);

  const bbox = useAtomValue(bboxAtom);
  const tmpBbox = useAtomValue(tmpBboxAtom);

  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const setBbox = useSetAtom(bboxAtom);
  const setTmpBbox = useSetAtom(tmpBboxAtom);

  const pathname = usePathname();

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
  const isMobile = useIsMobile();

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
  }, [map, initialViewState, tmpBbox, isMobile]);

  const mapInteractionEnabled = useMemo(() => isGlobePage, [isGlobePage]);

  return (
    <div className={cn('bg-map-background fixed left-0 top-0 h-screen w-screen overflow-hidden')}>
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
        className={cn(
          mapInteractionEnabled
            ? 'pointer-events-auto cursor-pointer'
            : 'pointer-events-none cursor-default'
        )}
      >
        <LayerManager />
        <GlobeMarkers />
        <SelectedStoriesMarker markers={markers} onCloseMarker={() => setMarkers([])} />
      </Map>
    </div>
  );
}
