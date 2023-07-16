import volatilityone from "../assets/images/market/1HZ10V.svg";
import volatilitytwo from "../assets/images/market/1HZ25V.svg";
import volatilitythree from "../assets/images/market/1HZ50V.svg";
import volatilityfour from "../assets/images/market/1HZ75V.svg";
import volatilityfive from "../assets/images/market/1HZ100V.svg";
import volatilitysix from "../assets/images/market/R_10.svg";
import volatilityseven from "../assets/images/market/R_25.svg";
import volatilityeight from "../assets/images/market/R_50.svg";
import volatilitynine from "../assets/images/market/R_75.svg";
import volatilityten from "../assets/images/market/R_100.svg";
import jumpone from "../assets/images/market/JD_10.svg";
import jumptwo from "../assets/images/market/JD_25.svg";
import jumpthree from "../assets/images/market/JD_50.svg";
import jumpfour from "../assets/images/market/JD_75.svg";
import jumpfive from "../assets/images/market/JD_100.svg";
import bear from "../assets/images/market/RDBEAR.svg";
import bull from "../assets/images/market/RDBULL.svg";

export const MarketSymbols: { [key: string]: string } = {
  "1HZ10V": volatilityone,
  "1HZ25V": volatilitytwo,
  "1HZ50V": volatilitythree,
  "1HZ75V": volatilityfour,
  "1HZ100V": volatilityfive,
  R_10: volatilitysix,
  R_25: volatilityseven,
  R_50: volatilityeight,
  R_75: volatilitynine,
  R_100: volatilityten,
  JD10: jumpone,
  JD25: jumptwo,
  JD50: jumpthree,
  JD75: jumpfour,
  JD100: jumpfive,
  RDBEAR: bear,
  RDBULL: bull,
};

export const MarketName: { [key: string]: string } = {
  "1HZ10V": "Volatility 10 (1s) Index",
  "1HZ25V": "Volatility 25 (1s) Index",
  "1HZ50V": "Volatility 50 (1s) Index",
  "1HZ75V": "Volatility 75 (1s) Index",
  "1HZ100V": "Volatility 100 (1s) Index",
  R_10: "Volatility 10 Index",
  R_25: "Volatility 25 Index",
  R_50: "Volatility 50 Index",
  R_75: "Volatility 75 Index",
  R_100: "Volatility 100 Index",
  JD10: "Jump 10 Index",
  JD25: "Jump 25 Index",
  JD50: "Jump 50 Index",
  JD75: "Jump 75 Index",
  JD100: "Jump 100 Index",
  RDBEAR: "Bear Market Index",
  RDBULL: "Bull Market Index",
};

export const id_array = ["1HZ10V", "1HZ25V", "1HZ50V", "1HZ75V", "1HZ100V"];

export const id_volatility_index = ["R_10", "R_25", "R_50", "R_75", "R_100"];

export const id_jump_index = ["JD10", "JD25", "JD50", "JD75", "JD100"];

export const id_bear_bull = ["RDBEAR", "RDBULL"];