import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiStore from '../../store/ApiStore';
import { observer } from 'mobx-react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

const Product: React.FC = () => {
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

  const chartData = {
    // chart: {
    //   events: {load: function() {apiStore.ticks[apiStore.ticks.length]}},
    // },
  //   rangeSelector: {
  //     verticalAlign: 'top',
  //   x: 0,
  //   y: 0
  // },
    time: {
      useUTC: false,
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: apiStore.selectedSymbol,
        data: apiStore.ticks.slice(-80).map((tick) => [tick.epoch*1000, tick.quote]),
        type: 'line',
        color: 'blue',
        lineWidth: 1,
      },
    ],
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
      <div>
      <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={chartData} />
    </div>
    </div>
  );
};

export default observer(Product);
