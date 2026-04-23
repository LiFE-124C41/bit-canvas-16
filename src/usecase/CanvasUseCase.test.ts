import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CanvasUseCase } from './CanvasUseCase';
import type { IPixelMapRepository } from '../domain/repositories/IPixelMapRepository';
import { PixelMap } from '../domain/models/PixelMap';

describe('CanvasUseCase', () => {
  let repository: IPixelMapRepository;
  let useCase: CanvasUseCase;

  beforeEach(() => {
    repository = {
      save: vi.fn(),
      load: vi.fn(),
    };
    useCase = new CanvasUseCase(repository);
  });

  describe('loadOrInitializeCanvas', () => {
    it('should return loaded map if repository has data', () => {
      // Arrange
      const existingMap = new PixelMap().setPixel(0, 0, 1);
      (repository.load as any).mockReturnValue(existingMap);

      // Act
      const result = useCase.loadOrInitializeCanvas();

      // Assert
      expect(result).toBe(existingMap);
      expect(repository.load).toHaveBeenCalledTimes(1);
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should create and save a new map if repository is empty', () => {
      // Arrange
      (repository.load as any).mockReturnValue(null);

      // Act
      const result = useCase.loadOrInitializeCanvas();

      // Assert
      expect(result).toBeInstanceOf(PixelMap);
      expect(repository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('togglePixel', () => {
    it('should toggle pixel and save to repository', () => {
      // Arrange
      const initialMap = new PixelMap();

      // Act
      const resultMap = useCase.togglePixel(initialMap, 5, 5);

      // Assert
      expect(resultMap.getPixel(5, 5)).toBe(1);
      expect(repository.save).toHaveBeenCalledWith(resultMap);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('importCanvas', () => {
    it('should create a map from string and save to repository', () => {
      // Arrange
      // 1がいくつか含まれる文字列を用意 (1行目の最初と2行目の最初が1)
      const text = `
        1000000000000000
        1000000000000000
      `;

      // Act
      const resultMap = useCase.importCanvas(text);

      // Assert
      expect(resultMap.getPixel(0, 0)).toBe(1);
      expect(resultMap.getPixel(0, 1)).toBe(1);
      expect(resultMap.getPixel(1, 0)).toBe(0);
      expect(repository.save).toHaveBeenCalledWith(resultMap);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearCanvas', () => {
    it('should clear canvas and save to repository', () => {
      // Arrange

      // Act
      const clearedMap = useCase.clearCanvas();

      // Assert
      expect(clearedMap.getPixel(1, 1)).toBe(0);
      expect(repository.save).toHaveBeenCalledWith(clearedMap);
    });
  });

  describe('generateMapOutput', () => {
    it('should return formatted plain text string', () => {
      // Arrange
      const map = new PixelMap().setPixel(0, 0, 1);

      // Act
      const output = useCase.generateMapOutput(map);

      // Assert
      expect(output).toContain('1000000000000000');
    });
  });

  describe('importFromHex', () => {
    it('should import canvas from hex string and save it', () => {
      // Arrange
      const hex = 'f'.repeat(64); // 全て1のキャンバス
      
      // Act
      const result = useCase.importFromHex(hex);
      
      // Assert
      expect(result.getPixel(0, 0)).toBe(1);
      expect(result.getPixel(15, 15)).toBe(1);
      expect(repository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('generateHexOutput', () => {
    it('should return hex representation of the canvas', () => {
      // Arrange
      const map = new PixelMap();
      
      // Act
      const result = useCase.generateHexOutput(map);
      
      // Assert
      expect(result).toBe('0'.repeat(64));
    });
  });
});
