import { useMemo, useRef } from 'react';

import { Chart } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartType,
  ChartTypeRegistry,
  Point,
  BubbleDataPoint,
  Filler,
} from 'chart.js';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

import { WidgetWidgetComponent } from '@/types/generated/strapi.schemas';

import { getChartDefaultData, getChartDefaultOptions } from './utils';

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.font.size = 10;

const ChartJs = ({ widget, ...props }: ChartJsProps) => {
  const { type, data, options } = widget;
  const chartRef = useRef<ChartJSOrUndefined<
    keyof ChartTypeRegistry,
    (number | [number, number] | Point | BubbleDataPoint | null)[],
    unknown
  > | null>(null);

  const dataWithDefaults = useMemo(() => getChartDefaultData(data, chartRef), [data]);
  const optionsWithDefaults = useMemo(() => getChartDefaultOptions(options), [options]);

  const chartType = type as ChartType;

  // If the type is incorrect of there is no dataset return null
  if (!chartTypes.includes(chartType) || !data || !(data as ChartData).datasets) {
    return null;
  }

  return (
    <div {...props}>
      <Chart
        ref={chartRef}
        type={chartType}
        options={optionsWithDefaults}
        data={dataWithDefaults}
      />
    </div>
  );
};

export default ChartJs;
