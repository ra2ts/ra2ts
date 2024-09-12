import { expect, test, describe } from 'vitest';
import { IniSection } from '@/Resources/IniSection';

describe('IniSection', () => {
  test('can parse palette arrays', () => {
    const records = { key: 'hello world'};
    const section = new IniSection(records);
    expect(section.readString('key')).toStrictEqual('hello world');
  });
  test('can parse colors', () => {
    const records = { key: '10,20,30' };
    const section = new IniSection(records);
    expect(section.readColor('key')).toStrictEqual({r:10, g:20, b:30});
  });
  test('can parse bools', () => {
    const records = { trueValue: 'yes', falseValue: 'no' };
    const section = new IniSection(records);
    expect(section.readBool('trueValue')).toStrictEqual(true);
    expect(section.readBool('falseValue')).toStrictEqual(false);
  });
  test('can parse ints', () => {
    const records = { key: '10' };
    const section = new IniSection(records);
    expect(section.readInt('key')).toStrictEqual(10);
  });
  test('can parse floats', () => {
    const records = { key: '1.2345' };
    const section = new IniSection(records);
    expect(section.readFloat('key')).toStrictEqual(1.2345);
  });
  test('can parse enums', () => {
    enum TestEnum {
      hello = 'hello',
      world = 'world',
    }
    const records = { key: 'hello', nonexistant: 'test' };
    const section = new IniSection(records);
    expect(section.readEnum('key', TestEnum, TestEnum.world)).toStrictEqual(TestEnum.hello);
    expect(section.readEnum('nonexistant', TestEnum, TestEnum.world)).toStrictEqual(TestEnum.world);
  });
});