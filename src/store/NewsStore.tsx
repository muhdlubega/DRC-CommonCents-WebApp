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

export const topics_array = ['blockchain', 'earnings', 'mergers_and_acquisitions', 'financial_markets', 'economy_fiscal', 'economy_monetary', 'economy_macro', 'energy_transportation', 'finance', 'life_sciences', 'manufacturing', 'real_estate', 'retail_wholesale', 'technology'];

class NewsStore {
    news: NewsItem[] = [];
    selectedTopic: string = topics_array[0];
    // currentPage: any = 1;
    // articlesPerPage: number = 20;
  
    constructor() {
      makeObservable(this, {
        news: observable,
        selectedTopic: observable,
        // currentPage: observable,
        // articlesPerPage: observable,
        setNews: action.bound,
        setSelectedTopic: action.bound,
        // setCurrentPage: action.bound
      });
    }

    setNews(news: NewsItem[]) {
        this.news = news;
    }

    setSelectedTopic(selectedTopic: string){
        this.selectedTopic = selectedTopic;
    }

    // setCurrentPage(currentPage: any){
    //     this.currentPage = currentPage;
    // }
}


const newsStore = new NewsStore();

export default newsStore;