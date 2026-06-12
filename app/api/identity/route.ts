import { NextRequest, NextResponse } from 'next/server';
import { identityCache, TTL } from '@/lib/cache';
import { callReadOnly } from '@/lib/hiro';
import { principalCVHex } from '@/lib/clarity';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');

  if (!address || (!address.startsWith('SP') && !address.startsWith('ST'))) {
    return NextResponse.json({ error: 'address must be a valid Stacks principal (SP... or ST...)' }, { status: 400 });
  }

  const cached = identityCache.get(address);
  if (cached !== undefined) {
    return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    const principalHex = principalCVHex(address);
    const result = await callReadOnly('veritasbtc-identity', 'get-identity', [principalHex], address);
    identityCache.set(address, result, TTL.IDENTITY);
    return NextResponse.json(result, { headers: { 'X-Cache': 'MISS' } });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
