import axios from "axios";

export type Query = {
  topic?: string;
  pageSize?: number;
  page?: number;
}

const BASE_URL = "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&limit=1000";
const API_KEY : string | undefined = import.meta.env.VITE_NEWS_API;

export const getNews = () => {
  return axios.get(`${BASE_URL}&sort=LATEST&apikey=${API_KEY}`);
};

export const getNewsTopics = ({topic}: Query) => {
  return axios.get(`${BASE_URL}&sort=RELEVANCE&topics=${topic}&apikey=${API_KEY}`);
};

