import axios from "axios";

const BASE_URL = "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&sort=LATEST";
const API_KEY : string | undefined = import.meta.env.VITE_NEWS_API;

export const getNews = () => {
  return axios.get(`${BASE_URL}&apikey=${API_KEY}`);
};
