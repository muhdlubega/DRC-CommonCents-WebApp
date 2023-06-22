import React, { useEffect, useRef } from 'react';
import apiStore from '../../store/ApiStore';
import { observer } from 'mobx-react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const id_array = ['1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V', 'R_10', 'R_25', 'R_50', 'R_75', 'R_100', 'JD10', 'JD25', 'JD50', 'JD75', 'JD100', 'RDBEAR', 'RDBULL'];

const LiveData: React.FC = () => {
  const carouselRef = useRef<AliceCarousel>(null);

  useEffect(() => {
    apiStore.getActiveSymbols();

    id_array.forEach((id) => {
      apiStore.setSelectedSymbol(id);
      apiStore.subscribeTicks();
    });

    return () => {
      id_array.forEach((id) => {
        apiStore.setSelectedSymbol(id);
        apiStore.unsubscribeTicks();
      });
    };
  }, []);

  const chartData = id_array.map((id) => ({
    series: [
      {
        name: id,
        data: apiStore.ticks
          .filter((tick) => tick.symbol === id)
          .slice(-15)
          .map((tick) => [tick.epoch*1000, tick.quote]),
        type: 'line',
        color: 'blue',
        lineWidth: 1,
      },
    ],
    title: {
      text: id
  },
    time: {
      useUTC: false,
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false
        }
      }
    },
    xAxis: {
      labels: {
        enabled: false,
      },
      lineWidth: 0,
      tickWidth: 0
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      title: {
        enabled: false
      },
      gridLineWidth: 0
    },
  }));

  const slideTo = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.slideTo(index);
    }
  };

  const handleSlideChanged = (e: any) => {
    const currentIndex = e.item;
    apiStore.setSelectedSymbol(id_array[currentIndex]);
  };

  const responsive = {
    0: {
      items: 2,
    },
    1024: {
      items: 5,
    },
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
      <AliceCarousel
        mouseTracking
        infinite
        autoPlay
        autoPlayInterval={1000}
        animationDuration={1000}
        disableButtonsControls
        ref={carouselRef}
        responsive={responsive}
        onSlideChanged={handleSlideChanged}
      >
        {chartData.map((data, index) => (
  <div key={index}>
    <HighchartsReact highcharts={Highcharts} options={data} />
    <div>{apiStore.ticks.find((tick) => tick.symbol === id_array[index])?.quote}</div>
  </div>
))}
      </AliceCarousel>
      <div>
        {id_array.map((id, index) => (
          <button style={{width: "5%"}} key={index} onClick={() => slideTo(index)}>
            {id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default observer(LiveData);
