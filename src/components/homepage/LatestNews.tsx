import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AliceCarousel from "react-alice-carousel";
import newsStore, { NewsItem } from "../../store/NewsStore";
import { getNews } from "../../config/NewsApi";
import { observer } from "mobx-react-lite";
import placeholder from '../../assets/images/placeholder.png'
import authStore from "../../store/AuthStore";
import { MoreCircle } from "iconsax-react";

const LatestNews = observer(() => {
  //latest trading news from the AlphaVantage API
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      const response = await getNews();
      const { data } = response;
      const feed = data?.feed || [];
      newsStore.setNews(feed);
    } catch (error) {
      authStore.setAlert({
        open: true,
        message: (error as { message: string }).message,
        type: "Unable to fetch news currently. Try again in a few minutes",
      });
    }
  };

  const items = newsStore.news.map((article: NewsItem | null) => {
    if (!article) return null;
    return (
      <Link className="news-card" to={article?.url} key={article?.title}>
        <img src={article?.banner_image || placeholder} alt={article?.title} />
        <Typography component="span">{article?.title}</Typography>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 1,
    },
    1080: {
      items: 3,
    },
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Box>
      {newsStore.news.length > 0 && (
      <Box>
        <Box className="news-title">Latest News
        <Box className="live-data-box" onClick={() => navigate("/news")}>
        <Tooltip
          title="See more news"
          placement="right"
          disableFocusListener
          disableTouchListener
          arrow
        >
          <MoreCircle size={40} />
        </Tooltip>
      </Box></Box>
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
