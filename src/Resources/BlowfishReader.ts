import { blowfish } from './Blowfish';
import { DataReader } from './DataReader';

const BLOCK_SIZE = 8;
const MODE_ECB = 0;
const TYPE_ARRAY = 3;

export class BlowfishReader extends DataReader {
  private blocksDecrypted: Uint8Array;

  constructor(data: Uint8Array, private key: string) {
    super(data);
    this.blocksDecrypted = new Uint8Array(Math.ceil(this.data.length / 8));
  }

  public read(numBytes: number): Uint8Array {
    const offset = this.currentByteOffset;
    for (let i = 0; i < numBytes; i++) {
      if (!this.isByteDecrypted(i + offset)) {
        const blockNumber = Math.floor((i + offset) / BLOCK_SIZE);
        this.decryptBlock(blockNumber)
      }
    }
    this.currentByteOffset = offset + numBytes;
    return this.data.slice(offset, offset + numBytes);
  }

  private decryptBlock(blockNumber: number) {
    this.decrypt(blockNumber * BLOCK_SIZE, BLOCK_SIZE);
  }

  private decrypt(offset: number, length: number): Uint8Array {
    if (length % 8 !== 0) {
      throw new RangeError(`Cannot decrypt ${length} bytes, the number of bytes must be a multiple of ${BLOCK_SIZE}`);
    }

    const startingBlockNumber = Math.floor(offset / BLOCK_SIZE);
    for (let i = 0; i < length / 8; i++) {
      if (this.isBlockDecrypted(startingBlockNumber + i)) {
        throw new Error(`Attempting to decrypt block ${startingBlockNumber + i} but it has already been decrypted`);
      }
    }

    const decrypted = <string>blowfish.decrypt(this.data.slice(offset, offset + length) as unknown as string, this.key, { cipherMode: MODE_ECB, outputType: TYPE_ARRAY });
    if (decrypted.length !== BLOCK_SIZE) {
      throw new Error(`Failed to decrypt bytes ${offset} to ${offset + length}`);
    }
    decrypted.padEnd(8, '\0');
    for (let i = 0; i < decrypted.length; i++) {
      this.markBlockAsDecrypted(Math.floor((i + offset) / BLOCK_SIZE));
      this.data.set([decrypted.charCodeAt(i)], i + offset);
    }
    return this.data.slice(offset, offset + length);
  }

  private markBlockAsDecrypted(blockNumber: number) {
    const index = Math.floor(blockNumber / 8);
    const bitNumber = blockNumber % 8;
    const bitMask = 0x01 << bitNumber;
    this.blocksDecrypted[index] = this.blocksDecrypted[index] | bitMask;
  }

  private isByteDecrypted(byteNumber: number) {
    if (byteNumber > this.data.length) {
      throw new RangeError(`Given byte number (${byteNumber}) is greater than the total number of bytes`);
    }
    const blockNumber = Math.floor(byteNumber / BLOCK_SIZE);
    return this.isBlockDecrypted(blockNumber);
  }

  private isBlockDecrypted(blockNumber: number) {
    const index = Math.floor(blockNumber / 8);
    if (index > this.blocksDecrypted.length) {
      throw new RangeError(`Given block number (${blockNumber}) is greater than the total number of blocks`);
    }
    const bitNumber = blockNumber % 8;
    const bitMask = 0x01 << bitNumber;
    return (this.blocksDecrypted[index] & bitMask) === bitMask;
  }
}