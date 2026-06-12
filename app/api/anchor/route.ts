import { NextRequest, NextResponse } from 'next/server';
import { anchorCache, TTL } from '@/lib/cache';
import { callReadOnly } from '@/lib/hiro';

// Encode a 32-byte hex hash as a Clarity bufferCV hex string
function bufferCVHex(hash: string): string {
  const clean = hash.replace(/^0x/, '');
  if (clean.length !== 64) throw new Error('hash must be 32 bytes (64 hex chars)');
  // 0x02 = buffer type, 00000020 = length 32 as uint32 big-endian
  return `0x02000000${clean.length / 2 < 16 ? '0' : ''}${(clean.length / 2).toString(16).padStart(8, '0')}${clean}`;
}

export async function GET(req: NextRequest) {
  const hash = req.nextUrl.searchParams.get('hash')?.replace(/^0x/, '');

  if (!hash || hash.length !== 64 || !/^[0-9a-f]+$/i.test(hash)) {
    return NextResponse.json({ error: 'hash must be a 64-char hex string' }, { status: 400 });
  }

  const cached = anchorCache.get(hash);
  if (cached !== undefined) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  try {
    const result = await callReadOnly('veritasbtc-anchors', 'get-anchor', [bufferCVHex(hash)]);
    anchorCache.set(hash, result, TTL.ANCHOR);
    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
