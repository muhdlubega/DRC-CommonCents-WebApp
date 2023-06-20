import axios from "axios";

const BASE_URL = "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&sort=LATEST";
// const API_KEY : string | undefined = process.env.REACT_APP_NEWS_API;
const API_KEY = "Z26XD7498452R9SL";

export const getNews = () => {
  return axios.get(`${BASE_URL}&apikey=${API_KEY}`);
};
