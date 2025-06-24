import React from 'react';
import './ContextOutputBox.css';
import { ClipboardCheck, Copy, Download } from 'lucide-react';
import { useLanguage } from '../contexts/SimpleLanguageContext';

const ContextOutputBox = ({ contextText, onDownloadContext }) => {
  const { t } = useLanguage();

  const handleCopyContext = () => {
    if (contextText) {
      // Track copy event
      if (window.gtag) {
        window.gtag('event', 'context_copy', {
          event_category: 'engagement',
          event_label: 'context_copied'
        });
      }
      
      navigator.clipboard.writeText(contextText)
        .then(() => alert(t('files.context.copied')))
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert(t('files.context.copy.failed'));
        });
    } else {
      alert(t('files.context.nothing.copy'));
    }
  };

  const handleDownloadContext = () => {
    if (contextText) {
      // Track download event
      if (window.gtag) {
        window.gtag('event', 'context_download', {
          event_category: 'engagement',
          event_label: 'context_downloaded'
        });
      }
      
      const blob = new Blob([contextText], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 16).replace('T', '-').replace(':', '');
      link.download = `context-${timestamp}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert(t('files.context.nothing.download'));
    }
  };

  return (
    <div className="bento-box context-output-box">
      <div className="box-header">
        <ClipboardCheck />
        <h2>{t('files.context.title')}</h2>
      </div>
      <div className="context-controls">
        <button onClick={handleCopyContext} disabled={!contextText}>
          <Copy size={18} /> {t('files.context.copy')}
        </button>
        <button className="secondary" onClick={handleDownloadContext} disabled={!contextText}>
          <Download size={18} /> {t('files.context.download')}
        </button>
      </div>
      <textarea 
        value={contextText}
        placeholder={t('files.context.placeholder')} 
        readOnly
      ></textarea>
    </div>
  );
};

export default ContextOutputBox; 