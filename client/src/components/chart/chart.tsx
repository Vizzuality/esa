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
} from 'chart.js';
import { useMemo, useRef } from 'react';

import { Chart } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

type ChartJsProps = {
  widget: {
    type: ChartType;
    data: ChartData;
    options: Record<string, any>;
  };
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
  Legend
);

// ChartJS.defaults.font.family = 'Open Sans';

ChartJS.defaults.font.size = 14;
ChartJS.defaults.backgroundColor;

const ChartJs = ({ widget, ...props }: ChartJsProps) => {
  const { type, data, options } = widget;
  const chartRef = useRef<ChartJSOrUndefined<
    keyof ChartTypeRegistry,
    (number | [number, number] | Point | BubbleDataPoint | null)[],
    unknown
  > | null>(null);

  const defaultData = useMemo(() => {
    if (!chartRef.current) return data;

    const gradient = chartRef.current.ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 174, 157, 1)');
    gradient.addColorStop(1, 'rgba(0, 174, 157, 0)');
    return {
      ...data,
      datasets: [
        {
          ...data.datasets[0],
          backgroundColor: gradient,
        },
      ],
    };
  }, [data]);

  if (!chartTypes.includes(type) || !data || !data.datasets) {
    return null;
  }

  return (
    <div {...props}>
      <Chart ref={chartRef} type={type} options={options} data={defaultData} />
    </div>
  );
};

export default ChartJs;
