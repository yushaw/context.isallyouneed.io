import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { BoxSelect, FileText, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/SimpleLanguageContext';
import SimpleLanguageSelector from './SimpleLanguageSelector';

const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-main">
          <h1><BoxSelect className="icon-header" /> LLM Context Builder</h1>
          <p>Prepare context for your Large Language Models, all in your browser.</p>
        </div>
        <div className="header-actions">
          <SimpleLanguageSelector />
        </div>
      </div>
      <nav className="header-nav">
        <Link 
          to="/files" 
          className={`nav-link ${location.pathname === '/' || location.pathname === '/files' ? 'active' : ''}`}
        >
          <FileText size={16} />
          {t('files')}
        </Link>
        <Link 
          to="/url" 
          className={`nav-link ${location.pathname === '/url' ? 'active' : ''}`}
        >
          <Globe size={16} />
          {t('url')}
        </Link>
      </nav>
    </header>
  );
};

export default Header; 