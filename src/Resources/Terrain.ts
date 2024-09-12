import { DataReader } from "@/Resources/DataReader";
import { TerrainTileCell } from "@/Resources/TerrainTileCell";

export class Terrain {
  private _blockWidth: number;
  private _blockHeight: number;
  private _blockImageWidth: number;
  private _blockImageHeight: number;
  private _tiles: TerrainTileCell[] = [];
  private _isCLAT: boolean;
  private _isLAT: boolean;

  public static fromArray(data: Uint8Array): Terrain {
    const reader = new DataReader(data);
    const file = new Terrain();

    file._blockWidth = reader.readUint32();
    file._blockHeight = reader.readUint32();
    file._blockImageWidth = reader.readUint32();
    file._blockImageHeight = reader.readUint32();

    if ((file._blockImageWidth !== 60 && file._blockImageWidth !== 48) || ((file._blockImageHeight * 2) !== file._blockImageWidth)) {
      console.log(file);
      throw new Error(`Invalid terrain file`);
    }

    const indexPosition = reader.pos;
    for (let i = 0; i < file.expectedTileCount() + 1; i++) {
      const offset = reader.readUint32();
      if (offset > reader.length) {
        console.log(file);
        throw new Error(`Invalid terrain file: Invalid cell offset "${offset}" (file length: ${reader.length})`);
      }
      reader.seek(offset);
      file._tiles.push(TerrainTileCell.fromReader(reader, file._blockImageWidth, file._blockImageHeight));
      reader.seek(indexPosition + (i * 4));
    }

    return file;
  }

  public get rect() {
    let x = Number.MAX_SAFE_INTEGER;
    let y = Number.MAX_SAFE_INTEGER;
    let width = Number.MIN_SAFE_INTEGER;
    let height = Number.MIN_SAFE_INTEGER;

    for (const tile of this._tiles) {
      if (tile.x < x) {
        x = tile.x;
      }
      if (tile.x + this._blockImageWidth > width) {
        width = tile.x + this._blockImageWidth;
      }
      if (tile.y < y) {
        y = tile.y;
      }
      if (tile.y + this._blockImageHeight > height) {
        height = tile.y + this._blockImageHeight;
      }
    }
    return { x, y, width, height };
  }

  private expectedTileCount() {
    return this._blockWidth * this._blockHeight;
  }

  public get tiles() {
    return this._tiles;
  }

  public get blockWidth() {
    return this._blockWidth;
  }

  public get blockHeight() {
    return this._blockHeight;
  }

  public get blockImageWidth() {
    return this._blockImageWidth;
  }

  public get blockImageHeight() {
    return this._blockImageHeight;
  }

  public set isCLAT(value: boolean) {
    this._isCLAT = value;
  }

  public get isCLAT() {
    return this._isCLAT;
  }

  public set isLAT(value: boolean) {
    this._isLAT = value;
  }

  public get isLAT() {
    return this._isLAT;
  }
}