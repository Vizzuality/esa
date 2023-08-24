'use client';

import { useCallback, useMemo } from 'react';

import { LngLatBoundsLike, MapLayerMouseEvent, useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  bboxAtom,
  layersInteractiveAtom,
  layersInteractiveIdsAtom,
  popupAtom,
  tmpBboxAtom,
  zoomAtom,
} from '@/store';

import { useGetLayers } from '@/types/generated/layer';
import type { LayerTyped } from '@/types/layers';
import { Bbox } from '@/types/map';

import { MAPBOX_STYLES } from '@/constants/mapbox';

import StoryMarkers from '@/containers/map/markers';
import Popup from '@/containers/map/popup';
import MapSettings from '@/containers/map/settings';
import MapSettingsManager from '@/containers/map/settings/manager';

import Map from '@/components/map';
import Controls from '@/components/map/controls';
import SettingsControl from '@/components/map/controls/settings';
import ZoomControl from '@/components/map/controls/zoom';
import { CustomMapProps } from '@/components/map/types';

const LayerManager = dynamic(() => import('@/containers/map/layer-manager'), {
  ssr: false,
});

const Legend = dynamic(() => import('@/containers/map/legend'), {
  ssr: false,
});

const DEFAULT_PROPS: CustomMapProps = {
  id: 'default',
  initialViewState: {
    longitude: 0,
    latitude: 0,
    zoom: 2.01,
    pitch: 0,
    bearing: 0,
    // bounds: [-159.86, 6.31, -65.75, 60.67],
  },
  minZoom: 2,
  maxZoom: 20,
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

  const bbox = useRecoilValue(bboxAtom);
  const tmpBbox = useRecoilValue(tmpBboxAtom);
  const layersInteractive = useRecoilValue(layersInteractiveAtom);
  const layersInteractiveIds = useRecoilValue(layersInteractiveIdsAtom);

  const setZoom = useSetRecoilState(zoomAtom);

  const setBbox = useSetRecoilState(bboxAtom);
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);

  const setPopup = useSetRecoilState(popupAtom);

  const { data: layersInteractiveData } = useGetLayers(
    {
      filters: {
        id: {
          $in: layersInteractive,
        },
      },
    },
    {
      query: {
        enabled: !!layersInteractive.length,
      },
    }
  );

  const tmpBounds: CustomMapProps['bounds'] = useMemo(() => {
    if (tmpBbox) {
      return {
        bbox: tmpBbox,
        options: {
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
      setTmpBbox(null);

      setZoom(map.getZoom());
    }
  }, [map, setBbox, setTmpBbox, setZoom]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (
        layersInteractive.length &&
        layersInteractiveData?.data &&
        layersInteractiveData?.data.some((l) => {
          const attributes = l.attributes as LayerTyped;
          return attributes?.interaction_config?.events.some((ev) => ev.type === 'click');
        })
      ) {
        const p = Object.assign({}, e, { features: e.features ?? [] });

        setPopup(p);
      }
    },
    [layersInteractive, layersInteractiveData, setPopup]
  );

  return (
    <div className="absolute left-0 top-0 h-screen w-screen">
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
        bounds={tmpBounds}
        minZoom={minZoom}
        maxZoom={maxZoom}
        mapStyle={MAPBOX_STYLES.default}
        fog={FOG}
        interactiveLayerIds={layersInteractiveIds}
        onClick={handleMapClick}
        onMapViewStateChange={handleMapViewStateChange}
      >
        {() => (
          <>
            <Controls className="absolute right-5 top-12 z-40 sm:right-6 sm:top-6">
              <ZoomControl />
              <SettingsControl>
                <MapSettings />
              </SettingsControl>
            </Controls>

            <StoryMarkers />

            <LayerManager />

            <Popup />

            <MapSettingsManager />

            <Legend />
          </>
        )}
      </Map>
    </div>
  );
}
