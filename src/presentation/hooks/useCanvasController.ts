import { useState, useMemo, useCallback } from 'react';
import { PixelMap, type PixelValue } from '../../domain/models/PixelMap';
import { CanvasUseCase } from '../../usecase/CanvasUseCase';
import { LocalStoragePixelMapRepository } from '../../infrastructure/localStorage/PixelMapRepository';

export function useCanvasController() {
  const useCase = useMemo(() => {
    const repository = new LocalStoragePixelMapRepository();
    return new CanvasUseCase(repository);
  }, []);

  const [pixelMap, setPixelMap] = useState<PixelMap>(() => useCase.loadOrInitializeCanvas());
  
  // 連続描画用の状態
  const [isDrawing, setIsDrawing] = useState(false);
  const [paintValue, setPaintValue] = useState<PixelValue>(1);

  const startDrawing = useCallback((x: number, y: number) => {
    setIsDrawing(true);
    // クリックした最初のピクセルの反転後の色を記憶し、ドラッグ中はその色で塗る
    const currentVal = pixelMap.getPixel(x, y);
    const newVal: PixelValue = currentVal === 0 ? 1 : 0;
    setPaintValue(newVal);

    setPixelMap(prevMap => useCase.setPixel(prevMap, x, y, newVal));
  }, [pixelMap, useCase]);

  const continueDrawing = useCallback((x: number, y: number) => {
    if (!isDrawing) return;
    setPixelMap(prevMap => {
      // 既に同じ色なら再生成を避ける
      if (prevMap.getPixel(x, y) === paintValue) {
        return prevMap;
      }
      return useCase.setPixel(prevMap, x, y, paintValue);
    });
  }, [isDrawing, paintValue, useCase]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    setPixelMap(() => useCase.clearCanvas());
  }, [useCase]);

  const importCanvas = useCallback((text: string) => {
    setPixelMap(() => useCase.importCanvas(text));
  }, [useCase]);

  const outputText = useCase.generateMapOutput(pixelMap);

  return {
    pixelMap,
    isDrawing,
    outputText,
    startDrawing,
    continueDrawing,
    stopDrawing,
    clearCanvas,
    importCanvas
  };
}
