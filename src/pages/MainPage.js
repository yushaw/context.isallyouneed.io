import React, { useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom'; // useNavigate not strictly needed if using window.open
import '../App.css'; // Assuming App.css contains the bento grid styles
import '../index.css'; // Global styles
import Header from '../components/Header';
import CodeInputBox from '../components/CodeInputBox';
import UrlInputBox from '../components/UrlInputBox';
// ContextOutputBox is removed from main page as per new flow
import SettingsBox from '../components/SettingsBox';
import Footer from '../components/Footer';

const MainPage = () => {
  // const navigate = useNavigate(); // Not using navigate for new tab directly
  const [processedFilesInfo, setProcessedFilesInfo] = useState([]); // To reset CodeInputBox via key

  const handleUrlProcessed = useCallback((content, url) => {
    const dataToPass = { type: 'url', content, url };
    const dataKey = `context_data_url_${Date.now()}`;
    sessionStorage.setItem(dataKey, JSON.stringify(dataToPass));
    window.open(`${window.location.origin}/results?dataKey=${dataKey}`, '_blank').focus();
  }, []);

  const handleFilesDataProcessed = useCallback((fileContents) => {
    if (fileContents && fileContents.length > 0) {
      const dataKey = `context_data_files_${Date.now()}`;
      sessionStorage.setItem(dataKey, JSON.stringify(fileContents));
      window.open(`${window.location.origin}/results?dataKey=${dataKey}`, '_blank').focus();
      setProcessedFilesInfo(fileContents.map(f => ({ name: f.name, size: f.size }))); // Update for CodeInputBox key reset
    }
  }, []);

  // handleClearContext is no longer needed here as context is not displayed on this page.
  // CodeInputBox will reset via key when new files are processed (or App.js can provide a general clear key).

  return (
    <div className="container">
      <Header />
      <main className="bento-grid">
        <CodeInputBox onFilesProcessed={handleFilesDataProcessed} key={processedFilesInfo.map(f => f.name).join('-')} />
        <UrlInputBox onUrlFetched={handleUrlProcessed} />
        {/* ContextOutputBox is removed from here */}
        <SettingsBox />
      </main>
      <Footer />
    </div>
  );
};

export default MainPage; 