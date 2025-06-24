import React from 'react';
import './Header.css';
import { BoxSelect } from 'lucide-react';

const Header = () => {
  return (
    <header className="app-header">
      <h1><BoxSelect className="icon-header" /> LLM Context Builder</h1>
      <p>Prepare context for your Large Language Models, all in your browser.</p>
    </header>
  );
};

export default Header; 