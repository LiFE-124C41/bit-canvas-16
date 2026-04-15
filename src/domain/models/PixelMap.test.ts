import { describe, it, expect } from 'vitest';
import { PixelMap, CANVAS_SIZE } from './PixelMap';

describe('PixelMap', () => {
  describe('constructor', () => {
    it('should initialize with all 0s by default', () => {
      // Arrange & Act
      const map = new PixelMap();
      const data = map.getData();

      // Assert
      expect(data.length).toBe(CANVAS_SIZE);
      expect(data.every(row => row.length === CANVAS_SIZE)).toBe(true);
      expect(data.every(row => row.every(pixel => pixel === 0))).toBe(true);
    });

    it('should throw if initialized with invalid dimensions', () => {
      // Arrange
      const invalidData = [[0, 1], [1, 0]] as any; // 2x2 instead of 16x16

      // Act & Assert
      expect(() => new PixelMap(invalidData)).toThrow(/must be 16x16/);
    });
  });

  describe('setPixel / getPixel', () => {
    it('should set pixel value and return a new instance (immutable)', () => {
      // Arrange
      const map1 = new PixelMap();

      // Act
      const map2 = map1.setPixel(5, 5, 1);

      // Assert
      expect(map1.getPixel(5, 5)).toBe(0); // Original shouldn't change
      expect(map2.getPixel(5, 5)).toBe(1); // New instance should have the change
    });

    it('should throw an error for out of bounds coordinates', () => {
      const map = new PixelMap();
      expect(() => map.setPixel(-1, 0, 1)).toThrow(/out of bounds/);
      expect(() => map.setPixel(16, 0, 1)).toThrow(/out of bounds/);
      expect(() => map.getPixel(0, 16)).toThrow(/out of bounds/);
    });
  });

  describe('togglePixel', () => {
    it('should toggle pixel between 0 and 1', () => {
      const map1 = new PixelMap();
      const map2 = map1.togglePixel(0, 0); // 0 -> 1
      const map3 = map2.togglePixel(0, 0); // 1 -> 0

      expect(map1.getPixel(0, 0)).toBe(0);
      expect(map2.getPixel(0, 0)).toBe(1);
      expect(map3.getPixel(0, 0)).toBe(0);
    });
  });

  describe('clear', () => {
    it('should return a new map with all 0s', () => {
      const map = new PixelMap().setPixel(0, 0, 1).setPixel(15, 15, 1);
      const cleared = map.clear();

      expect(map.getPixel(0, 0)).toBe(1);
      expect(cleared.getPixel(0, 0)).toBe(0);
      expect(cleared.getPixel(15, 15)).toBe(0);
    });
  });

  describe('exportToText', () => {
    it('should export map to a multi-line string of 0s and 1s', () => {
      const map = new PixelMap().setPixel(0, 0, 1).setPixel(15, 0, 1);
      const text = map.exportToText();
      const lines = text.split('\n');

      expect(lines.length).toBe(16);
      expect(lines[0]).toBe('1000000000000001'); // Row 0
      expect(lines[1]).toBe('0000000000000000'); // Row 1
    });
  });
});
