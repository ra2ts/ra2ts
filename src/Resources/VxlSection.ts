import { DataReader, Palette } from "@/Resources";

const HEADER_SIZE = 802;
const SECTION_HEADER_SIZE = 28;
const SECTION_TAIL_SIZE = 48;

interface Voxel {
  x: number;
  y: number;
  z: number;
  color: number;
  normalIndex: number;
}

interface VxlSpan {
  x: number;
  y: number;
  startIndex: number;
  endIndex: number;
  height: number;
  voxels: Voxel[];
}

export class VxlSection {
  private _id: string;
  private _index: number;
  private _spanStartOffset: number;
  private _spanEndOffset: number;
  private _spanDataOffset: number;
  private _scale: number;
  private _xMin: number;
  private _yMin: number;
  private _zMin: number;
  private _xMax: number;
  private _yMax: number;
  private _zMax: number;
  private _sizeX: number;
  private _sizeY: number;
  private _sizeZ: number;
  private _normalsMode: number;
  private _spans: VxlSpan[][] = [];

  public get sizeX() {
    return this._sizeX;
  }

  public get sizeY() {
    return this._sizeY;
  }

  public get sizeZ() {
    return this._sizeZ;
  }

  public get scale() {
    return this._scale;
  }

  public voxels(x: number, y: number) {
    return this._spans[x][y].voxels;
  }

  public readHeader(reader: DataReader): void {
    const decoder = new TextDecoder('ascii');
    this._id = decoder.decode(reader.read(16));
    this._index = reader.readUint32();
    reader.readInt32();
    reader.readInt32();
  }

  public readBodySpan(reader: DataReader): void {

    for (let y = 0; y < this._sizeY; y++) {
      for (let x = 0; x < this._sizeX; x++) {
        if (this._spans[x] === undefined) {
          this._spans[x] = [];
        }
        this._spans[x][y] = {
          startIndex: reader.readInt32(),
          endIndex: -1,
          height: this._sizeZ,
          x,
          y,
          voxels: [],
        };
      }
    }
    for (let y = 0; y < this._sizeY; ++y) {
      for (let x = 0; x < this._sizeX; ++x) {
        this._spans[x][y].endIndex = reader.readInt32();
      }
    }
    for (let y = 0; y < this._sizeY; y++) {
      for (let x = 0; x < this._sizeX; x++) {
        if (this._spans[x][y] === undefined || this._spans[x][y].startIndex === -1 || this._spans[x][y].endIndex === -1) {
          continue;
        }
        this._spans[x][y].voxels = [];
        for (let z = 0; z < this._sizeZ;) {
          z += reader.readUint8();
          const c = reader.readUint8();
					for (let i = 0; i < c; i++) {
            this._spans[x][y].voxels.push({ x, y, z: z++, color: reader.readUint8(), normalIndex: reader.readUint8() });
          }
          if (reader.readUint8() !== c) {
            throw new Error(`Repeated voxel count was inccorect`);
          }
        }
      }
    }
  }

  public readTailer(reader: DataReader): void {
    this._spanStartOffset = reader.readUint32();
    this._spanEndOffset = reader.readUint32();
    this._spanDataOffset = reader.readUint32();
    this._scale = reader.readFloat();
    const transform: number[][] = [];
    for (let j = 0; j < 3; j++) {
      transform[j] = [];
      for (let k = 0; k < 4; k++) {
        transform[j][k] = reader.readFloat();
      }
    }
    this._xMin = reader.readFloat();
    this._yMin = reader.readFloat();
    this._zMin = reader.readFloat();
    this._xMax = reader.readFloat();
    this._yMax = reader.readFloat();
    this._zMax = reader.readFloat();
    this._sizeX = reader.readUint8();
    this._sizeY = reader.readUint8();
    this._sizeZ = reader.readUint8();
    this._normalsMode = reader.readUint8();
  }
}