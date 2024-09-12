import CRC32 from 'crc-32';

export function hashEntryName(name: string): number {
  const length = name.length;
  const padding = length % 4 != 0 ? 4 - length % 4 : 0;
  const paddedLength = length + padding;
  const lengthRoundedDownToFour = Math.floor(length / 4) * 4;
  let upperPaddedName = name.toUpperCase();
  if (length !== lengthRoundedDownToFour) {
    upperPaddedName += String.fromCharCode(length - lengthRoundedDownToFour);
    upperPaddedName = upperPaddedName.padEnd(paddedLength, upperPaddedName.charAt(lengthRoundedDownToFour));
  }
  return CRC32.bstr(upperPaddedName) >>> 0;
}