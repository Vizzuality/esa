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
import { useAtomValue, useSetAtom } from 'jotai';
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

  const [isPlaying, setIsPlaying] = useState(false);

  const timelines = useAtomValue(timelineAtom);
  const setTimelines = useSetAtom(timelineAtom);

  const frame = useMemo(() => timelines[id]?.frame || 0, [id, timelines]);

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
      // Update timelines
      setTimelines((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          frame: f,
        },
      }));

      const layers = timelines[id]?.layers || [];

      // Update the layersSettings for all layers with the same timeline id
      setLayersSettings((prev) => {
        return {
          ...prev,
          ...layers.reduce((acc, curr) => {
            return {
              ...acc,
              [curr]: {
                ...prev[curr],
                frame: f,
              },
            };
          }, {}),
        };
      });
    },
    [id, setLayersSettings, setTimelines, timelines]
  );

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

  const handlePlay = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      return;
    }
    const lastFrame = TIMELINE.length - 1;
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
    }, animationInterval);
  }, [isPlaying, TIMELINE?.length, frame, setFrame, animationInterval]);

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

  // If the layer is not the first one in the timeline, don't render the component
  if (firstTimelineLayer !== layerId) {
    return null;
  }

  return (
    <div style={props?.style} className="z-30 mt-3">
      <LegendHeader title={title} info={info} />
      <div className="flex items-center gap-8">
        <Button
          variant="default"
          className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full px-0 py-0 hover:bg-white"
          onClick={handlePlay}
        >
          {isPlaying ? (
            <PauseIcon className="fill-secondary stroke-secondary h-5" />
          ) : (
            <PlayIcon className="fill-secondary stroke-secondary h-5 translate-x-0.5" />
          )}
        </Button>

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
