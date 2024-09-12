import { DataReader } from "@/Resources";
import { decode as format80Decode } from './Format80';
import lzo from "../lzo1x";

export enum Format {
  Format80,
  MiniLZO,
}

export function decode(source: Uint8Array, length: number, format: Format): Uint8Array {
  const reader = new DataReader(source);
  const decodedData: number[] = [];

  while (decodedData.length < length) {
    const size_in = reader.readUint16();
    const size_out = reader.readUint16();

    if (size_in == 0 || size_out == 0) {
      break;
    }

    if (format == Format.Format80) {
      const result = format80Decode(reader);
      decodedData.push(...result);
    } else {
      const data = reader.read(size_in);
      const state: { inputBuffer: Uint8Array, outputBuffer: Uint8Array | null } = { inputBuffer: data, outputBuffer: null };
      const result = lzo.decompress(state);
  
      if (result !== 0 || state.outputBuffer === null || size_out != state.outputBuffer.length) {
        throw new Error('Could not decompress map pack');
      }
      decodedData.push(...state.outputBuffer);
    }
  }
  return new Uint8Array(decodedData);
}