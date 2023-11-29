import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = ({ options }: { options: any }) => {
  return (
    <div className="mt-4">
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          title: { text: '' },
          series: options.series,
          chart: {
            ...options.chart,
            backgroundColor: 'transparent',
            height: '250px',
          },
          legend: { enabled: false },
          tooltip: {
            format: '{key}: {point.y}',
          },
          xAxis: {
            labels: { style: { color: '#fff' } },
            legend: { style: { color: '#fff' } },
            lineWidth: 0,
            tickLength: 0,
            tickWidth: 0,
          },
          credits: {
            enabled: false,
          },
          yAxis: {
            title: { text: '' },
            gridLineDashStyle: 'Dash',
            gridLineColor: 'rgba(255, 255, 255, 0.80)',
            gridLineWidth: 1,
            legend: { style: { color: '#fff' }, title: { text: '' } },
            labels: { style: { color: '#fff' } },
            startOnTick: false,
          },
          ...options,
        }}
      />
    </div>
  );
};

export default Chart;
