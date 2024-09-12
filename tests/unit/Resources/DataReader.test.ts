import { expect, test } from 'vitest';
import { DataReader } from '@/Resources/DataReader';

test('can read signed and unsigned ints', () => {
  const data = new Uint8Array([
    0x00, 0x01, 0xFF, 0x7F, 0xFF,
  ]);
  
  const reader = new DataReader(data);
  expect(reader.readUint8()).toBe(0);
  expect(reader.readUint16()).toBe(65281);
  expect(reader.readInt8()).toBe(127);
  expect(reader.readInt8()).toBe(-1);
  reader.seek(3);
  expect(reader.readInt16()).toBe(-129);
});

test('Throws error when reading too much data', () => {
  const data = new Uint8Array([
    0x00, 0x01,
  ]);
  
  const reader = new DataReader(data);
  expect(reader.readUint32).toThrow();
});

test('Throws error when seeking out of bounds', () => {
  const data = new Uint8Array([
    0x00, 0x01,
  ]);
  
  const reader = new DataReader(data);
  expect(() => reader.seek(2)).toThrow();
});