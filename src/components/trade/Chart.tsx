import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Box, Button } from '@mui/material';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import AccessibilityModule from 'highcharts/modules/accessibility';

import apiStore from '../../store/ApiStore';

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
      enabled: false,
    },
    rangeSelector: {
      selected: 3,
      enabled: false,
    },
    chart: {
      height: `${(9 / 16) * 100}%`,
    },
    series: [
      {
        name: apiStore.selectedSymbol,
        data:
          apiStore.chartType === 'candlestick'
            ? apiStore.ticks
                .slice(-1000)
                .map((tick) => ({
                  x: tick.epoch * 1000,
                  open: Number(tick.open),
                  high: Number(tick.high),
                  low: Number(tick.low),
                  close: Number(tick.close),
                }))
            : apiStore.ticks.slice(-1000).map((tick) => [tick.epoch * 1000, tick.close]),
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

  const handleTicksChange = async () => {
    apiStore.toggleTicks(true);
    await apiStore.subscribeTicks();
    apiStore.setChartType('line');
  };

  return (
    <Box>
      <Box>
        <Button hidden id="ticks" className="submitBtn">
          Subscribe Ticks
        </Button>
        <Button hidden id="ticks-unsubscribe" className="resetBtn">
          Unsubscribe Ticks
        </Button>
        <Button hidden id="ticks-history" className="historyBtn">
          Get Tick History
        </Button>
      </Box>
      <Button
        onClick={() => handleChartTypeChange('line')}
      >
        Line Chart
      </Button>
      <Button
        onClick={() => handleChartTypeChange('candlestick')}
      >
        Candlestick Chart
      </Button>
      <Button
        onClick={handleTicksChange}
      >
        Ticks
      </Button>
      <Button
        onClick={() => handleGranularityChange(60)}
      >
        Minutes
      </Button>
      <Button
        onClick={() => handleGranularityChange(3600)}
      >
        Hours
      </Button>
      <Button
        onClick={() => handleGranularityChange(86400)}
      >
        Days
      </Button>
      <Box>
        <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={chartData} />
      </Box>
    </Box>
  );
});

export default Chart;
