import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = ({ options }) => {
  return (
    <div className="h-[500px] w-[500px]">
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          title: { text: '' },
          series: options.series,
          chart: {
            ...options.chart,
            backgroundColor: 'transparent',
            height: '300px',
          },
          legend: { enabled: false },
          xAxis: {
            labels: { style: { color: '#fff' } },
            legend: { style: { color: '#fff' } },
            lineWidth: 0,
          },
          yAxis: {
            title: { text: '' },
            gridLineDashStyle: 'Dash',
            gridLineColor: 'rgba(255, 255, 255, 0.80)',
            lineColor: '#ff0000',
            gridLineWidth: 1,
            legend: { style: { color: '#fff' }, title: { text: '' } },
            labels: { style: { color: '#fff' } },
          },
          ...options,
        }}
      />
    </div>
  );
};

export default Chart;
