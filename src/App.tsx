import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Alert from "./components/authentication/Alert";
import Footer from "./components/homepage/Footer";
import Navbar from "./components/navbar/Navbar";
import "./styles/main.scss";
import { observer } from "mobx-react-lite";
import authStore from "./store/AuthStore";
import loading from "./assets/images/commoncents.svg";
import loading2 from "./assets/images/white-blue-logo.svg";
import { lightTheme, darkTheme, themes } from "./store/ThemeStore";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";

const LazyHomePage = lazy(() => import("./pages/HomePage"));
const LazyTradePage = lazy(() => import("./pages/TradePage"));
const LazyNewsPage = lazy(() => import("./pages/NewsPage"));
const LazyForumPage = lazy(() => import("./pages/ForumPage"));
const LazyAboutPage = lazy(() => import("./pages/AboutPage"));
const LazyAccountPage = lazy(() => import("./pages/AccountPage"));
const LazyFavouritesPage = lazy(() => import("./pages/FavouritesPage"));
const LazyLeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const LazyEnquiryPage = lazy(() => import("./pages/Enquiry"));
const LazyFAQPage = lazy(() => import("./pages/FAQ"));
const LazyLoginAccessPage = lazy(() => import("./pages/LoginAccess"));
const LazyTradeHistoryPage = lazy(() => import("./pages/TradeHistoryPage"));
const LazyErrorPage = lazy(() => import("./pages/Error"));

interface AppProps {
  themeStore: { mode: string };
}

function App({ themeStore }: AppProps) {
  const theme = themeStore.mode === themes.dark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
    <div className={themeStore?.mode}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                }
              >
                <LazyHomePage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/trade/:id"
            element={
              <Suspense
                fallback={
                  <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                }
              >
                <LazyTradePage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/news"
            element={
              <Suspense
                fallback={
                  <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                }
              >
                <LazyNewsPage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/forum"
            element={
              <Suspense
                fallback={
                  <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                }
              >
                <LazyForumPage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/about"
            element={
              <Suspense
                fallback={
                  <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                }
              >
                <LazyAboutPage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/enquiry"
            element={
              <Suspense
                fallback={
                  <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                }
              >
                <LazyEnquiryPage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/faq"
            element={
              <Suspense
                fallback={
                  <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                }
              >
                <LazyFAQPage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/account"
            element={
              authStore.user ? (
                <Suspense
                  fallback={
                    <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                  }
                >
                  <LazyAccountPage />
                </Suspense>
              ) : (
                <Suspense
                  fallback={
                    <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                  }
                >
                  <LazyLoginAccessPage />
                </Suspense>
              )
            }
          ></Route>
          <Route
            path="/favourites"
            element={
              authStore.user ? (
                <Suspense
                  fallback={
                    <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                  }
                >
                  <LazyFavouritesPage />
                </Suspense>
              ) : (
                <Suspense
                  fallback={
                    <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                  }
                >
                  <LazyLoginAccessPage />
                </Suspense>
              )
            }
          ></Route>
          <Route
            path="/leaderboard"
            element={
              authStore.user ? (
                <Suspense
                  fallback={
                    <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                  }
                >
                  <LazyLeaderboardPage />
                </Suspense>
              ) : (
                <Suspense
                  fallback={
                    <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                  }
                >
                  <LazyLoginAccessPage />
                </Suspense>
              )
            }
          ></Route>
          <Route
            path="/trade-history"
            element={
              authStore.user ? (
                <Suspense
                  fallback={
                    <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                  }
                >
                  <LazyTradeHistoryPage />
                </Suspense>
              ) : (
                <Suspense
                  fallback={
                    <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                  }
                >
                  <LazyLoginAccessPage />
                </Suspense>
              )
            }
          ></Route>
          <Route
            path="/*"
            element={
              <Suspense
                fallback={
                  <Box className="loading-box">
                    { theme.palette.mode === "dark" ?
                    <img src={loading2} className="loading"></img> :
                    <img src={loading} className="loading"></img> }
                  </Box>
                }
              >
                <LazyErrorPage />
              </Suspense>
            }
          ></Route>
        </Routes>
        <Footer />
        <Alert />
      </BrowserRouter>
    </div>
    </ThemeProvider>
  );
}

export default observer(App);
