import { Color } from '@/Resources';

type EnumValueType = string | number | symbol;
type EnumType<T> = { [key in EnumValueType]: T };
type OrderedEntry = { key: number; value: string };

export class IniSection {
  constructor(private _records: Record<string, string> = {}) {
  }

  readColor(key: string, defaultValue: Color = { r: 0, g: 0, b: 0}): Color {
    if (this._records[key] === undefined) {
      return defaultValue;
    }
    const [r, g, b] = this._records[key].split(',').map((val) => parseInt(val));
    return { r, g, b };
  }

  readBool(key: string, defaultValue: boolean = false): boolean {
    if (this._records[key] === undefined) {
      return defaultValue;
    }
    return this._records[key] === 'yes';
  }

  readString(key: string, defaultValue: string = ''): string {
    if (this._records[key] === undefined) {
      return defaultValue;
    }
    return this._records[key];
  }

  readInt(key: string, defaultValue: number = 0): number {
    if (this._records[key] === undefined) {
      return defaultValue;
    }
    return parseInt(this._records[key], 10);
  }

  readFloat(key: string, defaultValue: number = 1): number {
    if (this._records[key] === undefined) {
      return defaultValue;
    }
    return parseFloat(this._records[key]);
  }

  readEnum<T>(key: string, type: EnumType<T>, defaultValue: T): T {
    if (type[this._records[key]] === undefined) {
      return defaultValue;
    }
    return type[this._records[key]];
  }

  readBoundingBox(key: string) {
    if (this._records[key] === undefined) {
      throw new Error(`Cannot find bounding box "${key}"`);
    } 
    const [x1, y1, x2, y2] = this._records[key].split(',');
    return {
      topLeft: { x: parseInt(x1), y: parseInt(y1) },
      bottomRight: { x: parseInt(x2), y: parseInt(y2) },
    };
  }

  asArray(): OrderedEntry[] {
    const result: OrderedEntry[] = [];
    Object.entries(this._records).forEach(([key, value]) => {
      result.push({ key: parseInt(key), value });
    });
    return result;
  }

  asDataBlock(): Uint8Array {
    const base64 =  Object.values(this._records).reduce((prev, cur) => prev + cur);
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }
}