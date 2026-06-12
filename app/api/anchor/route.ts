import { NextRequest, NextResponse } from 'next/server';
import { fetchCallReadOnlyFunction, bufferCV, cvToJSON } from '@stacks/transactions';
import { NETWORK, CONTRACT_ADDRESS } from '@/lib/config';
import { anchorCache, TTL } from '@/lib/cache';

export async function GET(req: NextRequest) {
  const hash = req.nextUrl.searchParams.get('hash')?.replace(/^0x/, '');

  if (!hash || hash.length !== 64 || !/^[0-9a-f]+$/i.test(hash)) {
    return NextResponse.json({ error: 'hash must be a 64-char hex string' }, { status: 400 });
  }

  const cached = anchorCache.get(hash);
  if (cached !== undefined) {
    return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=3600' } });
  }

  try {
    const hashBytes = new Uint8Array(hash.match(/.{2}/g)!.map(b => parseInt(b, 16)));

    const result = await fetchCallReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'veritasbtc-anchors',
      functionName: 'get-anchor',
      functionArgs: [bufferCV(hashBytes)],
      senderAddress: CONTRACT_ADDRESS,
    });

    const json = cvToJSON(result);

    if (!json.value) {
      const data = { found: false };
      anchorCache.set(hash, data, TTL.ANCHOR);
      return NextResponse.json(data, { headers: { 'X-Cache': 'MISS' } });
    }

    const v = json.value;
    const data = {
      found: true,
      owner: v.owner?.value ?? '',
      blockHeight: Number(v['stacks-block-height']?.value ?? v['block-height']?.value ?? 0),
      contentType: v['content-type']?.value ?? '',
      label: v.label?.value ?? '',
    };
    anchorCache.set(hash, data, TTL.ANCHOR);
    return NextResponse.json(data, { headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=3600' } });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
