import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactGA4 from 'react-ga4';
import Home from './pages/Home';
import Table from './pages/Table';

const initializeGA4 = async () => {
  const measurementId = 'G-3Q5XMQGSMG';
  try {
    await ReactGA4.initialize(measurementId);
  } catch (error) {
    console.error('Failed to initialize GA4:', error);
  }
};

function App() {
  useEffect(() => {
    initializeGA4();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/table" element={<Table />}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
