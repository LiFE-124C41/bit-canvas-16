export type PixelValue = 0 | 1;
export const CANVAS_SIZE = 16;

export class PixelMap {
  private readonly data: PixelValue[][];

  constructor(data?: PixelValue[][]) {
    if (data) {
      if (data.length !== CANVAS_SIZE || data.some(row => row.length !== CANVAS_SIZE)) {
        throw new Error(`PixelMap must be ${CANVAS_SIZE}x${CANVAS_SIZE}`);
      }
      // 外部からのミューテーションを防ぐためディープコピー
      this.data = data.map(row => [...row]);
    } else {
      // デフォルトは全て0で初期化
      this.data = Array.from({ length: CANVAS_SIZE }, () =>
        Array.from({ length: CANVAS_SIZE }, () => 0)
      );
    }
  }

  public getPixel(x: number, y: number): PixelValue {
    if (!this.isValidCoordinate(x, y)) {
      throw new Error(`Coordinates out of bounds: (${x}, ${y})`);
    }
    return this.data[y][x];
  }

  // Immutableに新しいPixelMapを返す
  public setPixel(x: number, y: number, value: PixelValue): PixelMap {
    if (!this.isValidCoordinate(x, y)) {
      throw new Error(`Coordinates out of bounds: (${x}, ${y})`);
    }
    const newData = this.data.map(row => [...row]);
    newData[y][x] = value;
    return new PixelMap(newData);
  }

  public togglePixel(x: number, y: number): PixelMap {
    const currentValue = this.getPixel(x, y);
    return this.setPixel(x, y, currentValue === 0 ? 1 : 0);
  }

  public clear(): PixelMap {
    return new PixelMap();
  }

  // 0と1の文字列のマップとして出力 (各行は改行で区切る)
  public exportToText(): string {
    return this.data.map(row => row.join('')).join('\n');
  }

  // 文字列から新しいPixelMapを生成する
  public static fromText(text: string): PixelMap {
    const data: PixelValue[][] = Array.from({ length: CANVAS_SIZE }, () =>
        Array.from({ length: CANVAS_SIZE }, () => 0 as PixelValue)
    );

    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    
    for (let y = 0; y < Math.min(lines.length, CANVAS_SIZE); y++) {
      const line = lines[y];
      let xIndex = 0;
      for (let i = 0; i < line.length && xIndex < CANVAS_SIZE; i++) {
        const char = line[i];
        if (char === '0' || char === '1') {
          data[y][xIndex] = char === '1' ? 1 : 0;
          xIndex++;
        }
      }
    }
    
    return new PixelMap(data);
  }

  // UI描画用にデータを取得
  public getData(): PixelValue[][] {
    return this.data.map(row => [...row]);
  }

  private isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE;
  }
}
