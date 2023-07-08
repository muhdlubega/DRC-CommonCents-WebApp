import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Alert from './components/authentication/Alert';
import Footer from './components/homepage/Footer';
import Navbar from './components/navbar/Navbar';
// import themeStore from './store/ThemeStore';
import './styles/main.scss'
import { observer } from 'mobx-react-lite';
import authStore from './store/AuthStore';

const LazyHomePage = lazy(() => import("./pages/HomePage"));
const LazyTradePage = lazy(() => import("./pages/TradePage"));
const LazyNewsPage = lazy(() => import("./pages/NewsPage"));
const LazyForumPage = lazy(() => import("./pages/ForumPage"));
const LazyAboutPage = lazy(() => import("./pages/AboutPage"));
const LazyAccountPage = lazy(() => import("./pages/AccountPage"));
const LazyLeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));
const LazyEnquiryPage = lazy(() => import("./pages/Enquiry"));
const LazyFAQPage = lazy(() => import("./pages/FAQ"));
const LazyLoginAccessPage = lazy(() => import("./pages/LoginAccess"));
const LazyTradeHistoryPage = lazy(() => import("./pages/TradeHistoryPage"));
const LazyErrorPage = lazy(() => import("./pages/Error"));
const LazyEnquiryPage = lazy(() => import("./pages/Enquiry"));
const LazyFAQPage = lazy(() => import("./pages/FAQ"));

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
        <Route path="/enquiry" element={<Suspense fallback={<div>Loading..</div>}><LazyEnquiryPage /></Suspense>}></Route>
        <Route path="/faq" element={<Suspense fallback={<div>Loading..</div>}><LazyFAQPage /></Suspense>}></Route>
        <Route path="/account" element={authStore.user ? <Suspense fallback={<div>Loading..</div>}><LazyAccountPage /></Suspense> : <Suspense fallback={<div>Loading..</div>}><LazyLoginAccessPage /></Suspense> }></Route>
        <Route path="/leaderboard" element={authStore.user ? <Suspense fallback={<div>Loading..</div>}><LazyLeaderboardPage /></Suspense> : <Suspense fallback={<div>Loading..</div>}><LazyLoginAccessPage /></Suspense>}></Route>
        <Route path="/trade-history" element={authStore.user ? <Suspense fallback={<div>Loading..</div>}><LazyTradeHistoryPage /></Suspense> : <Suspense fallback={<div>Loading..</div>}><LazyLoginAccessPage /></Suspense>}></Route>
        <Route path="/*" element={<Suspense fallback={<div>Loading..</div>}><LazyErrorPage /></Suspense>}></Route>
        <Route path="/enquiry" element={<Suspense fallback={<div>Loading..</div>}><LazyEnquiryPage /></Suspense>}></Route>
        <Route path="/faq" element={<Suspense fallback={<div>Loading..</div>}><LazyFAQPage /></Suspense>}></Route>

      </Routes>
      <Footer/>
      <Alert/>
    </BrowserRouter>
    </div>
  );
}

export default observer(App);
