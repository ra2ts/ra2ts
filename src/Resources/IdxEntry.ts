import { DataReader, hashEntryName } from "@/Resources";

enum IdxFlags {
  StereoOuput = 1,
  Unknown = 2,
  ADPCM = 8,
}

export class IdxEntry {
  private _id: number;
  private _filename: string;
  private _offset: number;
  private _length: number;
  private _sampleRate: number;
  private _flags: number;
  private _chunkSize: number;
  private _data: Uint8Array;

  public static fromReader(reader: DataReader): IdxEntry {
    const entry = new IdxEntry();
    entry._filename = reader.readAscii(16);
    entry._offset = reader.readUint32();
    entry._length = reader.readUint32();
    entry._sampleRate = reader.readUint32();
    entry._flags = reader.readUint32();
    entry._chunkSize = reader.readUint32();
    entry._id = hashEntryName(entry._filename);

    return entry;
  }

  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._filename;
  }

  public set name(filename: string) {
    this._filename = filename;
    this._id = hashEntryName(filename);
  }

  public get offset(): number {
    return this._offset;
  }

  public get length(): number {
    return this._length;
  }

  public get sampleRate(): number {
    return this._sampleRate;
  }

  public get flags(): number {
    return this._flags;
  }

  public get chunkSize(): number {
    return this._chunkSize;
  }

  public set data(data: Uint8Array) {
    this._data = data;
  }

  public get data(): Uint8Array {
    const channels = this.flags & IdxFlags.StereoOuput ? 2 : 1;
    let samples = null;
    let blockAlign = null;
    let byteRate = null;
    let bitsSample = null;
    let format = null;

    if ((this.flags & IdxFlags.Unknown) === IdxFlags.Unknown) {
      samples = (this.length / channels) / 2;
      blockAlign = 2 * channels;
      byteRate = 2 * channels * this._sampleRate;
      bitsSample = 16;
      format = 1;
    } else if ((this.flags & IdxFlags.ADPCM) === IdxFlags.ADPCM) {
      const chunkCount = (this.length + this._chunkSize - 1) / this._chunkSize ;
      samples = (this.length - 30 * channels * (chunkCount * 2)) + chunkCount * channels;
      blockAlign = 512 * channels;
      byteRate = 11100 * channels * this._sampleRate / 22050;
      bitsSample = 4;
      format = 17;
    } else {
      throw new Error('Unknown WAV format');
    }

    const data = new Uint8Array(48 + this._data.length);
    const reader = new DataReader(data);
    reader.writeAscii('RIFF');
    reader.writeUint32(36 + (2 * samples * channels)); // Size
    reader.writeAscii('WAVE');
    reader.writeAscii('fmt ');
    reader.writeUint32(20); // Size
    reader.writeUint16(format); // format tag
    reader.writeUint16(channels);
    reader.writeUint32(this._sampleRate);
    reader.writeUint32(byteRate); // byte rate
    reader.writeUint32(blockAlign); // block align
    reader.writeUint32(bitsSample); // bits sample
    reader.writeAscii('data');
    reader.writeUint32(2 * samples * channels);
    data.set(this._data, reader.pos);
    return data;
  }
}