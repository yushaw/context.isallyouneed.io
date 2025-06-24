import React from 'react';
import './ContextOutputBox.css';
import { ClipboardCheck, Copy, Trash2 } from 'lucide-react';

const ContextOutputBox = ({ contextText, onClearContext }) => {

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
        <button className="secondary" onClick={onClearContext} disabled={!contextText}>
          <Trash2 size={18} /> Clear
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