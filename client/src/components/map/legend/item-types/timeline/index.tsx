'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Root, Track, Thumb } from '@radix-ui/react-slider';
import {
  eachYearOfInterval,
  eachMonthOfInterval,
  format as dateFnsFormat,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
} from 'date-fns';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { PauseIcon, PlayIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { layersAtom, layersSettingsAtom, timelineAtom } from '@/store/map';

import { LegendTypeTimelineProps } from '@/components/map/legend/types';
import { Button } from '@/components/ui/button';

import LegendHeader from '../header';

export const LegendTypeTimeline: React.FC<LegendTypeTimelineProps> = ({
  start,
  end,
  dateType = 'year',
  id,
  interval = 1,
  format,
  layerId,
  labels,
  title,
  animationInterval = 1000,
  info,
  ...props
}) => {
  const intervalRef = useRef<NodeJS.Timer>();

  const setLayersSettings = useSetAtom(layersSettingsAtom);
  const layers = useAtomValue(layersAtom);

  const [isPlaying, setIsPlaying] = useState(true);

  const [timelines, setTimelines] = useAtom(timelineAtom);

  const frame = useMemo(() => timelines[id]?.frame || 0, [id, timelines]);
  const TIMELINE = useMemo(() => {
    if (!start || !end) return [];

    const startDate = new Date(String(start));
    const endDate = new Date(String(end));

    let defaultFormat = 'yyyy';

    const extractFunction = () => {
      switch (dateType) {
        case 'year':
          return eachYearOfInterval;
        case 'month':
          defaultFormat = 'MMM yyyy';
          return eachMonthOfInterval;
        case 'day':
          defaultFormat = 'dd MMM yyyy';
          return eachDayOfInterval;
        case 'hour':
          defaultFormat = 'HH:mm dd';
          return eachHourOfInterval;
        case 'minute':
          defaultFormat = 'HH:mm';
          return eachMinuteOfInterval;
        default:
          return eachYearOfInterval;
      }
    };

    const timelineValues: Date[] = extractFunction()(
      { start: startDate, end: endDate },
      { step: interval }
    );

    const useConfigLabels = labels?.length === timelineValues?.length;

    return (
      timelineValues?.map((d, index) => ({
        value: index,
        label: useConfigLabels ? labels?.[index] : dateFnsFormat(d, format || defaultFormat),
      })) || []
    );
  }, [start, end, dateType, interval, format, labels]);
  const thumbLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastFrame = TIMELINE.length - 1;
    if (frame === lastFrame && timelines[id]?.layers.length > 2) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
      console.log('if');
    }
  }, [setIsPlaying, TIMELINE, frame]);
  useEffect(() => {
    // Add or update timeline to timeline atom
    setTimelines((prev) => ({
      ...prev,
      [id]: {
        layers: [...(prev[id]?.layers || []), layerId].filter((v, i, a) => a.indexOf(v) === i),
        frame,
      },
    }));
  }, [id, layerId, setTimelines]);

  const setFrame = useCallback(
    (f: number) => {
      setTimelines((prev) => {
        const existing = prev[id] || { layers: [] };

        setLayersSettings((prevSettings) => {
          return {
            ...prevSettings,
            ...existing.layers.reduce((acc, curr) => {
              return {
                ...acc,
                [curr]: {
                  ...prevSettings[curr],
                  frame: f,
                },
              };
            }, {}),
          };
        });

        return {
          ...prev,
          [id]: {
            ...existing,
            frame: f,
          },
        };
      });
    },
    [id, setLayersSettings, setTimelines]
  );

  // TO-DO - improve they way of handling interval. Remove the loop and check how is being set
  const handlePause = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const interval_id = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }
    setIsPlaying(false);
  }, []);

  const handlePlay = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(true);

    const lastFrame = TIMELINE.length - 1;
    let newFrame = frame === lastFrame ? 0 : frame + 1;
    setFrame(newFrame);

    const steps = TIMELINE.length ?? 0;

    intervalRef.current = setInterval(() => {
      if (steps <= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
        setIsPlaying(false);
        return;
      }

      if (steps === 2) {
        const next = newFrame === lastFrame ? 0 : newFrame + 1;
        setFrame(next);
        newFrame = next;
        return;
      }

      if (newFrame === lastFrame) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
        setIsPlaying(false);
      } else {
        const next = newFrame + 1;
        setFrame(next);
        newFrame = next;
      }
    }, animationInterval);
  }, [TIMELINE?.length, frame, setFrame, animationInterval, id, timelines]);

  const value = TIMELINE[frame]?.value;

  const onChangeFrame = (f: number) => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    }
    setFrame(f);
  };

  const firstTimelineLayer = useMemo(
    () => layers.find((l) => timelines[id]?.layers.includes(l)),
    [id, layers, timelines]
  );

  const maxValue = TIMELINE?.length - 1 || 1;
  const minValue = 0;

  // TO - DO - improve the way we handle intervals
  useEffect(() => {
    handlePlay();

    return () => {
      clearInterval(interval);
      setFrame(0);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const interval_id = window.setInterval(() => {}, Number.MAX_SAFE_INTEGER);
      for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
      }
    };
  }, []);

  // If the layer is not the first one in the timeline, don't render the component
  if (firstTimelineLayer !== layerId) {
    return null;
  }
  return (
    <div style={props?.style} className="z-30 mt-3">
      <LegendHeader title={title} info={info} />
      <div className="flex items-center gap-8">
        {isPlaying && (
          <Button
            variant="default"
            className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full px-0 py-0 hover:bg-white"
            onClick={handlePause}
          >
            <PauseIcon className="fill-secondary stroke-secondary h-5" />
          </Button>
        )}
        {!isPlaying && (
          <Button
            variant="default"
            className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full px-0 py-0 hover:bg-white"
            onClick={handlePlay}
          >
            <PlayIcon className="fill-secondary stroke-secondary h-5 translate-x-0.5" />
          </Button>
        )}

        <Root
          max={maxValue}
          min={minValue}
          value={[frame]}
          onValueChange={([v]) => onChangeFrame(v)}
          className="relative flex w-[200px] touch-none select-none flex-col justify-end"
        >
          <div
            style={{ marginTop: thumbLabelRef?.current?.clientHeight }}
            className="mb-2 flex justify-between"
          >
            <div
              className={cn('font-open-sans text-xs leading-none text-white', {
                'text-gray-400': value === minValue,
              })}
            >
              {TIMELINE?.[minValue]?.label}
            </div>
            <div
              className={cn('font-open-sans text-xs leading-none text-white', {
                'text-gray-400': value === maxValue,
              })}
            >
              {TIMELINE?.[maxValue]?.label}
            </div>
          </div>
          <Track className="flex h-3 w-full justify-between">
            {TIMELINE?.map((t, index) => (
              <div key={index} className="h-full w-0.5 bg-gray-400" />
            ))}
          </Track>
          <Thumb className="block h-6 w-0.5 cursor-pointer bg-white">
            <span
              className={cn(
                'font-open-sans block w-max text-xs font-semibold leading-none text-white',
                `translate-y-[calc(-16px-100%)]`,
                {
                  '-translate-x-full': value === maxValue,
                  '-translate-x-1/2': value !== maxValue && value !== minValue,
                }
              )}
              ref={thumbLabelRef}
            >
              {TIMELINE?.[value]?.label}
            </span>
          </Thumb>
        </Root>
      </div>
    </div>
  );
};

export default LegendTypeTimeline;
