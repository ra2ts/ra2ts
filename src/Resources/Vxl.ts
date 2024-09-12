import { DataReader, Palette, VxlSection } from "@/Resources";

const HEADER_SIZE = 802;
const SECTION_HEADER_SIZE = 28;
const SECTION_TAIL_SIZE = 48;

export class Vxl {
  private _palette: Palette;
  private _sections: VxlSection[] = [];

  public get palette(): Palette {
    return this._palette;
  }

  public get sections(): VxlSection[] {
    return this._sections;
  }

  public static fromArray(data: Uint8Array): Vxl {
    return Vxl.fromReader(new DataReader(data));
  }

  public static fromReader(reader: DataReader): Vxl {
    const vxl = new Vxl();
    const decoder = new TextDecoder('ascii');
    const id = decoder.decode(reader.read(16));
    const one = reader.readInt32();
    const headerCount = reader.readUint32();
    const tailerCount = reader.readUint32();
    const size = reader.readUint32();
    const unknown = reader.readUint16();
    vxl._palette = Palette.fromReader(reader);

    if (
      id.localeCompare("Voxel Animation", 'en') !== 0 ||
      one !== 0x01 ||
      headerCount !== tailerCount ||
      unknown !== 0x1F10
    ) {
      throw new Error('Invalid vxl file');
    }

    for (let i = 0; i < headerCount; i++) {
      const section = new VxlSection();
      section.readHeader(reader);
      vxl._sections[i] = section;
    }
    const bodyOffset = reader.pos;
    reader.seek(reader.pos + size);
    for (let i = 0; i < tailerCount; i++) {
      vxl._sections[i].readTailer(reader);
    }
    reader.seek(bodyOffset);
    for (let i = 0; i < tailerCount; i++) {
      vxl._sections[i].readBodySpan(reader);
    }

    return vxl;
  }
}