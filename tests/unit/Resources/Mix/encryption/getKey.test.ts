import { expect, test } from 'vitest';
import { getKey } from "@/Resources/Mix/encryption";
import NodeForge from 'node-forge';

test('test key decrypts', () => {
  const keySource = new Uint8Array([
    0xca, 0xd0, 0xb0, 0x1b, 0xfe, 0x3f, 0x3f, 0xb6,
    0xca, 0xc0, 0xbd, 0x8f, 0x40, 0xf0, 0xee, 0x85,
    0x6e, 0xe1, 0xda, 0x7a, 0xef, 0xb4, 0xd4, 0xbb,
    0x6a, 0xd8, 0x4b, 0x84, 0x26, 0x99, 0x6f, 0xfd,
    0x65, 0x97, 0xf2, 0x5f, 0xa4, 0x46, 0xdb, 0x47,
    0x88, 0x63, 0x4f, 0x2c, 0x14, 0x0b, 0x3c, 0xce,
    0xaa, 0xc4, 0x5c, 0xe4, 0x15, 0x86, 0x26, 0x5c,
    0x52, 0x3a, 0x80, 0xf8, 0xbe, 0x45, 0x40, 0x6a,
    0x66, 0xb4, 0xc5, 0xf6, 0xd0, 0x12, 0xe0, 0x43,
    0x44, 0x65, 0xc6, 0xe3, 0x9e, 0xf9, 0x43, 0x35
  ]);
  const expectedKey = "U7m3bOxsA7g4uG0RCKxKkZ0vDAwMDAwMDAwMDAwMDAxxbpSsLKzwCIgItVJP7JfSKkgFBQUFBQU=";
  const key = getKey(keySource);
  const encodedKey = NodeForge.util.encode64(key);
  expect(encodedKey).toBe(expectedKey);
});

test('test ra2 languages.mix key decrypts', () => {
  const keySource = new Uint8Array([
      0xFC, 0x32, 0xF2, 0x6B, 0x9A, 0x13, 0x43, 0x43,
      0x75, 0x96, 0x41, 0x50, 0x49, 0xDD, 0xD9, 0x3F,
      0x7B, 0x0F, 0xFE, 0x67, 0xD8, 0xBA, 0x79, 0xF8,
      0x7C, 0xC7, 0xD7, 0xDA, 0xA1, 0xAC, 0x1A, 0x79,
      0xB8, 0xA8, 0xA7, 0x87, 0x18, 0x52, 0xCB, 0x46,
      0xA4, 0xC1, 0xD8, 0x0F, 0x93, 0x1F, 0xE7, 0xFA,
      0xDD, 0x8B, 0xB2, 0xC6, 0x2A, 0xDF, 0xBC, 0x52,
      0x68, 0xFB, 0xF8, 0x8B, 0xA0, 0x3C, 0x17, 0xB1,
      0xC5, 0x83, 0x0F, 0xA2, 0xF1, 0x31, 0xAC, 0x45,
      0x49, 0x2C, 0xD9, 0x67, 0x76, 0xBD, 0x4F, 0x12
  ]);
  const expectedKey = "D1yVMBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBjdHefLu7u7u7u7u7u7u7u7u7u7u7u7u7s=";
  const key = getKey(keySource);
  const encodedKey = NodeForge.util.encode64(key);
  expect(encodedKey).toBe(expectedKey);
});