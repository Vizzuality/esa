'use client';

import React, { useCallback, useMemo } from 'react';

import { Root, Track, Thumb } from '@radix-ui/react-slider';
import { PauseIcon, PlayIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';

type LegendTypeTimelineProps = {
  timeline: {
    start: number;
    end: number;
    currentFrame: number;
  };
  onChangeCurrent: (year: number) => void;
  onPlay: () => void;
  isPlaying?: boolean;
  className?: string;
};

export const LegendTypeTimeline: React.FC<LegendTypeTimelineProps> = ({
  className = '',
  timeline,
  onChangeCurrent,
  onPlay,
  isPlaying,
}) => {
  const width = 200;
  const height = 12;
  const textMarginY = -10;
  const textMarginX = 16;

  const years = useMemo(
    () =>
      timeline?.start && timeline?.end
        ? Array.from({ length: timeline.end - timeline.start + 1 }, (_, i) => timeline.start + i)
        : [],
    [timeline.end, timeline.start]
  );

  const lastYear = years[years.length - 1];
  const value = years[timeline?.currentFrame];

  const yearScale = useCallback(
    (year: number) =>
      timeline?.start && timeline?.end
        ? ((year - timeline.start) / (timeline.end - timeline.start)) * (width - 2)
        : 0,
    [timeline.end, timeline.start]
  );

  return (
    <div
      className={cn('flex justify-between gap-8', {
        [className]: !!className,
      })}
    >
      <Button
        variant="default"
        className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full px-0 py-0 hover:bg-white"
        onClick={onPlay}
      >
        {isPlaying ? (
          <PauseIcon className="fill-secondary stroke-secondary h-5" />
        ) : (
          <PlayIcon className="fill-secondary stroke-secondary h-5" />
        )}
      </Button>

      <Root
        max={timeline.end - timeline.start}
        min={0}
        step={1}
        value={[timeline.currentFrame]}
        onValueChange={([v]) => onChangeCurrent(v)}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
      >
        <Track className="w-full">
          <svg width={width} height={height} className="cursor-pointer overflow-visible">
            <text x={-textMarginX} y={textMarginY} className="font-open-sans fill-white text-sm">
              {years[0] !== value && years[0]}
            </text>
            {years.map((year) => {
              const position = year % 10 === 0 ? 0 : 4;
              return (
                <line
                  key={year}
                  x1={yearScale(year)}
                  x2={yearScale(year)}
                  y1={position}
                  y2={height}
                  strokeWidth={2}
                  className="stroke-gray-400"
                />
              );
            })}
            <text
              className="font-open-sans fill-white text-sm"
              x={width - textMarginX}
              y={textMarginY}
            >
              {lastYear !== value && lastYear}
            </text>
            <text
              x={yearScale(value) - textMarginX}
              y={textMarginY - 10}
              className="font-open-sans fill-white "
            >
              {value}
            </text>
          </svg>
        </Track>
        <Thumb className="block h-6 w-0 -translate-x-[1px] -translate-y-1.5 cursor-pointer border-r-[2px] bg-white" />
      </Root>
    </div>
  );
};

export default LegendTypeTimeline;
