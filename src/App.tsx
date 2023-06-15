import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const LazyHomePage = lazy(() => import("./pages/HomePage"));
const LazyTradePage = lazy(() => import("./pages/TradePage"));


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Suspense fallback={<div>Loading..</div>}><LazyHomePage /></Suspense>}></Route>
        <Route path="/trade/:id" element={<Suspense fallback={<div>Loading..</div>}><LazyTradePage /></Suspense>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
