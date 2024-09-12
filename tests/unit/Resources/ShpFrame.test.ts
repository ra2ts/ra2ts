import { expect, test, describe } from 'vitest';
import { ShpFrame } from '@/Resources/ShpFrame';

describe('ShpFrame', () => {
  test('Parses basic properties', () => {
    const input = new Uint8Array([
      0x34, 0x12,             // xPos
      0x12, 0x34,             // yPos
      0x00, 0x00,             // width
      0x01, 0x00,             // height
      0x00, 0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // frame color
      0x00, 0x00, 0x00, 0x00, // Unknown
      0x00, 0x00, 0x00, 0x00, // offset
      0x00, 0x02,             // length
    ]);
    const frame = ShpFrame.fromArray(input);
    expect(frame.xPos).toBe(0x1234);
    expect(frame.yPos).toBe(0x3412);
    expect(frame.width).toBe(0x0000);
    expect(frame.height).toBe(0x0001);
    expect(frame.isCompressed).toBe(false);
  });
  
  test('Parses the compressed flag', () => {
    const input = new Uint8Array([
      0x34, 0x12,             // xPos
      0x12, 0x34,             // yPos
      0x00, 0x00,             // width
      0x00, 0x00,             // height
      0x02, 0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // frame color
      0x00, 0x00, 0x00, 0x00, // Unknown
      0x00, 0x00, 0x00, 0x00, // offset
      0x00, 0x02,             // length
    ]);
    const frame = ShpFrame.fromArray(input);
    expect(frame.isCompressed).toBe(true);
  });
  
  test('Loads frame data', () => {
    const input = new Uint8Array([
      0x34, 0x12,             // xPos
      0x12, 0x34,             // yPos
      0x02, 0x00,             // width
      0x01, 0x00,             // height
      0x02, 0x00, 0x00, 0x00, // flags
      0x00, 0x00, 0x00, 0x00, // frame color
      0x00, 0x00, 0x00, 0x00, // Unknown
      0x18, 0x00, 0x00, 0x00, // offset
      0x04, 0x00,             // length
      0x01, 0x02              // data
    ]);
    const frame = ShpFrame.fromArray(input);
    expect(frame.data).toEqual([0x01, 0x02]);
  });
});