import React from 'react';
import { PixelMap } from '../../domain/models/PixelMap';

interface CanvasProps {
  pixelMap: PixelMap;
  onStartDrawing: (x: number, y: number) => void;
  onContinueDrawing: (x: number, y: number) => void;
  onStopDrawing: () => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  pixelMap,
  onStartDrawing,
  onContinueDrawing,
  onStopDrawing
}) => {
  const handlePointerDown = (x: number, y: number, e: React.PointerEvent) => {
    // マウスクリックでのドラッグ描画を維持するため、イベントのキャプチャを明示的にリリースする
    e.currentTarget.releasePointerCapture(e.pointerId);
    onStartDrawing(x, y);
  };

  const handlePointerEnter = (x: number, y: number, e: React.PointerEvent) => {
    // 1は左クリックが押されている状態
    if (e.buttons === 1) {
      onContinueDrawing(x, y);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    // ブラウザ固有のドラッグ動作を禁止
    e.preventDefault();
  };

  const data = pixelMap.getData();

  return (
    <div 
      className="grid-container glass-panel"
      onPointerUp={onStopDrawing}
      onPointerLeave={onStopDrawing}
    >
      {data.map((row, y) => 
        row.map((pixel, x) => (
          <div
            key={`${x}-${y}`}
            className="grid-cell"
            data-active={pixel}
            onPointerDown={(e) => handlePointerDown(x, y, e)}
            onPointerEnter={(e) => handlePointerEnter(x, y, e)}
            onPointerDownCapture={(e) => {
              // スマートフォンでのスクロールを抑制しつつ描画を許可
              e.preventDefault();
            }}
            onDragStart={handleDragStart}
          />
        ))
      )}
    </div>
  );
};
