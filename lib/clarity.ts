/**
 * Minimal Clarity value serialisation for read-only contract calls.
 * No external dependencies — implements only bufferCV and principalCV
 * which is all VeritasBTC needs.
 */

// ─── Hex utils ────────────────────────────────────────────────────────────────

export function buf2hex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Buffer CV ───────────────────────────────────────────────────────────────

/**
 * Encode a hex string as a Clarity bufferCV hex string.
 * Layout: 0x02 | uint32_be(length) | bytes
 */
export function bufferCVHex(hex: string): string {
  const clean = hex.replace(/^0x/, '').toLowerCase();
  if (clean.length % 2 !== 0) throw new Error('bufferCVHex: odd-length hex');
  const len = clean.length / 2;
  const lenHex = len.toString(16).padStart(8, '0');
  return `0x02${lenHex}${clean}`;
}

// ─── Principal CV ─────────────────────────────────────────────────────────────

// Stacks uses c32check encoding (a variant of base32)
const C32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

// Address-type prefix → version byte used in the hash
const VERSION: Record<string, number> = {
  SP: 22,   // mainnet standard
  ST: 26,   // testnet standard
  SM: 20,   // mainnet multi-sig
  SN: 21,   // testnet multi-sig
};

function c32decode(str: string): Uint8Array {
  const upper = str.toUpperCase();
  // Accumulate in a byte array using manual multi-precision multiply-add
  const result: number[] = [0];
  for (const ch of upper) {
    const idx = C32.indexOf(ch);
    if (idx < 0) throw new Error(`c32decode: invalid character '${ch}'`);
    let carry = idx;
    for (let i = result.length - 1; i >= 0; i--) {
      const val = result[i] * 32 + carry;
      result[i] = val & 0xff;
      carry = val >>> 8;
    }
    while (carry > 0) { result.unshift(carry & 0xff); carry >>>= 8; }
  }
  return new Uint8Array(result);
}

/**
 * Decode a Stacks address into its raw 20-byte hash and version byte.
 * Skips checksum verification (we trust addresses passed to us).
 */
export function decodeStacksAddress(address: string): { version: number; hash: Uint8Array } {
  const prefix = address.slice(0, 2).toUpperCase();
  const version = VERSION[prefix];
  if (version === undefined) throw new Error(`Unknown address prefix: ${prefix}`);

  const encoded = address.slice(2); // strip SP / ST / SM / SN
  const decoded = c32decode(encoded);

  // decoded = [version_byte, ...20_hash_bytes, ...4_checksum_bytes]
  // We want the 20 hash bytes (indices 1..20, skipping version at 0 and checksum at end)
  if (decoded.length < 25) throw new Error(`Address too short: ${address}`);
  return { version, hash: decoded.slice(1, 21) };
}

/**
 * Encode a Stacks address as a Clarity StandardPrincipalCV hex string.
 * Layout: 0x05 | version_byte | 20_hash_bytes
 */
export function principalCVHex(address: string): string {
  const { version, hash } = decodeStacksAddress(address);
  const versionHex = version.toString(16).padStart(2, '0');
  const hashHex = [...hash].map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x05${versionHex}${hashHex}`;
}
