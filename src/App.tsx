
import { useCanvasController } from './presentation/hooks/useCanvasController';
import { Canvas } from './ui/components/Canvas';
import { Controls } from './ui/components/Controls';
import { OutputPanel } from './ui/components/OutputPanel';

function App() {
  const {
    pixelMap,
    outputText,
    startDrawing,
    continueDrawing,
    stopDrawing,
    clearCanvas
  } = useCanvasController();

  // マウスがコンテナ外に出た時も描画状態をリセットするためのイベントハンドラ
  const handleGlobalPointerUp = () => {
    stopDrawing();
  };

  return (
    <div className="app-container" onPointerUp={handleGlobalPointerUp} onPointerLeave={handleGlobalPointerUp}>
      <div className="canvas-section">
        <h1 className="title">Bit Canvas 16</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
          ドラッグ＆ドロップでドット絵を描き、右側のパネルからマップを出力します。
        </p>
        <Canvas 
          pixelMap={pixelMap}
          onStartDrawing={startDrawing}
          onContinueDrawing={continueDrawing}
          onStopDrawing={stopDrawing}
        />
        <div style={{ marginTop: '2rem', width: '100%' }}>
          <Controls onClear={clearCanvas} />
        </div>
      </div>
      <div className="controls-section">
        <OutputPanel outputText={outputText} />
      </div>
    </div>
  );
}

export default App;
