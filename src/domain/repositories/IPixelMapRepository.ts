import { PixelMap } from '../models/PixelMap';

export interface IPixelMapRepository {
  /**
   * ピクセルマップ状態を保存する
   * @param map 保存対象のPixelMapインスタンス
   */
  save(map: PixelMap): void;

  /**
   * 保存されたピクセルマップ状態を読み込む
   * @returns 保存された状態が存在すればPixelMapインスタンス、なければnull
   */
  load(): PixelMap | null;
}
