import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiStore from '../../store/ApiStore';
import { observer } from 'mobx-react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import AccessibilityModule from 'highcharts/modules/accessibility';

const Product = observer(() => {
  const { id } = useParams();
  // const [chartType, setChartType] = useState('candlestick');

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
        data: apiStore.chartType === 'candlestick' ?
        apiStore.ticks.slice(-300).map((tick) => ({
          x: tick.epoch * 1000,
          open: Number(tick.open),
          high: Number(tick.high),
          low: Number(tick.low),
          close: Number(tick.close),
        })) : apiStore.ticks
        .slice(-300)
        .map((tick) => [tick.epoch * 1000, tick.close]),
        type: apiStore.chartType,
        color: 'blue',
        lineWidth: 1,
        accessibility: {
          enabled: false,
        },
      },
    ],
  };

  const handleChartTypeChange = (newChartType: string) => {
    apiStore.setChartType(newChartType);
  };

  const handleToggleGranularity = () => {
    apiStore.toggleGranularity();
    apiStore.subscribeTicks();
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
      <button onClick={() => handleChartTypeChange('line')}>
          Line Chart
        </button>
        <button onClick={() => handleChartTypeChange('candlestick')}>
          Candlestick Chart
        </button>
        <button onClick={handleToggleGranularity}>
        {apiStore.isHourlyGranularity ? 'Switch to Minutes' : 'Switch to Hours'}
      </button>
      <div>
      <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={chartData} />
    </div>
    </div>
  );
});

export default Product;
