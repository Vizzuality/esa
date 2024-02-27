'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Root, Track, Thumb } from '@radix-ui/react-slider';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai';

import { layersSettingsAtom, timelineAtom } from '@/store/map';

import { LegendTypeTimelineProps } from '@/components/map/legend/types';
import { Button } from '@/components/ui/button';

export const LegendTypeTimeline: React.FC<LegendTypeTimelineProps> = ({
  startYear,
  endYear,
  id,
  layerId,
  ...rest
}) => {
  const width = 200;
  const height = 12;
  const textMarginY = -10;
  const textMarginX = 16;
  const intervalRef = useRef<NodeJS.Timer>();

  const setLayersSettings = useSetAtom(layersSettingsAtom);

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

  const handlePlay = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      return;
    }
    const lastFrame = endYear - startYear;
    let newFrame = frame === lastFrame ? 0 : frame + 1;
    setFrame(newFrame);

    const { interval = 1000 } = rest;

    intervalRef.current = setInterval(() => {
      if (newFrame === lastFrame) {
        clearInterval(intervalRef.current);
        setIsPlaying(false);
      } else {
        setFrame(newFrame + 1);
        newFrame++;
      }
    }, interval);
  }, [isPlaying, endYear, startYear, frame, setFrame, rest]);

  const years = useMemo(
    () =>
      startYear && endYear
        ? Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
        : [],
    [endYear, startYear]
  );

  const lastYear = years[years.length - 1];
  const value = years[frame];

  const yearScale = useCallback(
    (year: number) =>
      startYear && endYear ? ((year - startYear) / (endYear - startYear)) * (width - 2) : 0,
    [endYear, startYear]
  );

  const onChangeFrame = (f: number) => {
    setFrame(f);
  };

  // If the layer is not the first one in the timeline, don't render the component
  if (timelines[id]?.layers?.length > 1 && timelines[id]?.layers[0] !== layerId) {
    return null;
  }

  return (
    <div className="w-full flex-1 overflow-visible">
      <div className="bg-card-map z-30 flex h-[60px] w-fit items-center justify-between gap-8 rounded-full px-4 backdrop-blur-sm">
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
          max={endYear - startYear}
          min={0}
          step={1}
          value={[frame]}
          onValueChange={([v]) => onChangeFrame(v)}
          className="relative flex w-full -translate-x-3 translate-y-2 touch-none select-none items-center"
        >
          <Track className="w-full">
            <svg width={width} height={height} className="cursor-pointer overflow-visible">
              {/* Min value text */}
              <text x={-textMarginX} y={textMarginY} className="font-open-sans fill-white text-sm">
                {value - years[0] > 3 && years[0]}
              </text>

              {/* Years lines */}
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

              {/* Max value text */}
              <text
                className="font-open-sans fill-white text-sm"
                x={width - textMarginX}
                y={textMarginY}
              >
                {lastYear !== value && lastYear}
              </text>
              {/* Current value text */}
              <text
                x={yearScale(value) - textMarginX}
                y={textMarginY - 5}
                className="font-open-sans fill-white text-sm font-bold"
              >
                {value}
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
