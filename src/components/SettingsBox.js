import React from 'react';
import './SettingsBox.css';
import { SlidersHorizontal } from 'lucide-react';

const SettingsBox = () => {

  return (
    <div className="bento-box settings-box">
      <div className="box-header">
        <SlidersHorizontal />
        <h2>Options</h2>
      </div>
      <p className="box-description">Adjust processing parameters.</p>
      <div className="options-content">
        <p className="coming-soon">More options coming soon!</p>
      </div>
    </div>
  );
};

export default SettingsBox; 