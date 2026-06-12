import { NextRequest, NextResponse } from 'next/server';
import { txCache, TTL } from '@/lib/cache';
import { fetchHiro } from '@/lib/hiro';

export async function GET(req: NextRequest) {
  const txId = req.nextUrl.searchParams.get('txId');

  if (!txId || !/^0x[0-9a-f]{64}$/i.test(txId) && !/^[0-9a-f]{64}$/i.test(txId)) {
    return NextResponse.json({ error: 'txId must be a valid transaction hash' }, { status: 400 });
  }

  const id = txId.replace(/^0x/, '');
  const cached = txCache.get(id);
  if (cached !== undefined) {
    return NextResponse.json(cached, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    const data = await fetchHiro(`/extended/v1/tx/${id}`) as Record<string, unknown>;
    const isConfirmed = data.tx_status === 'success' || String(data.tx_status).startsWith('abort');

    // Only cache confirmed TXes forever — pending TXes should keep polling
    if (isConfirmed) {
      txCache.set(id, data, TTL.TX_CONFIRMED);
    }

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': isConfirmed ? 'public, max-age=86400' : 'no-store',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
