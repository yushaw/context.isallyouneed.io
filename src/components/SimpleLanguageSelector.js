import React from 'react';
import { useLanguage } from '../contexts/SimpleLanguageContext';
import { Globe } from 'lucide-react';

const SimpleLanguageSelector = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Globe size={16} />
      <select 
        value={language} 
        onChange={(e) => switchLanguage(e.target.value)}
        style={{
          padding: '4px 8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          background: 'white',
          fontSize: '14px'
        }}
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
};

export default SimpleLanguageSelector;