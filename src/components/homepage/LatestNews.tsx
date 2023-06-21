import { useEffect, useState } from "react";
import { getNews } from "../../config/NewsApi";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import '../../styles/main.scss'

interface NewsItem{
    title: string;
    banner_image: string;
    url: string;
  }

const LatestNews = () => {
    const [news, setNews] = useState([]);

    const fetchNews = async () => {
        try {
          const response = await getNews();
          const { data } = response;
          const feed = data?.feed || [];
          setNews(feed);
          console.log(feed)
        } catch (error) {
          console.error('Error fetching news:', error);
        }
      };
      

  useEffect(() => {
    fetchNews();
  }, []);

  const responsive = {
    0: {
      items: 1,
    },
    1024: {
      items: 2,
    },
  };

  const items = news.map((article: NewsItem | null) => {
    if (!article) return null;
    return (
      <Link
        className="news-card"
        to={article?.url}
        key={article?.title}
      >
        <img
          src={article?.banner_image}
          alt={article?.title}
        />
        <span>{article?.title}</span>
      </Link>
    );
  });
  
  return (
    <div>
    <span className="news-span">
      <div>Latest News</div>
      <Link to={'/news'}><span>See more...</span></Link>
    </span>
    <div className="news-carousel">
      <AliceCarousel
        mouseTracking
        infinite
        autoPlay
        autoPlayInterval={2000}
        animationDuration={2000}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
      />
    </div></div>
  );
};

export default LatestNews;
