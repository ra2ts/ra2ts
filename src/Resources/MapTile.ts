import { DataReader } from "@/Resources";

export class MapTile {
  private _x: number;
  private _y: number;
  private _index: number;
  private _subIndex: number;
  private _level: number;
  private _iceGrowth: boolean;

  static fromReader(reader: DataReader): MapTile {
    const tile = new MapTile();
    tile._x = reader.readUint16();
    tile._y = reader.readUint16();
    tile._index = reader.readUint16();
    if (tile._index === 0xFFFF) {
      tile._index = 0;
    }
    reader.readUint16();
    tile._subIndex = reader.readUint8();
    tile._level = reader.readUint8();
    tile._iceGrowth = reader.readUint8() === 1;
    return tile;
  }

  public get x() {
    return this._x;
  }

  public dX(width: number) {
    return this._x - this._y + width - 1;
  }

  public dY(width: number) {
    return this._x + this._y - width - 1;
  }

  public get y() {
    return this._y;
  }

  public get index() {
    return this._index;
  }

  public set index(value: number) {
    this._index = value;
  }

  public get subIndex() {
    return this._subIndex;
  }

  public get level() {
    return this._level;
  }
}