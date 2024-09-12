import { ResourceContainer } from "./ResourceContainer";
import { getKey, KEY_LENGTH } from '@/Resources/Mix/encryption';
import { BlowfishReader, DataReader, MixContainer } from "@/Resources";
import { MixFile } from "./MixFile";
import { nameHashMap } from '@/Resources/Mix/NameHashMap';

const FLAGS_OFFSET = 2;
const KEY_OFFSET = 4;
const FILE_ENTRY_LENGTH = 12;

enum Flags {
  checksumPresent = 0x01,
  isEncrypted = 0x02,
}

export function parseContainer(data: Uint8Array): ResourceContainer {
  const container = new MixContainer();
  let headerLength = 0;
  if (data[0] === 0 && data[1] === 0) {
    parseHeader(data, container);
    headerLength += 4;
  }
  
  if (container.isEncrypted()) {
    const key = getKey(data.slice(KEY_OFFSET, KEY_OFFSET + KEY_LENGTH));
    const reader = new BlowfishReader(data.slice(headerLength + KEY_LENGTH), key);
    const fileCount = reader.readUint16();
    container.setSize(reader.readUint32());
    const encryptedHeaderSize = KEY_LENGTH + 6 + (fileCount * FILE_ENTRY_LENGTH);
    headerLength += encryptedHeaderSize + (encryptedHeaderSize % 8 === 0 ? 0 : (8 - (encryptedHeaderSize % 8)));
    for (let i = 0; i < fileCount; i++) {
      const f = parseFile(reader, headerLength - (KEY_LENGTH + KEY_OFFSET));
      container.addFile(f);
    }
  } else {
    const reader = new DataReader(data.slice(headerLength));
    const fileCount = reader.readUint16();
    container.setSize(reader.readUint32());
    const originalHeaderLength = headerLength;
    headerLength += 6 + (fileCount * FILE_ENTRY_LENGTH);
    for (let i = 0; i < fileCount; i++) {
      const f = parseFile(reader, headerLength - originalHeaderLength);
      container.addFile(f);
    }
  }

  return container
}

function parseFile(reader: DataReader, dataSectionPosition: number): MixFile {
  const id = reader.readUint32();
  const offset = reader.readUint32() + dataSectionPosition;
  const size = reader.readUint32();
  let name = null;
  if (nameHashMap[id.toString(10)] !== undefined) {
    name = nameHashMap[id.toString(10)];
  }
  return new MixFile(
    id,
    name,
    offset,
    size,
    reader.readRaw(offset, Math.min(size, reader.length - offset)),
  );
}

function parseHeader(data: Uint8Array, container: &MixContainer) {
  container.setChecksumPresent((data[FLAGS_OFFSET] & Flags.checksumPresent) === Flags.checksumPresent);
  container.setHeaderIsEncrypted((data[FLAGS_OFFSET] & Flags.isEncrypted) === Flags.isEncrypted);
}
