import { NextRequest, NextResponse } from 'next/server';
import { fetchCallReadOnlyFunction, principalCV, cvToJSON } from '@stacks/transactions';
import { NETWORK, CONTRACT_ADDRESS } from '@/lib/config';
import { identityCache, TTL } from '@/lib/cache';

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
    const result = await fetchCallReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: 'veritasbtc-identity',
      functionName: 'get-identity',
      functionArgs: [principalCV(address)],
      senderAddress: CONTRACT_ADDRESS,
    });

    const json = cvToJSON(result);

    if (!json.value) {
      // Never cache NOT FOUND — user may register moments later
      return NextResponse.json({ found: false }, { headers: { 'X-Cache': 'MISS' } });
    }

    // cvToJSON wraps the tuple: json.value = { type: "tuple", value: { fields } }
    const v = json.value?.value ?? json.value;
    const data = {
      found: true,
      name: v.name?.value ?? '',
      verificationLevel: Number(v['verification-level']?.value ?? 1),
      registeredAt: Number(v['registered-at']?.value ?? 0),
      status: v.status?.value ?? 'active',
    };
    identityCache.set(address, data, TTL.IDENTITY);
    return NextResponse.json(data, { headers: { 'X-Cache': 'MISS' } });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
