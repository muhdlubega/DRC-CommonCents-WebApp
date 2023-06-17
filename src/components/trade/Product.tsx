import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useGlobalState } from '../../store/Context';
// import { observer } from 'mobx-react-lite';
// import { useLocalObservable } from 'mobx-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js/auto';
import DerivAPIBasic from 'https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic';

ChartJS.register(...registerables);

const app_id = 1089; 
const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
const api = new DerivAPIBasic({ connection });

interface Tick {
  epoch: number;
  quote: number;
}

const Product: React.FC = () => {
  const [ticks, setTicks] = useState<Tick[]>([]);
  const { id } = useParams(); 
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');

  const ticks_history_request = {
    ticks_history: id,
    adjust_start_time: 1,
    count: 100,
    end: 'latest',
    start: 1,
    style: 'ticks',
  };
  
  const ticks_request = {
    ...ticks_history_request,
    subscribe: 1,
  };
  
  const tickSubscriber = () => api.subscribe(ticks_request);

  const ticksHistoryResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log('Error : ', data.error.message);
      connection.removeEventListener('message', ticksHistoryResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === 'history') {
      console.log(data.history);
    }
    connection.removeEventListener('message', ticksHistoryResponse, false);
  };

  const tickResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
      console.log('Error: ', data.error.message);
      connection.removeEventListener('message', tickResponse, false);
      await api.disconnect();
    }
    if (data.msg_type === 'tick') {
      setTicks((prevTicks) => [...prevTicks, data.tick]);
    }
  };

  const subscribeTicks = async () => {
    await tickSubscriber();
    connection.addEventListener('message', tickResponse);
  };

  const unsubscribeTicks = () => {
    connection.removeEventListener('message', tickResponse, false);
    tickSubscriber().unsubscribe();
  };

  const getTicksHistory = async () => {
    connection.addEventListener('message', ticksHistoryResponse);
    await api.ticksHistory(ticks_history_request);
  };

  useEffect(() => {
    if (id) {
    setSelectedSymbol(id);
    console.log(selectedSymbol);
    }
    subscribeTicks();
    const ticksButton = document.querySelector('#ticks');
    const unsubscribeButton = document.querySelector('#ticks-unsubscribe');

    ticksButton?.addEventListener('click', subscribeTicks);
    unsubscribeButton?.addEventListener('click', unsubscribeTicks);

    const ticks_history_button = document.querySelector('#ticks-history');
    ticks_history_button?.addEventListener('click', getTicksHistory);

    return () => {
      ticksButton?.removeEventListener('click', subscribeTicks);
      unsubscribeButton?.removeEventListener('click', unsubscribeTicks);
      ticks_history_button?.removeEventListener('click', getTicksHistory);
    };
  }, [id]);

  const chartData = {
    labels: ticks.slice(-80).map((tick) => tick.epoch.toString()),
    datasets: [
      {
        label: 'Ticks',
        data: ticks.slice(-80).map((tick) => tick.quote),
        fill: false,
        borderColor: 'blue',
        tension: 0.1,
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
        <Line data={chartData}/>
      </div>
    </div>
  );
};

export default Product;

