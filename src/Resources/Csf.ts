import { DataReader } from "@/Resources";

export class Csf {
  private _version: number;
  private _language: number;
  private _strings: Record<string, string> = {};

  public static fromArray(data: Uint8Array): Csf {
    const reader = new DataReader(data);
    return this.fromReader(reader);
  }
  
  public static fromReader(reader: DataReader): Csf {
    const file = new Csf();
    const labelDecoder = new TextDecoder('utf-8');
    const valueDecoder = new TextDecoder('utf-16');

    const fileSignature = reader.readUint32();
    if (fileSignature !== 0x43534620) {
      throw new Error(`Invalid CSF file - file signature was ${fileSignature.toString(16)}`);
    }

    file._version = reader.readUint32();
    const labelCount = reader.readUint32();
    reader.readUint32();
    reader.readUint32();
    file._language = reader.readUint32();

    for (let i = 0; i < labelCount; i++) {
      const labelSignature = reader.readUint32();
      if (labelSignature !== 0x4C424C20) {
        throw new Error(`Invalid CSF file - label signature was ${labelSignature.toString(16)}`);
      }
      const stringCount = reader.readUint32();
      const labelNameLength = reader.readUint32();
      const labelName = labelDecoder.decode(reader.read(labelNameLength));
      for (let j = 0; j < stringCount; j++) {
        const stringSignature = reader.readUint32();
        if (stringSignature !== 0x53545220 && stringSignature !== 0x53545257) {
          throw new Error(`Invalid CSF file - string signature was ${stringSignature.toString(16)}`);
        }
        const stringLength = reader.readUint32();
        const value = valueDecoder.decode(reader.read(stringLength * 2).map((n) => ~n));
        if (stringSignature === 0x53545257) { 
          const extraLenth = reader.readUint32();
          reader.read(extraLenth)
        }
        file._strings[labelName.toUpperCase()] = value;
      }
    }

    return file;
  }

  public allStrings() {
    return Object.entries(this._strings).map(([label, value]) => ({ label, value }));
  }

  public getString(labelName: string): string | null {
    const key = labelName.toUpperCase();
    if (this._strings[key]) {
      return this._strings[key];
    }
    return null;
  }
}