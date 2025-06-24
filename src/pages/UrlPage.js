import React, { useState, useCallback } from 'react';
import '../index.css';
import Header from '../components/Header';
import UrlInputBox from '../components/UrlInputBox';
import ContextOutputBox from '../components/ContextOutputBox';
import Footer from '../components/Footer';
import { Download, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/SimpleLanguageContext';

const UrlPage = () => {
  const [contextText, setContextText] = useState('');
  const [processedUrls, setProcessedUrls] = useState([]);
  const { t } = useLanguage();

  const handleUrlProcessed = useCallback((content, url) => {
    // Generate context text directly instead of opening new window
    const generatedContext = `## Content from URL: ${url}\n\n${content}`;
    setContextText(generatedContext);
    
    // Add to processed URLs list
    const urlData = { url, content, size: content.length };
    setProcessedUrls([urlData]); // For URLs, we typically only show the latest one
    
    // 自动滚动到结果区域，并添加视觉提示
    setTimeout(() => {
      const contextElement = document.querySelector('.context-output-box');
      if (contextElement) {
        // 添加闪烁动画提示用户注意
        contextElement.style.transition = 'all 0.3s ease';
        contextElement.style.transform = 'scale(1.02)';
        contextElement.style.boxShadow = '0 8px 32px rgba(0, 124, 186, 0.3)';
        
        // 滚动到视图
        contextElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // 恢复原始样式
        setTimeout(() => {
          contextElement.style.transform = 'scale(1)';
          contextElement.style.boxShadow = '';
        }, 1000);
      }
    }, 100); // 短延迟确保DOM已更新
  }, []);

  const handleDownloadContext = useCallback(() => {
    if (contextText) {
      const blob = new Blob([contextText], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 16).replace('T', '-').replace(':', '');
      link.download = `url-context-${timestamp}.md`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert(t('files.context.nothing.download'));
    }
  }, [contextText, t]);

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
              <h2>{t('url.sources.title')}</h2>
              <button className="clear-all-btn" onClick={handleDownloadContext} disabled={!contextText}>
                <Download size={16} />
                {t('url.sources.download')}
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
        
        {contextText && (
          <ContextOutputBox 
            contextText={contextText}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UrlPage;