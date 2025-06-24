import React from 'react';
import { useLanguage } from '../contexts/SimpleLanguageContext';

const TestPage = () => {
  const { t, language, switchLanguage } = useLanguage();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>翻译测试页面</h1>
      <p>当前语言: {language}</p>
      
      <button onClick={() => switchLanguage('en')}>English</button>
      <button onClick={() => switchLanguage('zh')}>中文</button>
      
      <div style={{ marginTop: '20px' }}>
        <h2>翻译结果:</h2>
        <p>files: {t('files')}</p>
        <p>url: {t('url')}</p>
        <p>url.title: {t('url.title')}</p>
        <p>files.sources.title: {t('files.sources.title')}</p>
      </div>
    </div>
  );
};

export default TestPage;