import { DataReader } from "@/Resources";

export function decode(source: DataReader): Uint8Array {
  const decodedData: number[] = [];

  while (source.pos < source.length) {
    const i = source.readUint8();
    if ((i & 0x80) == 0) {
      const secondByte = source.readUint8();
      const count = ((i & 0x70) >> 4) + 3;
      const rpos = ((i & 0xf) << 8) + secondByte;

      replicatePrevious(decodedData, decodedData.length - rpos, count);
    } else if ((i & 0x40) == 0) {
      const count = i & 0x3F;
      if (count == 0) {
        break;
      }

      const data = source.read(count);
      decodedData.push(...data);
    } else {
      const count3 = i & 0x3F;
      if (count3 == 0x3E) {
        const count = source.readInt16();
        const color = source.readUint8();

        decodedData.push(...Array(count).fill(color));
      } else if (count3 == 0x3F) {
        const count = source.readInt16();
        const srcIndex = source.readInt16();
        if (srcIndex >= decodedData.length) {
          throw new Error(`srcIndex >= destIndex  ${srcIndex}  ${decodedData.length}`);
        }
        for (let i = 0; i < count; i++) {
          decodedData.push(decodedData[srcIndex + i]);
        }
      } else {
        const count = count3 + 3;
        const srcIndex = source.readInt16();
        if (srcIndex >= decodedData.length) {
          throw new Error(`srcIndex >= destIndex  ${srcIndex}  ${decodedData.length}`);
        }
        for (let i = 0; i < count; i++) {
          decodedData.push(decodedData[srcIndex + i]);
        }
      }
    }
  }
  return new Uint8Array(decodedData);
}

function replicatePrevious(dest: number[], srcIndex: number, count: number) {
  if (srcIndex > dest.length)
    throw new Error(`srcIndex > destIndex  ${srcIndex}  ${dest.length}`);

  if (dest.length - srcIndex == 1) {
    for (let i = 0; i < count; i++) {
      dest.push(dest[dest.length - 1]);
    }
  }
  else {
    for (let i = 0; i < count; i++) {
      dest.push(dest[srcIndex + i]);
    }
  }
}