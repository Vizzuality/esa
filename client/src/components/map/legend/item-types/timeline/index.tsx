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

const width = 200;
const height = 12;
const textMarginY = -5;

export const LegendTypeTimeline: React.FC<LegendTypeTimelineProps> = ({
  start,
  end,
  dateType = 'year',
  id,
  interval = 1,
  format,
  layerId,
  description,
  animationInterval = 1000,
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

    return (
      timelineValues?.map((d, index) => ({
        value: index,
        label: dateFnsFormat(d, format || defaultFormat),
      })) || []
    );
  }, [start, end, dateType, interval, format]);

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

  const maxValue = TIMELINE?.length || 1;
  const minValue = 0;
  const yearScale = useCallback(
    (year: number) => (year / (maxValue - minValue)) * (width - 2),
    [maxValue, minValue]
  );

  const currValueText = useRef<SVGTextElement>(null);
  const firstValueText = useRef<SVGTextElement>(null);
  // If the layer is not the first one in the timeline, don't render the component
  if (firstTimelineLayer !== layerId) {
    return null;
  }
  const currTextSize = currValueText.current?.getBBox().width || 0;
  const firstTextSize = currValueText.current?.getBBox().width || 0;
  const currYearX = yearScale(value) - currTextSize / 2;
  const minYearX = Math.max(-firstTextSize / 2, -15);
  const maxYearX = width - Math.min(firstTextSize / 2, 25) - 5;

  return (
    <div className="w-full flex-1 overflow-visible">
      <div className="bg-card-map z-30 flex h-[62px] w-fit items-center justify-between gap-8 rounded-full px-4 backdrop-blur-sm">
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
          max={(TIMELINE?.length || 1) - 1}
          min={0}
          step={interval}
          value={[frame]}
          onValueChange={([v]) => onChangeFrame(v)}
          className="relative flex w-full -translate-x-3 translate-y-3 touch-none select-none items-center"
        >
          <Track className="w-full">
            <svg width={width} height={height} className="cursor-pointer overflow-visible">
              {/* Min value text */}
              <text
                x={minYearX}
                y={textMarginY}
                className={cn(
                  'font-open-sans fill-white text-xs',
                  currYearX - minYearX > firstTextSize ? 'opacity-100' : 'opacity-25'
                )}
                ref={firstValueText}
              >
                {TIMELINE[0]?.label}
              </text>

              {/* Years lines */}
              {TIMELINE?.map(({ value }) => {
                const position = value % 10 === 0 ? 0 : 4;
                return (
                  <line
                    key={value}
                    x1={yearScale(value)}
                    x2={yearScale(value)}
                    y1={position}
                    y2={height}
                    strokeWidth={2}
                    className="stroke-gray-400"
                  />
                );
              })}

              {/* Max value text */}
              <text
                className={cn(
                  'font-open-sans fill-white text-xs',
                  maxYearX - currYearX > firstTextSize ? 'opacity-100' : 'opacity-25'
                )}
                x={maxYearX}
                y={textMarginY}
                ref={currValueText}
              >
                {TIMELINE?.[TIMELINE.length - 1]?.label}
              </text>
              {/* Current value text */}
              <text
                x={currYearX}
                y={textMarginY - 10}
                className="font-open-sans fill-white text-sm font-bold"
              >
                {TIMELINE?.[value]?.label}
              </text>
            </svg>
          </Track>
          <Thumb className="block h-5 w-0 -translate-x-[1px] -translate-y-1 cursor-pointer border-r-[2px] bg-white" />
        </Root>
      </div>
    </div>
  );
};

export default LegendTypeTimeline;
