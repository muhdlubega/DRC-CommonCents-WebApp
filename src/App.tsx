import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Alert from './components/authentication/Alert';
import Footer from './components/homepage/Footer';
import Navbar from './components/navbar/Navbar';
// import themeStore from './store/ThemeStore';
import './styles/main.scss'
import { observer } from 'mobx-react-lite';

const LazyHomePage = lazy(() => import("./pages/HomePage"));
const LazyTradePage = lazy(() => import("./pages/TradePage"));
const LazyNewsPage = lazy(() => import("./pages/NewsPage"));
const LazyForumPage = lazy(() => import("./pages/ForumPage"));
const LazyAboutPage = lazy(() => import("./pages/AboutPage"));
const LazyAccountPage = lazy(() => import("./pages/AccountPage"));
const LazyLeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const LazyErrorPage = lazy(() => import("./pages/Error"));

interface AppProps {
  themeStore: any;
}

function App({ themeStore }: AppProps) {
  return (
    <div className={themeStore?.mode}>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Suspense fallback={<div>Loading..</div>}><LazyHomePage /></Suspense>}></Route>
        <Route path="/trade/:id" element={<Suspense fallback={<div>Loading..</div>}><LazyTradePage /></Suspense>}></Route>
        <Route path="/news" element={<Suspense fallback={<div>Loading..</div>}><LazyNewsPage /></Suspense>}></Route>
        <Route path="/forum" element={<Suspense fallback={<div>Loading..</div>}><LazyForumPage /></Suspense>}></Route>
        <Route path="/about" element={<Suspense fallback={<div>Loading..</div>}><LazyAboutPage /></Suspense>}></Route>
        <Route path="/account" element={<Suspense fallback={<div>Loading..</div>}><LazyAccountPage /></Suspense>}></Route>
        <Route path="/leaderboard" element={<Suspense fallback={<div>Loading..</div>}><LazyLeaderboardPage /></Suspense>}></Route>
        <Route path="/*" element={<Suspense fallback={<div>Loading..</div>}><LazyErrorPage /></Suspense>}></Route>
      </Routes>
      <Footer/>
      <Alert/>
    </BrowserRouter>
    </div>
  );
}

export default observer(App);
