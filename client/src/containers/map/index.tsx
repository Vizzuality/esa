'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { MapLayerMouseEvent, useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { LngLatBoundsLike, Style } from 'mapbox-gl';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import {
  bboxAtom,
  // layersInteractiveAtom,
  layersInteractiveIdsAtom,
  // popupAtom,
  tmpBboxAtom,
} from '@/store';

// import { useGetLayers } from '@/types/generated/layer';
// import type { LayerTyped } from '@/types/layers';
import { Bbox } from '@/types/map';

import { DEFAULT_MAP_STATE } from '@/constants/map';
import MAPBOX_STYLE_GLOBE from '@/constants/mapbox-style-globe.json';
import MAPBOX_STYLE_DEFAULT from '@/constants/mapbox-style.json';

import HomeMarkers from '@/containers/map/markers/home-markers';
import StoryMarkers from '@/containers/map/markers/story-markers';
import Popup from '@/containers/map/popup';
// import MapSettings from '@/containers/map/settings';
// import MapSettingsManager from '@/containers/map/settings/manager';

import Map from '@/components/map';
// import Controls from '@/components/map/controls';
// import SettingsControl from '@/components/map/controls/settings';
// import ZoomControl from '@/components/map/controls/zoom';
import Marker from '@/components/map/layers/marker';
import { CustomMapProps } from '@/components/map/types';

const LayerManager = dynamic(() => import('@/containers/map/layer-manager'), {
  ssr: false,
});

const DEFAULT_PROPS: CustomMapProps = {
  id: 'default',
  initialViewState: DEFAULT_MAP_STATE,
  minZoom: 2,
  maxZoom: 14,
};

const FOG = {
  range: [0.5, 8],
  'horizon-blend': 0.125,
  color: '#2a6981',
  'high-color': '#0a2839',
  'space-color': '#0a2839',
  'star-intensity': 0.25,
};

export default function MapContainer() {
  const { id, initialViewState, minZoom, maxZoom } = DEFAULT_PROPS;

  const { [id]: map } = useMap();

  const { push } = useRouter();

  const [marker, setMarker] = useState<GeoJSON.Feature<GeoJSON.Point> | null>(null);

  const bbox = useRecoilValue(bboxAtom);
  const tmpBbox = useRecoilValue(tmpBboxAtom);
  // const isFlyingBack = useRecoilValue(isFlyingBackAtom);

  const layersInteractiveIds = useRecoilValue(layersInteractiveIdsAtom);

  const setBbox = useSetRecoilState(bboxAtom);
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);

  const pathname = usePathname();

  const isHomePage = useMemo(() => !pathname.includes('stories'), [pathname]);

  // const { data: layersInteractiveData } = useGetLayers(
  //   {
  //     filters: {
  //       id: {
  //         $in: layersInteractive,
  //       },
  //     },
  //   },
  //   {
  //     query: {
  //       enabled: !!layersInteractive.length,
  //     },
  //   }
  // );

  const tmpBounds: CustomMapProps['bounds'] = useMemo(() => {
    if (tmpBbox?.bbox) {
      return {
        bbox: tmpBbox?.bbox,
        options: tmpBbox?.options ?? {
          padding: {
            top: 50,
            bottom: 50,
            // left: sidebarOpen ? 640 + 50 : 50,
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

  // const handleMapClick = useCallback(
  //   (e: MapLayerMouseEvent) => {
  //     if (
  //       layersInteractive.length &&
  //       layersInteractiveData?.data &&
  //       layersInteractiveData?.data.some((l) => {
  //         const attributes = l.attributes as LayerTyped;
  //         return attributes?.interaction_config?.events.some((ev: any) => ev.type === 'click');
  //       })
  //     ) {
  //       const p = Object.assign({}, e, { features: e.features ?? [] });

  //       setPopup(p);
  //     }
  //   },
  //   [layersInteractive, layersInteractiveData, setPopup]
  // );

  const handleMapMove = useCallback((e: MapLayerMouseEvent) => {
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
      });
    }
  }, [map, tmpBbox]);

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen w-screen bg-[#0a2839]',
        isHomePage ? 'cursor-pointer' : 'pointer-events-none cursor-default'
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
        mapStyle={(isHomePage ? MAPBOX_STYLE_GLOBE : MAPBOX_STYLE_DEFAULT) as Style}
        fog={FOG}
        interactiveLayerIds={layersInteractiveIds}
        // onClick={handleMapClick}
        onMouseMove={handleMapMove}
        bounds={tmpBounds}
        scrollZoom={isHomePage}
        dragPan={isHomePage}
        onMapViewStateChange={handleMapViewStateChange}
        className={cn(isHomePage ? 'cursor-pointer' : 'pointer-events-none cursor-default')}
        padding={{ top: 50, bottom: 50, left: 200, right: 300 }}
      >
        {/* <Controls className="absolute right-5 top-12 z-40 sm:right-6 sm:top-6">
          <ZoomControl />
          <SettingsControl>
            <MapSettings />
          </SettingsControl>
        </Controls> */}

        <LayerManager />

        <Popup />

        {/* <MapSettingsManager /> */}

        {isHomePage && <HomeMarkers />}

        {marker && isHomePage && (
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
        {!isHomePage && <StoryMarkers />}
      </Map>
    </div>
  );
}
