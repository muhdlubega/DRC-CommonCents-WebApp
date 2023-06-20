import Navbar from '../components/navbar/Navbar'
import Header from '../components/homepage/Header';
import Banner from '../components/homepage/Banner';
import LiveData from '../components/homepage/LiveData';
import LatestNews from '../components/homepage/LatestNews';

export const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Banner/>
      <Header />
      <LiveData/>
      <LatestNews/>
    </div>
  );
};

export default HomePage;

