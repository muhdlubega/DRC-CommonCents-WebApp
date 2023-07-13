import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import AliceCarousel from "react-alice-carousel";
import newsStore, { NewsItem } from "../../store/NewsStore";
import { getNews } from "../../config/NewsApi";
import { observer } from "mobx-react-lite";

const LatestNews = observer(() => {
  const fetchNews = async () => {
    try {
      const response = await getNews();
      const { data } = response;
      const feed = data?.feed || [];
      newsStore.setNews(feed);
      console.log(feed);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);
  
  const responsive = {
    0: {
      items: 1,
    },
    1080: {
      items: 3,
    },
  };

  const items = newsStore.news.map((article: NewsItem | null) => {
    if (!article) return null;
    return (
      <Link className="news-card" to={article?.url} key={article?.title}>
        <img src={article?.banner_image} alt={article?.title} />
        <Typography component="span">{article?.title}</Typography>
      </Link>
    );
  });

  return (
    <Box>
      {newsStore.news.length > 0 && (
      <Box>
        <Typography component="span" className="news-span">
        <Box className="news-title">Latest News</Box>
      </Typography>
      <Box className="news-carousel">
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
      </Box>
      </Box>)}
    </Box>
  );
});

export default LatestNews;
