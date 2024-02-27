import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import parseAPNG from 'apng-js';
import { RasterSource } from 'mapbox-gl';

import { LayerProps } from '@/types/layers';

export interface AnimatedTileProps extends LayerProps {
  source: RasterSource;
  opacity: number;
  visibility: boolean;
  beforeId: string;
  decodeFunction: string;
  decodeParams: Record<string, unknown>;
  frame: number;
}

export class AnimatedTile {
  constructor({ id, source, visibility = true, opacity = 1, frame = 0 }: AnimatedTileProps) {
    return new TileLayer({
      id,
      frame,
      tileSize: source.tileSize ?? 256,
      minZoom: source.minzoom,
      maxZoom: source.maxzoom,
      visible: visibility ?? true,
      opacity: opacity ?? 1,
      refinementStrategy: 'no-overlap',
      getTileData: (tile: any) => {
        const {
          index: { x, y, z },
          signal,
        } = tile;
        if (!source.url) return null;
        const tileUrl = source.url.replace('{z}', z).replace('{x}', x).replace('{y}', y);

        const response = fetch(tileUrl, { signal });

        if (signal.aborted) {
          return null;
        }

        return response
          .then((res) => res.arrayBuffer())
          .then((buffer) => {
            const apng = parseAPNG(buffer);
            if (apng instanceof Error) {
              return null;
            }
            return apng.frames.map((f: any) => {
              return {
                ...f,
                bitmapData: createImageBitmap(f.imageData),
              };
            });
          });
      },
      renderSubLayers: (sl: any) => {
        if (!sl) return null;

        const { id: subLayerId, data, tile, visible, opacity = 1, frame: f } = sl;

        if (!tile || !data) return null;

        const {
          zoom,
          bbox: { west, south, east, north },
        } = tile;

        const FRAME = data[f];

        if (FRAME) {
          return new BitmapLayer({
            id: subLayerId,
            image: FRAME.bitmapData,
            bounds: [west, south, east, north],
            getPolygonOffset: () => {
              return [0, 100000];
            },
            zoom,
            visible,
            opacity,
          });
        }
        return null;
      },
    });
  }
}
