import { action, makeObservable, observable } from "mobx";

export interface NewsItem {
    title: string;
    summary: string;
    banner_image: string;
    url: string;
    source: string;
    time_published: string; 
    source_domain: string;
    authors: [ string ];
    topics: [{
      topic: string;
    }]
}

export const topics_array = ['all', 'blockchain', 'earnings', 'mergers_and_acquisitions', 'financial_markets', 'economy_fiscal', 'economy_monetary', 'economy_macro', 'energy_transportation', 'finance', 'life_sciences', 'manufacturing', 'real_estate', 'retail_wholesale', 'technology'];

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

    setSelectedTopic(selectedTopic: string){
        this.selectedTopic = selectedTopic;
    }
}


const newsStore = new NewsStore();

export default newsStore;