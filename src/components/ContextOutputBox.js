import React from 'react';
import './ContextOutputBox.css';
import { ClipboardCheck, Copy, Download } from 'lucide-react';

const ContextOutputBox = ({ contextText, onDownloadContext }) => {

  const handleCopyContext = () => {
    if (contextText) {
      navigator.clipboard.writeText(contextText)
        .then(() => alert("Context copied to clipboard!"))
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert("Failed to copy context. See console for details.");
        });
    } else {
      alert("Nothing to copy.");
    }
  };

  const handleDownloadContext = () => {
    if (contextText) {
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
      alert("Nothing to download.");
    }
  };

  return (
    <div className="bento-box context-output-box">
      <div className="box-header">
        <ClipboardCheck />
        <h2>Generated Context</h2>
      </div>
      <div className="context-controls">
        <button onClick={handleCopyContext} disabled={!contextText}>
          <Copy size={18} /> Copy Context
        </button>
        <button className="secondary" onClick={handleDownloadContext} disabled={!contextText}>
          <Download size={18} /> Download
        </button>
      </div>
      <textarea 
        value={contextText}
        placeholder="Processed context will appear here..." 
        readOnly
      ></textarea>
    </div>
  );
};

export default ContextOutputBox; 