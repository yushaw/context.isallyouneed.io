import React, { useState, useCallback } from 'react';
import '../index.css';
import Header from '../components/Header';
import UrlInputBox from '../components/UrlInputBox';
import ContextOutputBox from '../components/ContextOutputBox';
import Footer from '../components/Footer';
import { Trash2, Globe } from 'lucide-react';

const UrlPage = () => {
  const [contextText, setContextText] = useState('');
  const [processedUrls, setProcessedUrls] = useState([]);

  const handleUrlProcessed = useCallback((content, url) => {
    // Generate context text directly instead of opening new window
    const generatedContext = `## Content from URL: ${url}\n\n${content}`;
    setContextText(generatedContext);
    
    // Add to processed URLs list
    const urlData = { url, content, size: content.length };
    setProcessedUrls([urlData]); // For URLs, we typically only show the latest one
  }, []);

  const handleClearContext = useCallback(() => {
    setContextText('');
    setProcessedUrls([]);
  }, []);

  return (
    <div className="container">
      <Header />
      <main className="main-content-single">
        <UrlInputBox onUrlFetched={handleUrlProcessed} />
        
        {/* Sources section for URLs */}
        {processedUrls.length > 0 && (
          <div className="bento-box sources-box">
            <div className="box-header">
              <Globe />
              <h2>Source URL</h2>
              <button className="clear-all-btn" onClick={handleClearContext}>
                <Trash2 size={16} />
                Clear
              </button>
            </div>
            <div className="sources-list">
              {processedUrls.map((urlData, index) => (
                <div key={index} className="source-item">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="source-checkbox"
                  />
                  <span className="source-name">{urlData.url}</span>
                  <span className="source-size">{(urlData.size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <ContextOutputBox 
          contextText={contextText}
        />
      </main>
      <Footer />
    </div>
  );
};

export default UrlPage;