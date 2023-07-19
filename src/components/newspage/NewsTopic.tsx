import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { getNewsTopics } from "../../config/NewsApi";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import newsStore, { NewsItem } from "../../store/NewsStore";
import { topics_array } from "../../arrays/NewsTopicArray";
import placeholder from "../../assets/images/placeholder.png";
import { SearchNormal1 } from "iconsax-react";
import authStore from "../../store/AuthStore";
import loading from "../../assets/images/commoncents.svg";
import loading2 from "../../assets/images/white-blue-logo.svg";

interface TopicNewsCache {
  [topic: string]: NewsItem[];
}

const NewsTopic = observer(() => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const articlesPerPage = 40;
  const [searchTerm, setSearchTerm] = useState("");
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const theme = useTheme();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const filteredValue = value.replace(/[^\w\s]/gi, "");
    setSearchTerm(filteredValue);
  };

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

  const [topicNewsCache, setTopicNewsCache] = useState<TopicNewsCache>({});

  const fetchNews = useCallback(
    async (topic: string) => {
      if (topicNewsCache[topic]) {
        newsStore.setNews(topicNewsCache[topic]);
      } else {
        try {
          const response = await getNewsTopics({
            topic,
            pageSize: articlesPerPage,
            page: currentPage,
          });
          if (
            response.data &&
            response.data.Note ===
              "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency."
          ) {
            authStore.setAlert({
              open: true,
              message: "API call limit exceeded. Please try again in a minute",
              type: "error",
            });
          }
          const { data } = response;
          const feed = data?.feed || [];
          setTopicNewsCache((prevCache) => ({
            ...prevCache,
            [topic]: feed,
          }));
          newsStore.setNews(feed);
        } catch (error) {
          authStore.setAlert({
            open: true,
            message: "Unable to fetch news currently. Please refresh or try again later",
            type: "error",
          });
        }
      }
    },
    [articlesPerPage, currentPage, topicNewsCache]
  );

  const paginate = (
    array: NewsItem[],
    pageNumber: number,
    pageSize: number
  ) => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return array.slice(startIndex, endIndex);
  };

  useEffect(() => {
    fetchNews(newsStore.selectedTopic);
  }, []);

  const handleTopicChange = (
    _event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    const selectedTopic = topics_array[newValue];
    newsStore.setSelectedTopic(selectedTopic);
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

  return (
    <Box className="newspage-main">
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
          onClick={() => setIsSearchFocused(true)}
          className="news-searchbar-icon"
          style={{
            visibility: isSearchFocused ? "hidden" : "visible",
            display: isSmallScreen ? "none" : "",
          }}
        >
          <SearchNormal1 size={36} />
        </IconButton>
      </Box>
      <Box className="news-searchgenre">
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
              }}
            />
          ))}
        </Tabs>
      </Box>
      {filteredNews.length === 0 ? (
        <Box className="loading-box">
          <img src={theme.palette.mode === "dark" ? loading2 : loading} className="loading"></img>
        </Box>
      ) : (
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
                    key={article?.url}
                  >
                    <Box className="news-imagebox">
                      <img
                        className="news-image"
                        src={article?.banner_image || placeholder}
                        alt={article?.title}
                      />
                    </Box>
                    <Box className="news-textbox">
                      <Typography
                        variant="h5"
                        style={{
                          color: theme.palette.text.primary,
                          fontSize: "20px",
                        }}
                      >
                        {article?.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        style={{
                          color: theme.palette.text.secondary,
                          fontSize: "16px",
                        }}
                      >
                        {article?.summary}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        Author(s):{" "}
                        {article.authors.map((author, index) => (
                          <span key={index}>
                            {author}
                            {index < article.authors.length - 1 && ", "}
                          </span>
                        ))}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        Topic(s):{" "}
                        {article.topics.map((topic, index) => (
                          <span key={index}>
                            {topic?.topic}
                            {index < article.topics.length - 1 && ", "}
                          </span>
                        ))}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        {article?.source} - {article?.source_domain}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          color: theme.palette.text.secondary,
                          fontSize: "10px",
                        }}
                      >
                        {dateTime.toLocaleString()}
                      </Typography>
                    </Box>
                  </Link>
                );
              }
            }
          )}
        </Box>
      )}
      <Box className="newspaginate-btngroup">
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1 || filteredNews.length === 0}
          className="newspaginate-btn"
          sx={{
            margin: "10px",
            padding: "10px 20px",
            width: "120px",
            backgroundColor: "#0033ff",
            color: "white",
            borderRadius: "10px",
          }}
          variant="contained"
        >
          Previous
        </Button>
        <Button
          onClick={goToNextPage}
          disabled={
            newsStore.news.length < articlesPerPage ||
            paginate(filteredNews, currentPage, articlesPerPage).length === 0 ||
            filteredNews.length === 0
          }
          className="newspaginate-btn"
          sx={{
            margin: "10px",
            padding: "10px 20px",
            width: "120px",
            backgroundColor: "#0033ff",
            color: "white",
            borderRadius: "10px",
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
