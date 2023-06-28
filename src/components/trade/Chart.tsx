import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiStore from '../../store/ApiStore';
import { observer } from 'mobx-react-lite';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import AccessibilityModule from 'highcharts/modules/accessibility';

const Chart = observer(() => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      apiStore.setSelectedSymbol(id);
    }
    apiStore.subscribeTicks();

    return () => {
      apiStore.unsubscribeTicks();
    };
  }, [id]);

  AccessibilityModule(Highcharts);

  const chartData = {
    time: {
      useUTC: false,
    },
    credits: {
      enabled: false
    },
    chart: {
      height: (9 / 16 * 100) + '%'
  },
    series: [
      {
        name: apiStore.selectedSymbol,
        data: 
        apiStore.chartType === 'candlestick' ?
        apiStore.ticks.slice(-1000).map((tick) => ({
          x: tick.epoch * 1000,
          open: Number(tick.open),
          high: Number(tick.high),
          low: Number(tick.low),
          close: Number(tick.close),
        })) : 
        apiStore.ticks.slice(-1000)
        .map((tick) => [tick.epoch * 1000, tick.close]),
        type: apiStore.chartType,
        color: apiStore.chartType === 'candlestick' ? 'red' : 'blue',
        upColor: 'green',
        lineWidth: 1,
        accessibility: {
          enabled: false,
        },
      },
    ],
  };

  const handleChartTypeChange = (newChartType: string) => {
    apiStore.toggleTicks(false);
    apiStore.setChartType(newChartType);
  };

  const handleGranularityChange = (newGranularity: number) => {
    apiStore.toggleTicks(false);
    apiStore.setGranularity(newGranularity);
    apiStore.subscribeTicks();
  };

  // const ToggleGranularity = () => {
  //   apiStore.toggleGranularity();
  //   apiStore.subscribeTicks;
  // }

  const handleTicksChange = async () => {
    apiStore.toggleTicks(true);    
    await apiStore.subscribeTicks();
    apiStore.setChartType('line');
  }; 

  return (
    <div>
      <div>
        <button hidden id="ticks" className="submitBtn">
          Subscribe Ticks
        </button>
        <button hidden id="ticks-unsubscribe" className="resetBtn">
          Unsubscribe Ticks
        </button>
        <button hidden id="ticks-history" className="historyBtn">
          Get Tick History
        </button>
      </div>
      <button style={{margin: 20, borderRadius: 5, height: 35, width: 100, cursor: 'pointer'}} onClick={() => handleChartTypeChange('line')}>
          Line Chart
        </button>
        <button style={{margin: 20, borderRadius: 5, height: 35, width: 160, cursor: 'pointer'}} onClick={() => handleChartTypeChange('candlestick')}>
          Candlestick Chart
        </button>
        <button style={{margin: 20, borderRadius: 5, height: 35, width: 150, cursor: 'pointer'}} onClick={handleTicksChange}>
        Ticks
      </button>
      {/* <button style={{margin: 20, borderRadius: 5, height: 35, width: 150, cursor: 'pointer'}} onClick={ToggleGranularity}>
        Switch Time
      </button> */}
        <button style={{margin: 20, borderRadius: 5, height: 35, width: 150, cursor: 'pointer'}} onClick={() => handleGranularityChange(60)}>
        Minutes
      </button>
      <button style={{margin: 20, borderRadius: 5, height: 35, width: 150, cursor: 'pointer'}} onClick={() => handleGranularityChange(3600)}>
        Hours
      </button>
      <button style={{margin: 20, borderRadius: 5, height: 35, width: 150, cursor: 'pointer'}} onClick={() => handleGranularityChange(86400)}>
        Days
      </button>
      <div>
      <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={chartData} />
    </div>
    </div>
  );
});

export default Chart;
