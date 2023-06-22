import { useEffect, useState } from "react";
import { getNewsTopics } from "../../config/NewsApi";
import { Link } from "react-router-dom";
import '../../styles/main.scss';

interface NewsItem {
  title: string;
  summary: string;
  banner_image: string;
  url: string;
  source: string;
  source_domain: string;
  authors: [ string ];
  topics: [{
    topic: string;
  }]
}

const topics_array = ['blockchain', 'earnings', 'ipo', 'mergers_and_acquisitions', 'financial_markets', 'economy_fiscal', 'economy_monetary', 'economy_macro', 'energy_transportation', 'finance', 'life_sciences', 'manufacturing', 'real_estate', 'retail_wholesale', 'technology'];

const NewsTopic = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>(topics_array[0]);

  const fetchNews = async (topic: string) => {
    try {
      const response = await getNewsTopics({ topic });
      const { data } = response;
      const feed = data?.feed || [];
      setNews(feed);
      console.log(feed);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews(selectedTopic);
  }, [selectedTopic]);

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
  };

  return (
    <div>
      <span className="news-span">
        <div>Check Out More News</div>
      </span>
      <div className="topic-buttons">
        {topics_array.map((topic, index) => (
          <button
            key={index}
            onClick={() => handleTopicChange(topic)}
            className={topic === selectedTopic ? "active" : ""}
          >
            {topic}
          </button>
        ))}
      </div>
      <div className="news-container">
        {news.map((article: NewsItem | null) => {
          if (!article) return null;
          return (
            <Link
              className="news-card"
              to={article?.url}
              key={article?.title}
            >
              <img className="news-image" src={article?.banner_image} alt={article?.title} />
              <div>
                <div>{article?.title}</div>
                <div>
                  Author(s): {article.authors.map((author, index) => (
                    <span key={index}>{author}{index < article.authors.length - 1 && ", "}</span>
                  ))}
                </div>
                <div>{article?.summary}</div>
                <div>
                  Topic(s): {article.topics.map((topic, index) => (
                    <span key={index}>
                      {topic?.topic}
                      {index < article.topics.length - 1 && ", "}
                    </span>
                  ))}
                </div>
                <div>{article?.source}</div>
                <div>{article?.source_domain}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NewsTopic;
