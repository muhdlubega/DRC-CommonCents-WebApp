import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { getNewsTopics } from "../../config/NewsApi";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import newsStore, { NewsItem, topics_array } from "../../store/NewsStore";
import "../../styles/main.scss";
import AliceCarousel from "react-alice-carousel";
import { ArrowRight2, ArrowLeft2, SearchFavorite1 } from "iconsax-react";

const NewsTopic = observer(() => {
  // const [news, setNews] = useState<NewsItem[]>([]);
  // const [selectedTopic, setSelectedTopic] = useState<string>(topics_array[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: { target: { value: any } }) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const filteredNews = newsStore.news.filter((article) => {
    const { topics, summary, authors, title } = article;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      topics.some((topic) =>
        topic.topic.toLowerCase().includes(lowerCaseSearchTerm)
      ) ||
      summary.toLowerCase().includes(lowerCaseSearchTerm) ||
      authors.some((author) =>
        author.toLowerCase().includes(lowerCaseSearchTerm)
      ) ||
      title.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const fetchNews = async (topic: string) => {
    try {
      const response = await getNewsTopics({
        topic,
        pageSize: articlesPerPage,
        page: currentPage,
      });
      const { data } = response;
      const feed = data?.feed || [];
      newsStore.setNews(feed);
      console.log(feed);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const paginate = (array: any[], pageNumber: number, pageSize: number) => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
  };

  useEffect(() => {
    fetchNews(newsStore.selectedTopic);
  }, [newsStore.selectedTopic]);

  const handleTopicChange = (topic: string) => {
    newsStore.setSelectedTopic(topic);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const items = topics_array.map((topic, index) => (
    <Button
      key={index}
      variant={topic === newsStore.selectedTopic ? "contained" : "outlined"}
      onClick={() => handleTopicChange(topic)}
      sx={{
        mx: 1,
        paddingY: "1vw",
        border: "0.2vw solid #3366ff",
        borderRadius: "1vw",
        width: "17vw",
        backgroundColor:
          topic === newsStore.selectedTopic ? "#3366ff" : "#ffffff",
      }}
    >
      {topic.replace(/_/g, " ")}
    </Button>
  ));

  const responsive = {
    0: {
      items: 2,
    },
    1024: {
      items: 5,
    },
  };

  const renderPrevButton = () => (
    <button className="carousel-button prev-button">
      <ArrowLeft2 color="#3366ff" />
    </button>
  );

  const renderNextButton = () => (
    <button className="carousel-button next-button">
      <ArrowRight2 color="#3366ff" />
    </button>
  );

  return (
    <Box>
      <Box className="news-search">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search articles..."
          className="news-searchbox"
        />
        <SearchFavorite1 color="#3366ff" size={36} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          mt: 5,
          mx: 5,
          alignItems: "center",
        }}
      >
        <AliceCarousel
          mouseTracking
          infinite
          // disableDotsControls
          // disableButtonsControls
          responsive={responsive}
          items={items}
          renderPrevButton={renderPrevButton}
          renderNextButton={renderNextButton}
        />
      </Box>
      <Box className="news-card-row">
        {paginate(filteredNews, currentPage, articlesPerPage).map(
          (article: NewsItem | null, index) => {
            if (!article) return null;
            if (index % 2 === 0) {
              const dateTimeString = article?.time_published;
              const year = Number(dateTimeString.slice(0, 4));
              const month = Number(dateTimeString.slice(4, 6));
              const day = Number(dateTimeString.slice(6, 8));
              const hour = Number(dateTimeString.slice(9, 11));
              const minute = Number(dateTimeString.slice(11, 13));
              const second = Number(dateTimeString.slice(13, 15));

              const dateTime = new Date(
                year,
                month - 1,
                day,
                hour,
                minute,
                second
              );
              return (
                  <Link
                    className="news-card"
                    to={article?.url}
                    key={article?.title}
                  >
                    <Box className="news-imagebox">
                      <img
                        className="news-image"
                        src={article?.banner_image}
                        alt={article?.title}
                      />
                      <Typography variant="h5" fontSize={18}>{article?.title}</Typography>
                      <Typography variant="h6" fontSize={14}>
                        {dateTime.toLocaleString()}
                      </Typography>
                      <Typography variant="body1" fontSize={14}>{article?.source}</Typography>
                    </Box>
                  </Link>
              );
            }
          }
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", margin: '5vw'}}>
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          sx={{ margin: '0.5vw', padding: '1vw', width: '10vw', backgroundColor: "#0033ff", borderRadius: "1vw" }}
          variant="contained"
        >
          Previous
        </Button>
        <Button
          onClick={goToNextPage}
          disabled={newsStore.news.length < articlesPerPage}
          sx={{ margin: '0.5vw', padding: '1vw', width: '10vw', backgroundColor: "#0033ff", borderRadius: "1vw" }}
          variant="contained"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
});

export default NewsTopic;
