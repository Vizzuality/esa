import { useMemo, useRef } from 'react';

import { Chart } from 'react-chartjs-2';
import DATA from './constants.json';
import {
  Chart as ChartJS,
  ChartTypeRegistry,
  Point,
  BubbleDataPoint,
  Filler,
  registerables,
} from 'chart.js';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

import { WidgetWidgetComponent } from '@/types/generated/strapi.schemas';

import { getChartDefaultData, getChartDefaultOptions } from './utils';

type ChartJsProps = {
  widget: WidgetWidgetComponent;
};

ChartJS.register(...registerables, Filler);

ChartJS.defaults.font.size = 10;

type RecordItem = {
  variable: string;
  time: string; // ISO date
  value: number | null;
  value_median: number | null;
  value_min: number | null;
  value_max: number | null;
};

type ChartType = 'line' | 'bar' | 'area' | string;

type CustomDataset = {
  type: ChartType;
  label: string;
  data: Array<number | null>;
};

type CustomBlock = {
  datasets: {
    labels: string[]; // times (sorted)
    data: CustomDataset[]; // 4 datasets per variable
  };
};

// Transforms a flat array into one chart block per variable
export function toChartByVariable(
  rows: RecordItem[],
  opts?: { datasetType?: ChartType; includeMinMax?: boolean }
): Record<string, CustomBlock> {
  const datasetType = opts?.datasetType ?? 'line';

  // group by variable
  const byVar = new Map<string, RecordItem[]>();
  for (const r of rows) {
    if (!byVar.has(r.variable)) byVar.set(r.variable, []);
    byVar.get(r.variable)!.push(r);
  }

  // build chart blocks per variable
  const result: Record<string, CustomBlock> = {};

  for (const [variable, items] of byVar.entries()) {
    // sort by time
    items.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const labels = items.map((i) => i.time);

    const value = items.map((i) => i.value ?? null);
    const valueMedian = items.map((i) => i.value_median ?? null);
    const valueMin = items.map((i) => i.value_min ?? null);
    const valueMax = items.map((i) => i.value_max ?? null);

    const datasets: CustomDataset[] = [
      { type: 'line', label: `${variable} (value)`, data: value },
      { type: 'line', label: `${variable} (median)`, data: valueMedian },
      { type: 'line', label: `${variable} (min)`, data: valueMin },
      { type: 'line', label: `${variable} (max)`, data: valueMax },
    ];

    result[variable] = {
      labels,
      datasets,
      label: `${variable} (value)`,
    };
  }

  return result;
}
const MultipleChart = ({ widget, ...props }: ChartJsProps) => {
  const { type, data, options } = widget;

  const chartRef = useRef<ChartJSOrUndefined<
    keyof ChartTypeRegistry,
    (number | [number, number] | Point | BubbleDataPoint | null)[],
    unknown
  > | null>(null);

  const optionsWithDefaults = useMemo(() => getChartDefaultOptions(options), [options]);

  const OPTIONS = {
    ...optionsWithDefaults,
  };
  const datos = toChartByVariable(DATA);
  console.log(datos, 'multiple chart', options, OPTIONS);

  return (
    <div className="w-full">
      {Object.values(datos).map((dato) => {
        console.log(dato, options, options['total_precipitation']);
        return (
          <Chart
            key={dato.label}
            {...props}
            ref={chartRef}
            type={'line'}
            options={getChartDefaultOptions(options['total_precipitation'])}
            data={dato}
          />
        );
      })}
    </div>
  );
};

export default MultipleChart;
