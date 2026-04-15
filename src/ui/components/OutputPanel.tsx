import React, { useState, useEffect } from 'react';
import { Copy, Check, Upload } from 'lucide-react';

interface OutputPanelProps {
  outputText: string;
  onImport: (text: string) => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ outputText, onImport }) => {
  const [copied, setCopied] = useState(false);
  const [localText, setLocalText] = useState(outputText);

  useEffect(() => {
    setLocalText(outputText);
  }, [outputText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleImport = () => {
    onImport(localText);
  };

  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>0/1 Map Output</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={handleImport} title="テキストエリアの内容をキャンバスに反映">
            <Upload size={18} />
            反映
          </button>
          <button className="btn" onClick={handleCopy} title="現在のマップをコピー">
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <textarea 
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        className="output-textarea"
        title="0と1の文字列を入力して反映できます"
      />
    </div>
  );
};
