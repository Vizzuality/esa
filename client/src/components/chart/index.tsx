import { useMemo, useRef } from 'react';

import { Chart } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ChartData,
  ChartType,
  ChartTypeRegistry,
  Point,
  BubbleDataPoint,
  Filler,
  registerables,
} from 'chart.js';
import { ChartJSOrUndefined, ChartProps } from 'react-chartjs-2/dist/types';

import { WidgetWidgetComponent } from '@/types/generated/strapi.schemas';

import { bubbleDefaultOptions, getChartDefaultData, getChartDefaultOptions } from './utils';

type ChartJsProps = {
  widget: WidgetWidgetComponent;
};

const chartTypes = [
  'bar',
  'line',
  'scatter',
  'bubble',
  'pie',
  'doughnut',
  'polarArea',
  'radar',
] as const;

ChartJS.register(...registerables, Filler);

ChartJS.defaults.font.size = 10;

const ChartJs = ({ widget, ...props }: ChartJsProps) => {
  const { type, data, options } = widget;
  const chartRef = useRef<ChartJSOrUndefined<
    keyof ChartTypeRegistry,
    (number | [number, number] | Point | BubbleDataPoint | null)[],
    unknown
  > | null>(null);

  const dataWithDefaults = useMemo(
    () => getChartDefaultData(data, chartRef),
    [data, chartRef.current]
  );

  const chartType = type as ChartType;

  const optionsWithDefaults: Partial<ChartProps['options']> = getChartDefaultOptions(options);

  const OPTIONS = {
    ...optionsWithDefaults,
    datasets: {
      ...(chartType === 'bubble'
        ? { bubble: { ...bubbleDefaultOptions, ...optionsWithDefaults?.datasets?.bubble } }
        : {}),
    },
  };

  return (
    <div className="w-full">
      {!chartTypes.includes(chartType) || !data || !(data as ChartData).datasets ? null : (
        <Chart
          {...props}
          ref={chartRef}
          type={chartType}
          options={OPTIONS}
          data={dataWithDefaults}
        />
      )}
    </div>
  );
};

export default ChartJs;
