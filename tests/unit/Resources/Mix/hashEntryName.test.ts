import { expect, test, describe } from 'vitest';
import { hashEntryName } from '@/Resources/Mix/hashEntryName';

const cases = [
  ["local mix database.dat", 0x366E051F],
  ["rules.ini", 0xF025A96C],
  ["harv.vxl", 0xAEE7BB83],
];

describe('test file names', () => {
  test.each(cases)(
    'Given %p returns %p',
    (filename, expectedId) => {
      const id = hashEntryName(<string>filename);
      expect(id).toBe(expectedId);
    }
  );
});
