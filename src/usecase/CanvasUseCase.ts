import type { IPixelMapRepository } from '../domain/repositories/IPixelMapRepository';
import { PixelMap } from '../domain/models/PixelMap';

export class CanvasUseCase {
  private readonly repository: IPixelMapRepository;

  constructor(repository: IPixelMapRepository) {
    this.repository = repository;
  }

  /**
   * キャンバスをロードするか、初期状態で新規作成する
   */
  public loadOrInitializeCanvas(): PixelMap {
    const loadedMap = this.repository.load();
    if (loadedMap) {
      return loadedMap;
    }
    const newMap = new PixelMap();
    this.repository.save(newMap);
    return newMap;
  }

  /**
   * 指定座標のピクセルを反転し、新しい状態を保存する
   */
  public togglePixel(map: PixelMap, x: number, y: number): PixelMap {
    const newMap = map.togglePixel(x, y);
    this.repository.save(newMap);
    return newMap;
  }

  /**
   * 指定座標のピクセルを特定の値に設定し、新しい状態を保存する（ドラッグ描画用）
   */
  public setPixel(map: PixelMap, x: number, y: number, value: 0 | 1): PixelMap {
    const newMap = map.setPixel(x, y, value);
    this.repository.save(newMap);
    return newMap;
  }

  /**
   * 文字列からキャンバスをインポートし、新しい状態を保存する
   */
  public importCanvas(text: string): PixelMap {
    const newMap = PixelMap.fromText(text);
    this.repository.save(newMap);
    return newMap;
  }

  /**
   * Hex文字列からキャンバスをインポートし、新しい状態を保存する
   */
  public importFromHex(hex: string): PixelMap {
    const newMap = PixelMap.fromHex(hex);
    this.repository.save(newMap);
    return newMap;
  }

  /**
   * キャンバスをクリアし、新しい状態を保存する
   */
  public clearCanvas(): PixelMap {
    const newMap = new PixelMap();
    this.repository.save(newMap);
    return newMap;
  }

  /**
   * キャンバスデータをプレーンテキストとして出力する
   */
  public generateMapOutput(map: PixelMap): string {
    return map.exportToText();
  }

  /**
   * キャンバスデータをHex文字列として出力する
   */
  public generateHexOutput(map: PixelMap): string {
    return map.toHex();
  }
}
