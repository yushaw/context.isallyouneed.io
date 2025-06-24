import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { LanguageProvider } from './contexts/SimpleLanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import FilesPage from './pages/FilesPage';
import UrlPage from './pages/UrlPage';
import ResultsPage from './pages/ResultsPage';
import SimplePage from './pages/SimplePage';
import TestPage from './pages/TestPage';
import './pages/SimplePage.css';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<FilesPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/url" element={<UrlPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/simple" element={<SimplePage />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App; 