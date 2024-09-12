import { expect, test, describe } from 'vitest';
import { Ini } from '@/Resources/Ini';

describe('Ini', () => {
  test('knows if section exists', () => {
    const records = { section1: { hello: 'world' }};
    const ini = Ini.fromRecords(records);
    expect(ini.sectionExists('section1')).toBe(true);
    expect(ini.sectionExists('nonExistantSection')).toBe(false);
  });
});