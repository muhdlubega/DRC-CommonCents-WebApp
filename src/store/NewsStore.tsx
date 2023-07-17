import { action, makeObservable, observable } from "mobx";
import { topics_array } from "../arrays/NewsTopicArray";

export interface NewsItem {
  title: string;
  summary: string;
  banner_image: string;
  url: string;
  source: string;
  time_published: string;
  source_domain: string;
  authors: [string];
  topics: [
    {
      topic: string;
    }
  ];
}

class NewsStore {
  news: NewsItem[] = [];
  selectedTopic: string = topics_array[0];

  constructor() {
    makeObservable(this, {
      news: observable,
      selectedTopic: observable,
      setNews: action.bound,
      setSelectedTopic: action.bound,
    });
  }

  setNews(news: NewsItem[]) {
    this.news = news;
  }

  setSelectedTopic(selectedTopic: string) {
    this.news = []
    this.selectedTopic = selectedTopic;
  }
}

const newsStore = new NewsStore();

export default newsStore;
