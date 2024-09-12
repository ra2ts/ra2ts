import NodeForge from 'node-forge';

const BigInteger = NodeForge.jsbn.BigInteger;

export const KEY_LENGTH = 80;
const PUBLIC_RSA_KEY = "51bcda086d39fce4565160d651713fa2e8aa54fa6682b04aabdd0e6af8b0c1e6d1fb4f3daa437f15";
const PRIVATE_RSA_KEY = "0a5637bc99139c47c422c67c54105e5bdbd0aeae4ab4d4334358274e1bdf5706a1fbf4e682893081";

export function getKey(keySource: Uint8Array): string {
  keySource.reverse();
  const keyBlock1 = rsaTransform(keySource.slice(0, KEY_LENGTH / 2), new BigInteger('10001', 16), new BigInteger(PUBLIC_RSA_KEY, 16));
  const keyBlock2 = rsaTransform(keySource.slice(KEY_LENGTH / 2), new BigInteger('10001', 16), new BigInteger(PUBLIC_RSA_KEY, 16));
  const blowfishKey = new Uint8Array(keyBlock1.shiftLeft(312).add(keyBlock2).toByteArray().reverse().slice(0, 56));
  return String.fromCharCode(...blowfishKey);
}

function rsaTransform(data: Uint8Array, e: NodeForge.jsbn.BigInteger, n: NodeForge.jsbn.BigInteger): NodeForge.jsbn.BigInteger {
  const x = new BigInteger([...data]);
  return x.modPow(e, n);
}