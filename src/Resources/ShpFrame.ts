import { DataReader } from "@/Resources/DataReader";

enum Flags {
  COMPRESSED = 0x02,
}


export class ShpFrame {
  private _xPos: number;
  private _yPos: number;
  private _width: number;
  private _height: number;
  private _flags: number;
  private _frameColor: Uint8Array;
  private _offset: number;
  private _data: number[] = [];

  public static fromArray(data: Uint8Array): ShpFrame {
    const reader = new DataReader(data);
    return this.fromDataReader(reader);
  }

  public static fromDataReader(reader: DataReader): ShpFrame {
    const frame = new ShpFrame();
    frame._xPos = reader.readUint16();
    frame._yPos = reader.readUint16();
    frame._width = reader.readUint16();
    frame._height = reader.readUint16();
    frame._flags = reader.readUint32();
    frame._frameColor = reader.read(4);
    reader.readUint32();
    frame._offset = reader.readUint32();

    if ((frame._flags & Flags.COMPRESSED) === Flags.COMPRESSED) {
      const pos = reader.pos;
      reader.seek(frame._offset);
      for (let i = 0; i < frame.height; i++) {
        const length = reader.readUint16();
        let currentLineWidth = 0;
        for (let j = 0; j < length - 2; j++) {
          const color = reader.readUint8();
          currentLineWidth += 1;
          frame._data.push(color);
          if (color === 0) {
            const pixelsLeft = frame.width - currentLineWidth;
            const duplicateCount = Math.min(reader.readUint8() - 1, pixelsLeft);
            j += 1;
            if (duplicateCount > 0) {
              currentLineWidth += duplicateCount;
              frame._data.push(...Array(Math.min(duplicateCount, pixelsLeft)).fill(color));
            }
          }
        }
        if (currentLineWidth !== frame.width) {
          throw new Error(`Frame width (${frame.width}) does not match line width (${currentLineWidth})`);
        }
      }
      reader.seek(pos);
    } else {
      frame._data = [...reader.readRaw(frame._offset, frame._width * frame._height)];
    }
    return frame;
  }

  public get xPos(): number {
    return this._xPos;
  }

  public get yPos(): number {
    return this._yPos;
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public get offset(): number {
    return this._offset;
  }

  public get data(): number[] {
    return this._data;
  }

  public get isCompressed(): boolean {
    return (this._flags & Flags.COMPRESSED) === Flags.COMPRESSED; 
  }
}