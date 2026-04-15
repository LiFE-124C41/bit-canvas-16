import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface OutputPanelProps {
  outputText: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ outputText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>0/1 Map Output</h3>
        <button className="btn" onClick={handleCopy}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <textarea 
        readOnly
        value={outputText}
        className="output-textarea"
        onClick={(e) => e.currentTarget.select()} 
        title="クリックして全選択"
      />
    </div>
  );
};
