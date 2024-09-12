import { LandType } from "@/Engine/Map/LandType";
import { DataReader } from "@/Resources/DataReader";
import { Color } from "@/Resources/Color";

enum Flags {
  HAS_EXTRA_DATA = 0x01,
  HAS_Z_DATA = 0x02,
  HAS_DAMAGED_DATA = 0x04,
}

export class TerrainTileCell {
  private _x: number;
  private _y: number;
  private _extraDataOffset: number;
  private _zDataOffset: number;
  private _extraZDataOffset: number;
  private _xExtra: number;
  private _yExtra: number;
  private _widthExtra: number;
  private _heightExtra: number;
  private _flags: number;
  private _height: number;
  private _landType: number;
  private _slopeType: number;
  private _topLeftRadarColor: Color;
  private _bottomRightRadarColor: Color;
  private _imageData: number[];
  private _extraImageData: number[];

  public static fromReader(reader: DataReader, cellWidth: number, cellHeight: number): TerrainTileCell {
    const tile = new TerrainTileCell();

    tile._x = reader.readInt32();
    tile._y = reader.readInt32();
    tile._extraDataOffset = reader.readUint32();
    tile._zDataOffset = reader.readUint32();
    tile._extraZDataOffset = reader.readUint32();
    tile._xExtra = reader.readInt32();
    tile._yExtra = reader.readInt32();
    tile._widthExtra = reader.readUint32();
    tile._heightExtra = reader.readUint32();
    tile._flags = reader.readUint8();
    reader.read(3); // padding
    tile._height = reader.readUint8();
    tile._landType = reader.readUint8();
    tile._slopeType = reader.readUint8();
    tile._topLeftRadarColor = {
      r: reader.readUint8(),
      g: reader.readUint8(),
      b: reader.readUint8(),
    }
    tile._bottomRightRadarColor = {
      r: reader.readUint8(),
      g: reader.readUint8(),
      b: reader.readUint8(),
    }
    reader.read(3); // padding

    const data = new Uint8Array(cellWidth * cellHeight).fill(0);
    let w = 0;
    let x = cellWidth / 2;
    let cx = 0;
    let y = 0;
    for (; y < cellHeight / 2; y++) {
      cx += 4;
      x -= 2;
      data.set([...reader.readRaw(reader.pos, cx)], w + x);
      reader.seek(reader.pos + cx);
      w += cellWidth;
    }
    for (; y < cellHeight; y++) {
      cx -= 4;
      x += 2;
      data.set([...reader.readRaw(reader.pos, cx)], w + x);
      reader.seek(reader.pos + cx);
      w += cellWidth;
    }

    tile._imageData = [...data];
    //tile._imageData = [...reader.readRaw(reader.pos, cellWidth * cellHeight / 2)];

    if (tile.hasExtraData) {
      try {
        tile._extraImageData = [...reader.readRaw(reader.pos + (cellWidth * cellHeight / 2), tile._widthExtra * tile._heightExtra)];
      } catch (e) {
        tile._flags = tile._flags & ~Flags.HAS_EXTRA_DATA;
        console.error(`Skipping extra data for TerrainTileCell, as it's missing`);
      }
    }

    return tile;
  }

  public get extraX() {
    return this._xExtra;
  }

  public get extraY() {
    return this._yExtra;
  }

  public get extraWidth() {
    return this._widthExtra;
  }

  public get extraHeight() {
    return this._heightExtra;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public get height() {
    return this._height;
  }

  public get flags() {
    return this._flags;
  }

  public get hasZData() {
    return (this._flags & Flags.HAS_Z_DATA) === Flags.HAS_Z_DATA;
  }

  public get hasDamagedData() {
    return (this._flags & Flags.HAS_DAMAGED_DATA) === Flags.HAS_DAMAGED_DATA;
  }

  public get hasExtraData() {
    return (this._flags & Flags.HAS_EXTRA_DATA) === Flags.HAS_EXTRA_DATA;
  }

  public get image() {
    return this._imageData;
  }

  public get extraImage() {
    return this._extraImageData;
  }

  public get landType(): LandType {
    if (this._landType === 0 || this._landType === 1 || this._landType === 13) {
      return LandType.Clear;
    } else if (this._landType >=2 && this._landType <= 4) {
      return LandType.Ice;
    } else if (this._landType === 5) {
      return LandType.Tunnel;
    } else if (this._landType === 6) {
      return LandType.Railroad;
    } else if (this._landType === 7 || this._landType === 8) {
      return LandType.Rock;
    } else if (this._landType === 9) {
      return LandType.Water;
    } else if (this._landType === 10) {
      return LandType.Beach;
    } else if (this._landType === 11 || this._landType === 12) {
      return LandType.Road;
    } else if (this._landType === 14) {
      return LandType.Beach;
    } else if (this._landType === 15) {
      return LandType.Cliff;
    }
    return LandType.Clear;
  }

  public get slopeType() {
    return this._slopeType;
  }
}