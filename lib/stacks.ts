import {
  bufferCV, stringAsciiCV, principalCV,
  cvToJSON, PostConditionMode,
} from '@stacks/transactions';
import { NETWORK, CONTRACT_ADDRESS, HIRO_API } from './config';
import { buf2hex } from './clarity';

/**
 * READ operations route through /api/* (server-side cached proxy).
 * WRITE operations use @stacks/connect (wallet-signed, browser only).
 */

function lazyOpenContractCall(options: Parameters<typeof import('@stacks/connect').openContractCall>[0]) {
  if (typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { openContractCall } = require('@stacks/connect');
  openContractCall(options);
}

// ─── Reads via backend cache ──────────────────────────────────────────────────

export async function getAnchor(hashBuffer: ArrayBuffer) {
  const hash = buf2hex(hashBuffer);
  const res = await fetch(`/api/anchor?hash=${hash}`);
  if (!res.ok) throw new Error(`getAnchor: ${res.status}`);
  return res.json();
}

export async function getIdentity(address: string) {
  const res = await fetch(`/api/identity?address=${encodeURIComponent(address)}`);
  if (!res.ok) throw new Error(`getIdentity: ${res.status}`);
  return res.json();
}

export async function getAnchorCount(address: string): Promise<number> {
  // Uses on-chain read — low frequency, only called at dashboard load
  const { fetchCallReadOnlyFunction } = await import('@stacks/transactions');
  const result = await fetchCallReadOnlyFunction({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'veritasbtc-anchors',
    functionName: 'get-anchor-count',
    functionArgs: [principalCV(address)],
    senderAddress: address,
  });
  return Number(cvToJSON(result).value ?? 0);
}

export async function isInTrustCircle(owner: string, member: string): Promise<boolean> {
  const { fetchCallReadOnlyFunction } = await import('@stacks/transactions');
  const result = await fetchCallReadOnlyFunction({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'veritasbtc-identity',
    functionName: 'is-in-trust-circle',
    functionArgs: [principalCV(owner), principalCV(member)],
    senderAddress: owner,
  });
  const v = cvToJSON(result);
  return v.value === true || v === true;
}

// ─── Writes — wallet-signed, browser only ────────────────────────────────────

export function callRegisterIdentity(
  name: string,
  callbacks: { onFinish: (d: unknown) => void; onCancel: () => void }
) {
  lazyOpenContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'veritasbtc-identity',
    functionName: 'register-identity',
    functionArgs: [stringAsciiCV(name)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    ...callbacks,
  });
}

export function callAnchorContent(
  hashBuffer: ArrayBuffer,
  contentType: string,
  label: string,
  callbacks: { onFinish: (d: unknown) => void; onCancel: () => void }
) {
  lazyOpenContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'veritasbtc-anchors',
    functionName: 'anchor-content',
    functionArgs: [
      bufferCV(new Uint8Array(hashBuffer)),
      stringAsciiCV(contentType),
      stringAsciiCV(label.slice(0, 50)),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    ...callbacks,
  });
}

export function callAddToTrustCircle(
  member: string,
  callbacks: { onFinish: (d: unknown) => void; onCancel: () => void }
) {
  lazyOpenContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'veritasbtc-identity',
    functionName: 'add-to-trust-circle',
    functionArgs: [principalCV(member)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    ...callbacks,
  });
}

export function callRemoveFromTrustCircle(
  member: string,
  callbacks: { onFinish: (d: unknown) => void; onCancel: () => void }
) {
  lazyOpenContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'veritasbtc-identity',
    functionName: 'remove-from-trust-circle',
    functionArgs: [principalCV(member)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    ...callbacks,
  });
}

// ─── TX polling via cached backend route ─────────────────────────────────────

export async function pollTx(
  txId: string,
  timeoutMs = 180_000
): Promise<{ success: boolean; blockHeight?: number }> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`/api/tx?txId=${txId}`);
      if (res.ok) {
        const data = await res.json() as Record<string, unknown>;
        if (data.tx_status === 'success') return { success: true, blockHeight: data.block_height as number };
        if (typeof data.tx_status === 'string' && data.tx_status.startsWith('abort')) return { success: false };
      }
    } catch { /* transient error — keep polling */ }
    await new Promise(r => setTimeout(r, 4_000));
  }
  return { success: false };
}

export async function fetchStxBalance(address: string): Promise<string | null> {
  try {
    const res = await fetch(`${HIRO_API}/v2/accounts/${address}?proof=0`);
    const d = await res.json();
    const micro = parseInt(d.balance, 16);
    return isNaN(micro) ? null : (micro / 1_000_000).toFixed(2);
  } catch { return null; }
}

export function sha256(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', buffer);
}

export { buf2hex } from './clarity';

// ─── LocalStorage ─────────────────────────────────────────────────────────────

const HISTORY_KEY = 'veritas-anchor-history';
const CIRCLES_KEY = 'veritas-trust-circles';

export interface AnchorRecord {
  hash: string;
  txId: string;
  contentType: string;
  owner: string;
  blockHeight: number | string;
  fileName: string;
  date: string;
}

export function getHistory(): AnchorRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
export function saveHistory(h: AnchorRecord[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}
export function getCircles(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(CIRCLES_KEY) || '[]'); } catch { return []; }
}
export function saveCircles(c: string[]) {
  localStorage.setItem(CIRCLES_KEY, JSON.stringify(c));
}
