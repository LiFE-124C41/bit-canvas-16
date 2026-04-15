import type { IPixelMapRepository } from '../../domain/repositories/IPixelMapRepository';
import { PixelMap, type PixelValue } from '../../domain/models/PixelMap';

const STORAGE_KEY = 'pixel_map_data';

export class LocalStoragePixelMapRepository implements IPixelMapRepository {
  public save(map: PixelMap): void {
    try {
      // データの取り出し
      const data = map.getData();
      // JSON文字列化して保存
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save pixel map to localStorage:', error);
    }
  }

  public load(): PixelMap | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as PixelValue[][];
      
      // 不正なデータの場合は初期化エラーになるが、エラーハンドリングによりnullを返す
      return new PixelMap(parsed);
    } catch (error) {
      console.error('Failed to load pixel map from localStorage:', error);
      return null;
    }
  }
}
