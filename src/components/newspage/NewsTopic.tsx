import { useEffect, useState } from "react";
import { Box, Button, IconButton, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material";
import { getNewsTopics } from "../../config/NewsApi";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import newsStore, { NewsItem, topics_array } from "../../store/NewsStore";
import "../../styles/main.scss";
// import AliceCarousel from "react-alice-carousel";
import { SearchNormal1 } from "iconsax-react";

const NewsTopic = observer(() => {
  // const [news, setNews] = useState<NewsItem[]>([]);
  // const [selectedTopic, setSelectedTopic] = useState<string>(topics_array[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const articlesPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setIsSearchFocused(true);
    const { value } = event.target;
    const filteredValue = value.replace(/[^\w\s]/gi, "")
    setSearchTerm(filteredValue);
  };

  // const toggleSearchbar = () => {
  //   setIsSearchFocused((prevState) => !prevState);
  // };

  const filteredNews = newsStore.news.filter((article) => {
    const { topics, summary, authors, title, source } = article;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      topics.some((topic) =>
        topic.topic.toLowerCase().includes(lowerCaseSearchTerm)
      ) ||
      summary.toLowerCase().includes(lowerCaseSearchTerm) ||
      authors.some((author) =>
        author.toLowerCase().includes(lowerCaseSearchTerm)
      ) ||
      title.toLowerCase().includes(lowerCaseSearchTerm) ||
      source.toLowerCase().includes(lowerCaseSearchTerm)
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
      console.log(response);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const paginate = (array: NewsItem[], pageNumber: number, pageSize: number) => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
  };

  useEffect(() => {
    fetchNews(newsStore.selectedTopic);
  }, []);

  // const handleTopicChange = (topic: string) => {
  //   newsStore.setSelectedTopic(topic);
  // };

  const handleTopicChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    const selectedTopic = topics_array[newValue];
    newsStore.setSelectedTopic(selectedTopic);
    console.log(selectedTopic);
    fetchNews(selectedTopic);
  };
  

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const items = topics_array.map((topic, index) => (
  //   <Button
  //     key={index}
  //     variant={topic === newsStore.selectedTopic ? "contained" : "outlined"}
  //     onClick={() => handleTopicChange(topic)}
  //     sx={{
  //       mx: 1,
  //       paddingY: "1vw",
  //       border: "0.2vw solid #3366ff",
  //       borderRadius: "1vw",
  //       width: "17vw",
  //       backgroundColor:
  //         topic === newsStore.selectedTopic ? "#3366ff" : "#ffffff",
  //     }}
  //   >
  //     {topic.replace(/_/g, " ")}
  //   </Button>
  // ));

  // const responsive = {
  //   0: {
  //     items: 2,
  //   },
  //   1024: {
  //     items: 5,
  //   },
  // };

  // const renderPrevButton = () => (
  //   <button className="carousel-button prev-button">
  //     <ArrowLeft2 color="#3366ff" />
  //   </button>
  // );

  // const renderNextButton = () => (
  //   <button className="carousel-button next-button">
  //     <ArrowRight2 color="#3366ff" />
  //   </button>
  // );

  return (
    <Box>
      <Box className={`news-search ${isSearchFocused ? "focused" : ""}`}>
    <TextField
      type="text"
      value={searchTerm}
      onClick={() => setIsSearchFocused(true)}
      onChange={handleSearch}
      placeholder="Search articles..."
      className="news-searchbox"
    />
    <IconButton
      color="primary"
      onClick={() => setIsSearchFocused(true)}
      style={{ marginLeft: "1vw", visibility: isSearchFocused ? "hidden" : "visible" }}
    >
      <SearchNormal1 />
    </IconButton>
  </Box>
      {/* <Box
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
      </Box> */}
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
        <Tabs
          value={topics_array.indexOf(newsStore.selectedTopic)}
          onChange={handleTopicChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Topics"
        >
          {topics_array.map((topic, index) => (
            <Tab
              key={index}
              label={topic.replace(/_/g, " ")}
              sx={{
                mx: 1,
                paddingY: "1vw",
                // border: "0.2vw solid #3366ff",
                // borderRadius: "1vw",
                // backgroundColor:
                // topic === newsStore.selectedTopic ? "#3366ff" : "#ffffff",
              }}
            />
          ))}
        </Tabs>
      </Box>
      {filteredNews.length === 0 ? (
      <Typography variant="h4" align="center">
        Sorry, no search results found.
      </Typography>
    ) : (<Box className="news-card-row">
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
                  </Box>
                  <Box className="news-textbox">
                    <Typography variant="h5" style={{ color: theme.palette.text.primary }}>{article?.title}</Typography>
                    <Typography variant="h6" style={{ color: theme.palette.text.secondary }}>
                      {article?.summary}
                    </Typography>
                    <Typography variant="body1" style={{ color: theme.palette.text.secondary }}>
                      Author(s):{" "}
                      {article.authors.map((author, index) => (
                        <span key={index}>
                          {author}
                          {index < article.authors.length - 1 && ", "}
                        </span>
                      ))}
                    </Typography>
                    <Typography variant="body1" style={{ color: theme.palette.text.secondary }}>
                      Topic(s):{" "}
                      {article.topics.map((topic, index) => (
                        <span key={index}>
                          {topic?.topic}
                          {index < article.topics.length - 1 && ", "}
                        </span>
                      ))}
                    </Typography>
                    <Typography variant="body1" style={{ color: theme.palette.text.secondary }}>
                      {article?.source} - {article?.source_domain}
                    </Typography>
                    <Typography variant="body1" style={{ color: theme.palette.text.secondary }}>
                      {dateTime.toLocaleString()}
                    </Typography>
                  </Box>
                </Link>
              );
            }
          }
        )}
      </Box>)}
      <Box sx={{ display: "flex", justifyContent: "flex-end", margin: "5vw" }}>
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1 || filteredNews.length === 0 }
          sx={{
            margin: "0.5vw",
            padding: "1vw",
            width: "10vw",
            backgroundColor: "#0033ff",
            borderRadius: "1vw",
          }}
          variant="contained"
        >
          Previous
        </Button>
        <Button
          onClick={goToNextPage}
          disabled={newsStore.news.length < articlesPerPage ||
            paginate(filteredNews, currentPage, articlesPerPage).length === 0 || filteredNews.length === 0 }
          sx={{
            margin: "0.5vw",
            padding: "1vw",
            width: "10vw",
            backgroundColor: "#0033ff",
            borderRadius: "1vw",
          }}
          variant="contained"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
});

export default NewsTopic;
