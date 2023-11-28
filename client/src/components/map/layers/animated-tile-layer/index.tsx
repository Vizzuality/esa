'use client';

import { useEffect, useMemo, useState } from 'react';

import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import parseAPNG from 'apng-js';
import { useIntervalWhen } from 'rooks';

import { LayerProps } from '@/types/layers';

import { useDeckMapboxOverlayContext } from '@/components/map/provider';

export type DeckLayerProps<T> = LayerProps &
  T & {
    type: any;
    config: any;
    paramsConfig: any;
  };

const AnimatedTileLayer = <T,>({ id, type, config, paramsConfig, ...props }: DeckLayerProps<T>) => {
  // Render deck layer
  const i = `${id}-deck`;
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();
  const [frame, setFrame] = useState(0);
  const SATELLITE_DECK_LAYER = useMemo(() => {
    const { opacity = 1, visible = true } = paramsConfig;
    const { minZoom, maxZoom, url } = config;
    return [
      new TileLayer({
        id: i,
        beforeId: id,
        frame,
        // getPolygonOffset: () => {
        //   return [0, 5000000];
        // },
        getTileData: (tile: any) => {
          const {
            index: { x, y, z },
            signal,
          } = tile;
          // const url = `https://fra1.digitaloceanspaces.com/esa-gda-comms-staging/APNGs/SatelliteImagery/${z}/${x}/${y}.png`;
          const url = `https://fra1.digitaloceanspaces.com/esa-gda-comms-staging/APNGs/Settlement/${z}/${x}/${y}.png`;
          // const url = `https://storage.googleapis.com/skydipper_materials/movie-tiles/MODIS/APNGs/${z}/${x}/${y}.png`;

          const response = fetch(url, { signal });

          if (signal.aborted) {
            return null;
          }

          return response
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
              const apng = parseAPNG(buffer);
              if (apng instanceof Error) {
                throw apng;
              }
              return apng.frames.map((f: any) => {
                return {
                  ...f,
                  bitmapData: createImageBitmap(f.imageData),
                };
              });
            });
        },
        tileSize: 256,
        visible: true,
        opacity: 1,
        refinementStrategy: 'no-overlap',
        renderSubLayers: (sl: any) => {
          if (!sl) return null;

          const { id: subLayerId, data, tile, visible, opacity = 1, frame: f } = sl;

          if (!tile || !data) return null;

          const {
            z,
            bbox: { west, south, east, north },
          } = tile;

          const FRAME = data[f];

          if (FRAME) {
            return new BitmapLayer({
              id: subLayerId,
              beforeId: id,
              image: FRAME.bitmapData,
              bounds: [west, south, east, north],
              getPolygonOffset: () => {
                return [0, 5000];
              },
              // textureParameters: {
              //   [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
              //   [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
              //   [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
              //   [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
              // },
              zoom: z,
              visible: true,
              opacity: 1,
            });
          }
          return null;
        },
        minZoom: 9,
        maxZoom: 14,
        // extent: initialViewState.bounds,
      }),
    ];
  }, [config, i, paramsConfig, frame]);

  useIntervalWhen(() => {
    setFrame((prev) => {
      if (prev === 21) {
        return 0;
      }

      return prev + 1;
    });
  }, 1000);

  useEffect(() => {
    // const ly = new type({
    //   ...props,
    //   id: i,
    //   beforeId: id,
    // });
    console.log(SATELLITE_DECK_LAYER);
    addLayer(SATELLITE_DECK_LAYER);
  }, [i, id, type, props, addLayer, SATELLITE_DECK_LAYER]);

  useEffect(() => {
    return () => {
      removeLayer(i);
    };
  }, [i, removeLayer]);

  return null;
};

export default AnimatedTileLayer;
