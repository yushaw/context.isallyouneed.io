import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, text = 'Loading...', className = '' }) => {
  return (
    <div className={`loading-spinner ${className}`} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '20px',
      color: '#6c757d'
    }}>
      <Loader2 size={size} className="spinner" style={{
        animation: 'spin 1s linear infinite'
      }} />
      <span>{text}</span>
    </div>
  );
};

export default LoadingSpinner;