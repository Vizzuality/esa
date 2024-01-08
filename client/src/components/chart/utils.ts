import { MutableRefObject } from 'react';

import { BubbleDataPoint, ChartTypeRegistry, Point } from 'chart.js';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

export const getChartDefaultOptions = (options: any) => {
  return {
    borderColor: '#fff',
    interaction: {
      intersect: false,
      mode: 'index',
      ...options.interaction,
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: '#fff',
          ...options.scales?.x?.grid,
        },
        ticks: {
          maxTicksLimit: 5,
          color: '#fff',
          padding: 10,
          ...options.scales?.x?.ticks,
        },
        ...options.scales?.x,
      },
      y: {
        border: {
          dash: [4, 4],
          display: false,
          ...options.scales?.y?.border,
        },
        grid: {
          color: '#fff',
          drawTicks: false,
          ...options.scales?.y?.grid,
        },
        ticks: {
          padding: 0,
          color: '#fff',
          callback: function (label: string | number) {
            if (typeof label !== 'number') return label;
            if (label >= 10 ** 6) return label / 10 ** 6 + 'M';
            if (label >= 10 ** 3) return label / 1000 + 'k';
            return label;
          },
          maxTicksLimit: 5,
          ...options.scales?.y?.ticks,
        },
        ...options.scales?.y,
      },
      ...options.scales,
    },
    plugins: {
      legend: {
        display: false,
        ...options.plugins?.legend,
      },
      ...options.plugins,
    },
    ...options,
  };
};

export const getChartDefaultData = (
  data: any,
  chartRef: MutableRefObject<ChartJSOrUndefined<
    keyof ChartTypeRegistry,
    (number | [number, number] | Point | BubbleDataPoint | null)[],
    unknown
  > | null>
) => {
  if (!chartRef.current) return data;

  const gradient = chartRef.current.ctx.createLinearGradient(0, 0, 400, 200);
  gradient.addColorStop(0, 'rgba(0, 174, 157, 1)');
  gradient.addColorStop(1, 'rgba(0, 174, 157, 0)');
  return {
    ...data,
    datasets: data.datasets.map((dataset: any) => ({
      ...dataset,
      backgroundColor: gradient,
      borderColor: 'rgb(0, 174, 157)',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 0,
      pointHoverBorderWidth: 0,
    })),
  };
};
