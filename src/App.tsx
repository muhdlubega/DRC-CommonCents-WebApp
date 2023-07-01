import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Alert from './components/authentication/Alert';
import Footer from './components/homepage/Footer';
import Navbar from './components/navbar/Navbar';

const LazyHomePage = lazy(() => import("./pages/HomePage"));
const LazyTradePage = lazy(() => import("./pages/TradePage"));
const LazyNewsPage = lazy(() => import("./pages/NewsPage"));
const LazyAboutPage = lazy(() => import("./pages/AboutPage"));


function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Suspense fallback={<div>Loading..</div>}><LazyHomePage /></Suspense>}></Route>
        <Route path="/trade/:id" element={<Suspense fallback={<div>Loading..</div>}><LazyTradePage /></Suspense>}></Route>
        <Route path="/news" element={<Suspense fallback={<div>Loading..</div>}><LazyNewsPage /></Suspense>}></Route>
        <Route path="/about" element={<Suspense fallback={<div>Loading..</div>}><LazyAboutPage /></Suspense>}></Route>
      </Routes>
      <Footer/>
      <Alert/>
    </BrowserRouter>
  );
}

export default App;
