import ini from 'ini';

export function parseIni(data: Uint8Array): Record<string, Record<string, string>> {
  const decoder = new TextDecoder('utf-8');
  const file = decoder.decode(data);
  return ini.parse(file.replaceAll(/([\t ])*;(.*)$/gm, ''));
}