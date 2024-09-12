import { DataReader } from "@/Resources/DataReader";

export function parseLocalMixDatabase(data: Uint8Array): string[] {
  const reader = new DataReader(data);
  reader.seek(48);
  const count = reader.readUint32();
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(reader.readNullTerminatedString());
  }
  return result;
}