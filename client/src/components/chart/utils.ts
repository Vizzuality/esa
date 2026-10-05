import { MutableRefObject } from 'react';

import { BubbleDataPoint, ChartTypeRegistry, Point, ScriptableContext, Tooltip } from 'chart.js';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

import { jsonToFunction } from '@/lib/json-formatter';

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

export const getChartDefaultOptions = (a: unknown, isLast?: boolean) => {
  // exceptions
  const rawOptions = {
    ...a,
    scales: {
      ...a?.scales,
      x: {
        ...a?.scales?.x,
        ticks: {
          ...a?.scales?.x?.ticks,
          display: true,
        },
      },
    },
  };
  const optionsLast = jsonToFunction(rawOptions);

  const optionsCase: { [key: string]: unknown } = !isLast ? jsonToFunction(a) : optionsLast;
  const options =
    !!optionsCase && typeof optionsCase === 'object'
      ? extractPluginCallbackFunction(optionsCase)
      : {};
  return {
    borderColor: '#fff',
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
        display: false,
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

/**
 * Range datasets
 *
 * Two datasets form a range (e.g. an uncertainty band) when one dataset's `fill` targets the other
 * (`'+1'`, `'-1'`, an index, or `{ target }`) and the target has an empty or identical label.
 *
 * For each range pair:
 * - the target dataset is hidden from the tooltip and the legend;
 * - the primary dataset's tooltip row shows both values as `Label: min – max`.
 *
 * Fills to `origin` / `start` / `end` / `stack` / `shape`, and fills between two distinctly
 * labelled datasets, are left untouched. Options from the CMS are preserved and wrapped, not
 * replaced.
 */

const FILL_KEYWORDS = ['origin', 'start', 'end', 'stack', 'shape'];

const resolveFillTarget = (fill: unknown, index: number, count: number): number | null => {
  let target: number | null = null;

  if (typeof fill === 'number') {
    target = fill;
  } else if (typeof fill === 'string' && !FILL_KEYWORDS.includes(fill)) {
    if (/^[+-]\d+$/.test(fill)) target = index + parseInt(fill, 10);
    else if (/^\d+$/.test(fill)) target = parseInt(fill, 10);
  } else if (fill && typeof fill === 'object' && 'target' in fill) {
    return resolveFillTarget((fill as { target: unknown }).target, index, count);
  }

  if (target === null || target === index || target < 0 || target >= count) return null;
  return target;
};

export type RangePairs = {
  primaryToPartner: Map<number, number>;
  partners: Set<number>;
};

export const getRangeDatasetPairs = (datasets: any[] | undefined): RangePairs => {
  const primaryToPartner = new Map<number, number>();
  const partners = new Set<number>();
  if (!Array.isArray(datasets)) return { primaryToPartner, partners };

  datasets.forEach((dataset, index) => {
    const target = resolveFillTarget(dataset?.fill, index, datasets.length);
    if (target === null || partners.has(target) || primaryToPartner.has(target)) return;
    const partnerLabel = datasets[target]?.label;
    const isRange = !partnerLabel || partnerLabel === dataset?.label;
    if (!isRange) return;
    primaryToPartner.set(index, target);
    partners.add(target);
  });

  return { primaryToPartner, partners };
};

const getPointValue = (chart: any, datasetIndex: number, dataIndex: number): number | null => {
  const parsed = chart?.getDatasetMeta?.(datasetIndex)?.data?.[dataIndex]?.parsed?.y;
  if (typeof parsed === 'number') return parsed;
  const raw = chart?.data?.datasets?.[datasetIndex]?.data?.[dataIndex];
  if (typeof raw === 'number') return raw;
  if (raw && typeof raw === 'object' && typeof raw.y === 'number') return raw.y;
  return null;
};

const formatValue = (value: number | null) => (value === null ? '' : value.toLocaleString());

export const applyRangeDatasetOptions = (options: any, data: any) => {
  const pairs = getRangeDatasetPairs(data?.datasets);
  if (!pairs.primaryToPartner.size) return options;

  const tooltip = options?.plugins?.tooltip || {};
  const legend = options?.plugins?.legend || {};
  const defaultLabel = (item: any) =>
    `${item.dataset?.label ? `${item.dataset.label}: ` : ''}${item.formattedValue ?? ''}`;
  const cmsLabel: (this: any, item: any) => unknown =
    tooltip.callbacks?.label || (Tooltip.defaults as any)?.callbacks?.label || defaultLabel;
  const cmsTooltipFilter = tooltip.filter;
  const cmsLegendFilter = legend.labels?.filter;

  return {
    ...options,
    plugins: {
      ...options?.plugins,
      tooltip: {
        ...tooltip,
        filter: (item: any, ...rest: any[]) =>
          !pairs.partners.has(item.datasetIndex) &&
          (typeof cmsTooltipFilter === 'function' ? cmsTooltipFilter(item, ...rest) : true),
        callbacks: {
          ...tooltip.callbacks,
          label: function (this: any, item: any) {
            const partner = pairs.primaryToPartner.get(item.datasetIndex);
            if (partner === undefined) return cmsLabel.call(this, item);
            const values = [
              getPointValue(item.chart, item.datasetIndex, item.dataIndex),
              getPointValue(item.chart, partner, item.dataIndex),
            ].filter((v): v is number => v !== null);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const label = item.dataset?.label ? `${item.dataset.label}: ` : '';
            return `${label}${formatValue(min)} – ${formatValue(max)}`;
          },
        },
      },
      legend: {
        ...legend,
        labels: {
          ...legend.labels,
          filter: (item: any, ...rest: any[]) =>
            !pairs.partners.has(item.datasetIndex) &&
            (typeof cmsLegendFilter === 'function' ? cmsLegendFilter(item, ...rest) : true),
        },
      },
    },
  };
};
