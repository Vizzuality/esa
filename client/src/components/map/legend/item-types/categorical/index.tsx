'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Root, Track, Thumb } from '@radix-ui/react-slider';
import { useAtomValue, useSetAtom } from 'jotai';
import { PauseIcon, PlayIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { layersAtom, layersSettingsAtom } from '@/store/map';

import { Button } from '@/components/ui/button';

import LegendHeader from '../header';

export interface LegendTypeCategoricalProps {
  layerId: number;
  title?: string;
  info?: string;
  categories: string[];
  animationInterval?: number;
  style?: React.CSSProperties;
}

export const LegendTypeCategorical: React.FC<LegendTypeCategoricalProps> = ({
  layerId,
  title,
  info,
  categories,
  animationInterval = 1000,
  style,
}) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const thumbLabelRef = useRef<HTMLDivElement>(null);

  const layers = useAtomValue(layersAtom);
  const setLayersSettings = useSetAtom(layersSettingsAtom);

  const [isPlaying, setIsPlaying] = useState(true);
  const [frame, setFrameState] = useState(0);

  const ITEMS = useMemo(
    () =>
      (categories || []).map((label, index) => ({
        value: index,
        label,
      })),
    [categories]
  );

  const maxValue = ITEMS.length ? ITEMS.length - 1 : 0;
  const minValue = 0;
  const value = ITEMS[frame]?.value ?? 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setFrame = useCallback(
    (f: number) => {
      setFrameState(f);
      setLayersSettings((prev) => ({
        ...prev,
        [layerId]: {
          ...prev[layerId],
          frame: f,
        },
      }));
    },
    [layerId, setLayersSettings]
  );

  const handlePause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  const handlePlay = useCallback(() => {
    if (!ITEMS.length) return;

    clearTimer();
    setIsPlaying(true);

    const last = ITEMS.length - 1;
    let current = frame === last ? 0 : frame + 1;
    setFrame(current);

    intervalRef.current = setInterval(() => {
      if (current >= last) {
        clearTimer();
        setIsPlaying(false);
        return;
      }
      current += 1;
      setFrame(current);
    }, animationInterval);
  }, [ITEMS.length, frame, setFrame, clearTimer, animationInterval]);

  const onChangeFrame = (f: number) => {
    if (isPlaying) {
      clearTimer();
      setIsPlaying(false);
    }
    setFrame(f);
  };

  useEffect(() => {
    if (ITEMS.length > 1) {
      handlePlay();
    } else {
      setIsPlaying(false);
    }

    return () => {
      clearTimer();
      setFrame(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ITEMS.length]);

  const isLayerActive = useMemo(() => layers.includes(layerId), [layers, layerId]);

  if (!ITEMS.length) return null;
  if (!isLayerActive) return null;

  return (
    <div style={style} className="z-30 mt-3">
      <LegendHeader title={title} info={info} />

      <div className="flex items-center gap-8">
        {ITEMS.length > 1 && (
          <>
            {isPlaying ? (
              <Button
                variant="default"
                className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full px-0 py-0 hover:bg-white"
                onClick={handlePause}
              >
                <PauseIcon className="fill-secondary stroke-secondary h-5" />
              </Button>
            ) : (
              <Button
                variant="default"
                className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full px-0 py-0 hover:bg-white"
                onClick={handlePlay}
              >
                <PlayIcon className="fill-secondary stroke-secondary h-5 translate-x-0.5" />
              </Button>
            )}
          </>
        )}

        <Root
          max={maxValue}
          min={minValue}
          value={[frame]}
          onValueChange={([v]) => onChangeFrame(v)}
          className="relative flex w-[200px] touch-none select-none flex-col justify-end"
        >
          <div
            style={{ marginTop: thumbLabelRef.current?.clientHeight || 0 }}
            className="mb-2 flex justify-between"
          >
            <div
              className={cn('font-open-sans text-xs leading-none text-white', {
                'text-gray-400': value === minValue,
              })}
            >
              {ITEMS[minValue]?.label}
            </div>
            <div
              className={cn('font-open-sans text-xs leading-none text-white', {
                'text-gray-400': value === maxValue,
              })}
            >
              {ITEMS[maxValue]?.label}
            </div>
          </div>

          <Track className="flex h-3 w-full justify-between">
            {ITEMS.map((_, index) => (
              <div key={index} className="h-full w-0.5 bg-gray-400" />
            ))}
          </Track>

          <Thumb className="block h-6 w-0.5 cursor-pointer bg-white">
            <span
              className={cn(
                'font-open-sans block w-max text-xs font-semibold leading-none text-white',
                'translate-y-[calc(-16px-100%)]',
                {
                  '-translate-x-full': value === maxValue,
                  '-translate-x-1/2': value !== maxValue && value !== minValue,
                }
              )}
              ref={thumbLabelRef}
            >
              {ITEMS[value]?.label}
            </span>
          </Thumb>
        </Root>
      </div>
    </div>
  );
};

export default LegendTypeCategorical;
