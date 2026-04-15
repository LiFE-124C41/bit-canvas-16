import React from 'react';
import { Trash2 } from 'lucide-react';

interface ControlsProps {
  onClear: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onClear }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <button className="btn btn-secondary" onClick={onClear}>
        <Trash2 size={18} />
        キャンバスをクリア
      </button>
    </div>
  );
};
