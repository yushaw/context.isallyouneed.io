import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { BoxSelect, FileText, Globe } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <header className="app-header">
      <h1><BoxSelect className="icon-header" /> LLM Context Builder</h1>
      <p>Prepare context for your Large Language Models, all in your browser.</p>
      <nav className="header-nav">
        <Link 
          to="/files" 
          className={`nav-link ${location.pathname === '/' || location.pathname === '/files' ? 'active' : ''}`}
        >
          <FileText size={16} />
          Files
        </Link>
        <Link 
          to="/url" 
          className={`nav-link ${location.pathname === '/url' ? 'active' : ''}`}
        >
          <Globe size={16} />
          URL
        </Link>
      </nav>
    </header>
  );
};

export default Header; 