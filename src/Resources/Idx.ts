import { DataReader, IdxEntry } from "@/Resources";

export class Idx {
  private _entries: IdxEntry[] = [];

  public static fromArray(data: Uint8Array): Idx {
    const idx = new Idx();
    const reader = new DataReader(data);
    const id = reader.readUint32();
    const two = reader.readUint32();

    if (id !== 0x41424147 || two !== 0x02) {
      throw new Error('Invalid IDX file');
    }

    const count = reader.readUint32();
    for (let i = 0; i < count; i++) {
      idx._entries.push(IdxEntry.fromReader(reader));
    }
    return idx;
  }

  public get entries() {
    return this._entries;
  }
}