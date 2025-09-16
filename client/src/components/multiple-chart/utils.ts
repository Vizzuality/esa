import { MutableRefObject } from 'react';

import { BubbleDataPoint, ChartTypeRegistry, Point, ScriptableContext } from 'chart.js';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

export const PluginCallbacks = {
  PredictedTravelDemandDhakaTooltopTitle: (context: any) => {
    return `${context[0].raw.y} in ${context[0].raw.x}`;
  },
  PredictedTravelDemandDhakaTooltopLabel: (context: any) => {
    return `${context.raw.value?.toLocaleString()} ${context.raw.scale}`;
  },
};

export const bubbleDefaultOptions = {
  radius: (context: ScriptableContext<'bubble'>) => {
    const maxRadius = 20;
    const minRadius = 10;
    const max = Math.max(...context.dataset.data.map((d: any) => d.value || 0));
    const min = Math.min(...context.dataset.data.map((d: any) => d.value || 0));
    const value = (context.dataset.data[context.dataIndex] as any).value || 0;
    const normalized = minRadius + ((value - min) * (maxRadius - minRadius)) / (max - min);
    context.dataset.data[context.dataIndex].r = normalized;
    return normalized;
  },
};

const extractPluginCallbackFunction = (options: Record<string, any>) => {
  const plugins = options?.plugins || {};
  if (!plugins) return options;
  for (const key in plugins) {
    const plugin = plugins[key];
    if (plugin?.callbacks) {
      for (const callback in plugin.callbacks) {
        const pluginCallback = plugin.callbacks[callback];
        if (typeof pluginCallback === 'string' && pluginCallback in PluginCallbacks) {
          plugins[key].callbacks[callback] =
            PluginCallbacks[pluginCallback as keyof typeof PluginCallbacks];
        }
      }
    }
  }
  return {
    ...options,
    plugins,
  };
};

export const getChartDefaultOptions = (a: unknown) => {
  const options = !!a && typeof a === 'object' ? extractPluginCallbackFunction(a) : {};
  return {
    borderColor: options.borderColor || '#fff',
    interaction: {
      intersect: false,
      mode: 'point',
      ...options?.interaction,
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: '#fff',
          ...options?.scales?.x?.grid,
        },
        ticks: {
          // display: false,
          maxTicksLimit: 5,
          color: '#fff',
          padding: 10,
          ...options?.scales?.x?.ticks,
        },
        ...options?.scales?.x,
      },
      y: {
        border: {
          dash: [4, 4],
          display: false,
          ...(options?.scales?.y as any)?.border,
        },
        grid: {
          color: '#fff',
          drawTicks: false,
          ...options?.scales?.y?.grid,
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
          ...options?.scales?.y?.ticks,
        },
        ...options?.scales?.y,
      },
      ...options?.scales,
    },
    plugins: {
      legend: {
        display: true,
        ...options?.plugins?.legend,
      },
      tooltip: {
        mode: 'point',
        bodyFont: {
          size: 14,
          weight: 'bold',
        },
        bodyColor: '#003247',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        titleColor: '#9AABB5',
        displayColors: false,
        backgroundColor: '#fff',
        ...options?.plugins?.tooltip,
      },
      ...options?.plugins,
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

  if (data.datasets?.some((dataset: any) => dataset.backgroundColor === 'GRADIENT')) {
    const gradient = chartRef.current.ctx.createLinearGradient(0, 0, 400, 200);
    gradient.addColorStop(0, 'rgba(0, 174, 157, 1)');
    gradient.addColorStop(1, 'rgba(0, 174, 157, 0)');
    return {
      ...data,
      datasets: data.datasets.map((dataset: any) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor === 'GRADIENT' && gradient,
      })),
    };
  }

  return data;
};
