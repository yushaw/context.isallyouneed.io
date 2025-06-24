import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import FilesPage from './pages/FilesPage';
import UrlPage from './pages/UrlPage';
import ResultsPage from './pages/ResultsPage';
import SimplePage from './pages/SimplePage';
import './pages/SimplePage.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FilesPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/url" element={<UrlPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/simple" element={<SimplePage />} />
      </Routes>
    </Router>
  );
}

export default App; 