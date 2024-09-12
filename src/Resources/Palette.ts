import { DataReader } from "@/Resources/DataReader";
import { Color } from "@/Resources/Color";

const PALETTE_SIZE = 256;

export class Palette {
  private _colors: Color[] = [];

  public static fromArray(data: Uint8Array): Palette {
    return Palette.fromReader(new DataReader(data));
  }

  public static fromReader(reader: DataReader): Palette {
    if (reader.length - reader.pos < PALETTE_SIZE * 3) {
      throw new Error(`Invalid palette`);
    }
    const result = new Palette();
    for (let i = 0; i < PALETTE_SIZE; i++) {
      result._colors.push({
        r: Math.floor((reader.readUint8() & 0b00111110) / 64 * 255),
        g: Math.floor((reader.readUint8() & 0b00111111) / 64 * 255),
        b: Math.floor((reader.readUint8() & 0b00111110) / 64 * 255),
      });
    }
    return result;
  }

  public get colors(): Color[] {
    return this._colors;
  }

  public getColorAt(index: number): Color {
    const c = this._colors[index];
    if (c === undefined) {
      throw new Error(`Color ${index} is not set in palette`);
    }
    return c;
  }
}