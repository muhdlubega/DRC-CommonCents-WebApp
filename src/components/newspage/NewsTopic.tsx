import { useEffect, useState } from "react";
import { Box, Button, Typography } from '@mui/material';
import { getNewsTopics } from "../../config/NewsApi";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import newsStore, { NewsItem, topics_array } from "../../store/NewsStore";
import '../../styles/main.scss';


const NewsTopic = observer(() => {
  // const [news, setNews] = useState<NewsItem[]>([]);
  // const [selectedTopic, setSelectedTopic] = useState<string>(topics_array[0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 20;

  const fetchNews = async (topic: string) => {
    try {
      const response = await getNewsTopics({ topic, pageSize: articlesPerPage, page: currentPage });
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
  };
  
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Typography variant="h6">Check Out More News</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        {topics_array.map((topic, index) => (
          <Button
            key={index}
            variant={topic === newsStore.selectedTopic ? 'contained' : 'outlined'}
            onClick={() => handleTopicChange(topic)}
            sx={{ mx: 1 }}
          >
            {topic}
          </Button>
        ))}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {paginate(newsStore.news, currentPage, articlesPerPage).map((article: NewsItem | null) => {
          if (!article) return null;
          return (
            <Link className="news-card" to={article?.url} key={article?.title}>
              <img className="news-image" src={article?.banner_image} alt={article?.title} />
              <Box sx={{ mt: 1 }}>
                <Typography variant="h6">{article?.title}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Author(s):{' '}
                  {article.authors.map((author, index) => (
                    <span key={index}>
                      {author}
                      {index < article.authors.length - 1 && ', '}
                    </span>
                  ))}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {article?.summary}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Topic(s):{' '}
                  {article.topics.map((topic, index) => (
                    <span key={index}>
                      {topic?.topic}
                      {index < article.topics.length - 1 && ', '}
                    </span>
                  ))}
                </Typography>
                <Typography variant="body1">{article?.source}</Typography>
                <Typography variant="body1">{article?.source_domain}</Typography>
              </Box>
            </Link>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          sx={{ mx: 1 }}
          variant="contained"
        >
          Previous
        </Button>
        <Button
          onClick={goToNextPage}
          disabled={newsStore.news.length < articlesPerPage}
          sx={{ mx: 1 }}
          variant="contained"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
});

export default NewsTopic;