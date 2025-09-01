'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { MapLayerMouseEvent, useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';

import { useAtomValue, useSetAtom } from 'jotai';
import { LngLatBoundsLike } from 'mapbox-gl';
import { useDebouncedValue } from 'rooks';

import { cn } from '@/lib/classnames';

import { bboxAtom, layersInteractiveIdsAtom, tmpBboxAtom } from '@/store/map';
import { useSyncStep } from '@/store/stories';

import { useGetStoriesId } from '@/types/generated/story';
import { Bbox } from '@/types/map';

import { useIsMobile } from '@/hooks/screen-size';

import { MAPBOX_STYLES } from '@/constants/map';

import GlobeMarkers from '@/containers/map/markers/globe-markers';

import Map from '@/components/map';
import { DEFAULT_PROPS } from '@/components/map/constants';
import { CustomMapProps } from '@/components/map/types';

import EOIDsMarkers from './markers/eoids-markers';
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
  const { id: storyId } = useParams();
  const { step } = useSyncStep();

  const { data: storyData } = useGetStoriesId(+storyId, {
    populate: 'deep',
  });

  const lastStep = useMemo(() => {
    if (storyData?.data?.attributes?.steps) {
      return Number(storyData.data.attributes.steps.length);
    }
    return null;
  }, [storyData]);

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
        ?.getBounds()
        ?.toArray()
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
  const [mapInteractionEnabledDebounced] = useDebouncedValue(mapInteractionEnabled, 500);
  const projection =
    step && lastStep && Number(step) > 1 && step < Number(lastStep) ? 'mercator' : 'globe';

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
          // The globe projection in Deck.gl has limitations at low zoom levels (≈1–6).
          // Around that range, Deck.gl switches rendering strategy and effectively falls back to Mercator.
          // Below ~5, Mercator tiles can be flattened onto the globe and look okay; above ~6,
          // the globe needs more subdivisions than low-level tiles provide, causing stretching, blur, or mismatches.

          // Some layers require Mercator, so we switch to it
          // starting from step 2. When entering a story, the transition begins on the globe (flying into step 1),
          // where the globe remains visible. From step 2 onward we use Mercator, and on the last step we return to globe.
          // This isn’t very scalable and should be revisited.

          //https://github.com/mapbox/mapbox-gl-js/blob/main/src/geo/projection/globe_constants.ts#L5

          name: projection,
        }}
        minZoom={minZoom}
        maxZoom={maxZoom}
        bounds={tmpBounds}
        mapStyle={MAPBOX_STYLES.default}
        interactiveLayerIds={layersInteractiveIds}
        onMouseMove={handleMouseMove}
        onMapViewStateChange={handleMapViewStateChange}
        className={cn(
          mapInteractionEnabledDebounced
            ? 'pointer-events-auto cursor-pointer'
            : 'pointer-events-none cursor-default'
        )}
      >
        <LayerManager />
        <EOIDsMarkers />
        <GlobeMarkers />
        <SelectedStoriesMarker markers={markers} onCloseMarker={() => setMarkers([])} />
      </Map>
    </div>
  );
}
