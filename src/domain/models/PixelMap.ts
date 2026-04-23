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

  // URLパラメータ用にコンパクトな16進数文字列（64文字）として出力する
  public toHex(): string {
    let hexString = '';
    for (let y = 0; y < CANVAS_SIZE; y++) {
      for (let x = 0; x < CANVAS_SIZE; x += 4) {
        // 4ピクセルずつ取り出して2進数文字列とし、16進数に変換
        const bin = `${this.data[y][x]}${this.data[y][x+1]}${this.data[y][x+2]}${this.data[y][x+3]}`;
        const hexChar = parseInt(bin, 2).toString(16);
        hexString += hexChar;
      }
    }
    return hexString;
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

  // 16進数文字列（64文字）から新しいPixelMapを生成する
  public static fromHex(hex: string): PixelMap {
    if (hex.length !== (CANVAS_SIZE * CANVAS_SIZE) / 4) {
      throw new Error(`Invalid hex length. Expected ${(CANVAS_SIZE * CANVAS_SIZE) / 4} characters.`);
    }

    const data: PixelValue[][] = Array.from({ length: CANVAS_SIZE }, () =>
        Array.from({ length: CANVAS_SIZE }, () => 0 as PixelValue)
    );

    let hexIndex = 0;
    for (let y = 0; y < CANVAS_SIZE; y++) {
      for (let x = 0; x < CANVAS_SIZE; x += 4) {
        const hexChar = hex[hexIndex++];
        // 16進数文字を4桁の2進数文字列に変換 (例: 'f' -> '1111', '5' -> '0101')
        const bin = parseInt(hexChar, 16).toString(2).padStart(4, '0');
        for (let i = 0; i < 4; i++) {
          data[y][x + i] = bin[i] === '1' ? 1 : 0;
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
