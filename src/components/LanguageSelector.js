import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { language, switchLanguage, getAvailableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = (newLanguage) => {
    switchLanguage(newLanguage);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <div className="language-selector">
      <button 
        className="language-button"
        onClick={toggleDropdown}
        aria-label={t('language.selector')}
      >
        <Globe size={16} />
        <span className="language-current">{currentLanguage?.name || language.toUpperCase()}</span>
        <svg 
          className={`language-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8"
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {availableLanguages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${lang.code === language ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
      
      {/* 点击外部关闭下拉菜单 */}
      {isOpen && (
        <div 
          className="language-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;