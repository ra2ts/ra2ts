import { DataReader } from "@/Resources/DataReader";
import { ShpFrame } from "@/Resources/ShpFrame";

export class Shp {
  private _fullWidth: number;
  private _fullHeight: number;
  private _frames: ShpFrame[] = [];

  public static fromArray(data: Uint8Array): Shp {
    const reader = new DataReader(data);
    return this.fromReader(reader);
  }
  
  public static fromReader(reader: DataReader): Shp {
    const file = new Shp();
    const empty = reader.readUint16();
    if (empty !== 0) {
      throw new Error(`Invalid shp file`);
    }
    file._fullWidth = reader.readUint16();
    file._fullHeight = reader.readUint16();
    const count = reader.readUint16();
    for (let i = 0; i < count; i++) {
      file._frames.push(ShpFrame.fromDataReader(reader));
    }
    return file;
  }

  public get fullWidth(): number {
    return this._fullWidth;
  }

  public get fullHeight(): number {
    return this._fullHeight;
  }

  public get frames(): ShpFrame[] {
    return this._frames;
  }
}