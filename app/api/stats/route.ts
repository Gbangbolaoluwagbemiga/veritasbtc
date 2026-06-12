import { NextResponse } from 'next/server';
import { statsCache, TTL } from '@/lib/cache';
import { fetchHiro } from '@/lib/hiro';
import { CONTRACT_ADDRESS } from '@/lib/config';

interface Stats {
  totalAnchors: number;
  totalIdentities: number;
  contractAddress: string;
  network: string;
  fetchedAt: string;
}

export async function GET() {
  const cached = statsCache.get('global');
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=300' },
    });
  }

  try {
    // Fetch contract events to count anchors and identities
    const [anchorsData, identityData] = await Promise.allSettled([
      fetchHiro(`/extended/v1/contract/${CONTRACT_ADDRESS}.veritasbtc-anchors/events?limit=1`) as Promise<{ total?: number }>,
      fetchHiro(`/extended/v1/contract/${CONTRACT_ADDRESS}.veritasbtc-identity/events?limit=1`) as Promise<{ total?: number }>,
    ]);

    const stats: Stats = {
      totalAnchors: anchorsData.status === 'fulfilled' ? (anchorsData.value.total ?? 0) : 0,
      totalIdentities: identityData.status === 'fulfilled' ? (identityData.value.total ?? 0) : 0,
      contractAddress: CONTRACT_ADDRESS,
      network: 'mainnet',
      fetchedAt: new Date().toISOString(),
    };

    statsCache.set('global', stats, TTL.STATS);
    return NextResponse.json(stats, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=300' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
