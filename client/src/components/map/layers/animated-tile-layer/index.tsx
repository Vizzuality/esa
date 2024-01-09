'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import parseAPNG from 'apng-js';

import { LayerProps } from '@/types/layers';

import { useDeckMapboxOverlayContext } from '@/components/map/provider';
import { Switch } from '@/components/ui/switch';

import { LegendTypeTimeline } from '../../legend/item-types';

export type DeckLayerProps<T> = LayerProps &
  T & {
    c: any;
    beforeId: string;
  };

const AnimatedTileLayer = <T,>({ id = '', c, beforeId }: DeckLayerProps<T>) => {
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timer>();

  const { minZoom, maxZoom, data } = c;

  const { interval = 1000, start, end, autoplay = false, delay = 3000 } = c.timeline;

  const createLayer = useCallback(
    (data: { visible: boolean; url: string; opacity: number }, id: string, beforeId: string) => {
      const { url, visible = true, opacity = 1 } = data;
      console.log({ beforeId, id });
      return new TileLayer({
        id,
        beforeId,
        frame,
        minZoom,
        fp64: true,
        maxZoom,
        getTileData: (tile: any) => {
          const {
            index: { x, y, z },
            signal,
          } = tile;
          const tileUrl = url.replace('{z}', z).replace('{x}', x).replace('{y}', y);

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
        tileSize: 256,
        visible,
        opacity,
        refinementStrategy: 'no-overlap',
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
              beforeId,
              image: FRAME.bitmapData,
              bounds: [west, south, east, north],
              getPolygonOffset: () => {
                return [2, 5 * 10000];
              },
              fp64: true,
              zoom,
              visible,
              opacity,
            });
          }
          return null;
        },
      });
    },
    [frame, minZoom, maxZoom]
  );

  const [DATA, setDATA] = useState(Array.isArray(data) ? data : [data]);

  const LAYERS = useMemo(
    () =>
      DATA.map((d, index) => {
        console.log(d);
        return createLayer(d, d.id, id);
      }),
    [DATA, createLayer, data, id]
  );

  useEffect(() => {
    LAYERS.forEach((l) => {
      addLayer(l);
    });
  }, [LAYERS, addLayer]);

  const handlePlay = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      return;
    }
    const lastFrame = end - start;
    let newFrame = frame === lastFrame ? 0 : frame + 1;
    setFrame(newFrame);
    intervalRef.current = setInterval(() => {
      if (newFrame === lastFrame) {
        clearInterval(intervalRef.current);
        setIsPlaying(false);
      } else {
        setFrame(newFrame + 1);
        newFrame++;
      }
    }, interval);
  }, [end, frame, interval, isPlaying, start]);

  const handleChangeFrame = (_frame: number) => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
    setFrame(_frame);
  };

  useEffect(() => {
    if (autoplay) {
      setTimeout(() => {
        handlePlay();
      }, delay);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      LAYERS.forEach((l) => {
        removeLayer(l.id);
      });
    };
  }, [LAYERS, removeLayer]);

  const handleChangeVisibility = (id: string, checked: boolean) => {
    setDATA((prev) => {
      return prev.map((l) => {
        if (l.id === id) {
          return {
            ...l,
            visible: checked,
          };
        }
        return l;
      });
    });
  };

  return (
    <div className="pointer-events-auto absolute bottom-14 left-14 z-50 flex items-end gap-40">
      {c.timeline && (
        <LegendTypeTimeline
          timeline={{
            start: start,
            end: end,
            currentFrame: frame,
          }}
          onChangeCurrent={handleChangeFrame}
          onPlay={handlePlay}
          isPlaying={isPlaying}
        />
      )}
      {c.controllers && (
        <div className=" text-white">
          <div className="flex gap-6">
            {DATA.map((d, i) => (
              <div key={i}>
                <Switch
                  onCheckedChange={(checked) => handleChangeVisibility(d.id, checked)}
                  value={d.id}
                  defaultChecked={d.visible}
                  id={`${d.id}-switch`}
                />
                <label className="ml-3" htmlFor={`${d.id}-switch`}>
                  {d.id}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedTileLayer;
