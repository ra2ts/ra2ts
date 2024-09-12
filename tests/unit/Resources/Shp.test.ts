import { expect, test, describe } from 'vitest';
import { Shp } from '@/Resources/Shp';

describe('Shp', () => {
  test('Throws error if first byte is not 0', () => {
    const input = new Uint8Array([0x00, 0x00, 0x34, 0x12, 0x12, 0x34]);
    expect(() => Shp.fromArray(input)).toThrow();
  });

  test('Calculates the correct width and height', () => {
    const input = new Uint8Array([0x00, 0x00, 0x34, 0x12, 0x12, 0x34, 0x00, 0x00]);
    const shp = Shp.fromArray(input);
    expect(shp.fullHeight).toBe(0x3412);
    expect(shp.fullWidth).toBe(0x1234);
  });
});