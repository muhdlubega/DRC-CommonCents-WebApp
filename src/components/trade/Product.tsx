import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js/auto';
import apiStore from '../../store/ApiStore';
import { observer } from 'mobx-react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

ChartJS.register(...registerables);

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

  const formatTickLabel = (epoch: number) => {
    const date = new Date(epoch * 1000);
    return date.toLocaleTimeString();
  };

  const chartData = {
    chart: {
      events: {load: function() {apiStore.ticks[apiStore.ticks.length]}}
    },
    xAxis: {
      categories: apiStore.ticks.slice(-80).map((tick) => formatTickLabel(tick.epoch)),
    },
    series: [
      {
        name: apiStore.selectedSymbol,
        data: apiStore.ticks.slice(-80).map((tick) => tick.quote),
        type: 'line',
        color: 'blue',
        lineWidth: 1,
      },
    ],
  };

  console.log(apiStore.ticks)
  

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
