// import Header from '../components/homepage/Header';
import Banner from '../components/homepage/Banner';
import LiveData from '../components/homepage/LiveData';
import LatestNews from '../components/homepage/LatestNews';
import TradeIntro from '../components/homepage/TradeIntro';
import TradingType from '../components/homepage/TradingType';

export const HomePage = () => {
  //main landing page
  return (
    <div>
      <Banner/>
      {/* <Header/> */}
      <LiveData/>
      <LatestNews/>
      <TradingType/>
      <TradeIntro/>
    </div>
  );
};

export default HomePage;

