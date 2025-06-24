import React from 'react';
import './Footer.css';
import { useLanguage } from '../contexts/SimpleLanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="app-footer">
      <p>&copy; 2025 {t('footer.text')}</p>
    </footer>
  );
};

export default Footer; 