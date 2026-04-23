import React, { useState, useEffect } from 'react';
import { Copy, Check, Upload, Link as LinkIcon } from 'lucide-react';

interface OutputPanelProps {
  outputText: string;
  shareUrl?: string;
  onImport: (text: string) => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ outputText, shareUrl, onImport }) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
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

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
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
      
      {shareUrl && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#cbd5e1' }}>Share Link</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #334155',
                background: '#0f172a',
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button className="btn" onClick={handleCopyLink} title="共有リンクをコピー">
              {linkCopied ? <Check size={18} /> : <LinkIcon size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
