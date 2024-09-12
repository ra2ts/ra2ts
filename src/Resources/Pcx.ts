import PcxDecoder from 'pcx-js';

export class Pcx {
  private _data: Uint8Array;
  private _width: number;
  private _height: number;

  public static fromArray(data: Uint8Array): Pcx {
    const pcx = new Pcx();
    const decoder = new PcxDecoder(data);
    const { pixelArray, width, height } = decoder.decode();
    pcx._data = pixelArray;
    pcx._width = width;
    pcx._height = height;
    return pcx;
  }

  public get data() {
    return [...this._data];
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }
}