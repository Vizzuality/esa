'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { MapLayerMouseEvent, useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useAtomValue, useSetAtom } from 'jotai';
import { LngLatBoundsLike } from 'mapbox-gl';

import { cn } from '@/lib/classnames';

import { bboxAtom, layersInteractiveIdsAtom, tmpBboxAtom } from '@/store/map';

import { Bbox } from '@/types/map';

import { DEFAULT_MAP_STATE, MAPBOX_STYLES } from '@/constants/map';

import GlobeMarkers from '@/containers/map/markers/globe-markers';
import StoryMarkers from '@/containers/map/markers/story-markers';
import Popup from '@/containers/map/popup';

import Map from '@/components/map';
import Marker from '@/components/map/layers/marker';
import { CustomMapProps } from '@/components/map/types';

const MapLegends = dynamic(() => import('@/containers/map/legend'), {
  ssr: false,
});
const LayerManager = dynamic(() => import('@/containers/map/layer-manager'), {
  ssr: false,
});

const DEFAULT_PROPS: CustomMapProps = {
  id: 'default',
  initialViewState: DEFAULT_MAP_STATE,
  minZoom: 1,
  maxZoom: 14,
};

export default function MapContainer() {
  const { id, initialViewState, minZoom, maxZoom } = DEFAULT_PROPS;

  const { [id]: map } = useMap();

  const { push } = useRouter();

  const [marker, setMarker] = useState<GeoJSON.Feature<GeoJSON.Point> | null>(null);

  const bbox = useAtomValue(bboxAtom);
  const tmpBbox = useAtomValue(tmpBboxAtom);

  const layersInteractiveIds = useAtomValue(layersInteractiveIdsAtom);

  const setBbox = useSetAtom(bboxAtom);
  const setTmpBbox = useSetAtom(tmpBboxAtom);

  const pathname = usePathname();

  const isGlobePage = pathname.includes('globe');

  const tmpBounds: CustomMapProps['bounds'] = useMemo(() => {
    if (tmpBbox?.bbox) {
      return {
        bbox: tmpBbox?.bbox,
        options: tmpBbox?.options ?? {
          padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
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

  const handleMouseMove = useCallback((e: MapLayerMouseEvent) => {
    if (e.features?.length) {
      const f = e.features[0];

      if (f.source === 'story-markers') {
        setMarker({
          ...f,
          geometry: f.geometry as GeoJSON.Point,
        });
      }

      if (f.source !== 'story-markers') {
        setMarker(null);
      }
    }

    if (e.features?.length === 0) {
      setMarker(null);
    }
  }, []);

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
        padding: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      });
    }
  }, [map, tmpBbox]);

  return (
    <div className={cn('bg-map-background fixed left-0 top-0 h-screen w-full')}>
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
        className={cn(!isGlobePage && 'pointer-events-none cursor-default')}
      >
        <LayerManager />
        <Popup />
        {(isGlobePage || pathname.includes('home')) && <GlobeMarkers />}
        {marker && isGlobePage && (
          <Marker
            key={marker.id}
            longitude={marker.geometry.coordinates[0]}
            latitude={marker.geometry.coordinates[1]}
            properties={marker.properties}
            onClick={() => {
              setMarker(null);
              push(`/stories/${marker.id}`);
            }}
          />
        )}
        {pathname.includes('stories') && <StoryMarkers />}
      </Map>
      <div className="absolute bottom-0 left-0 z-20 w-full p-4 pb-16 pl-14">
        <MapLegends />
      </div>
    </div>
  );
}
