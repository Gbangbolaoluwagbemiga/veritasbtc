import { HIRO_API, CONTRACT_ADDRESS } from './config';

const MAX_RETRIES = 3;
const BASE_DELAY = 400;

async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, BASE_DELAY * 2 ** (attempt - 1)));
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 429) {
        const retry = Number(res.headers.get('Retry-After') ?? 2);
        await new Promise(r => setTimeout(r, retry * 1000));
        continue;
      }
      return res;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function callReadOnly(
  contractName: string,
  fnName: string,
  args: string[],
  sender = CONTRACT_ADDRESS
): Promise<unknown> {
  const url = `${HIRO_API}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${contractName}/${fnName}`;
  const res = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, arguments: args }),
  });
  if (!res.ok) throw new Error(`Hiro API ${res.status}: ${url}`);
  const data = await res.json();
  if (!data.okay) throw new Error(`Clarity error in ${fnName}: ${data.cause}`);
  return data.result;
}

export async function fetchHiro(path: string): Promise<unknown> {
  const res = await fetchWithRetry(`${HIRO_API}${path}`);
  if (!res.ok) throw new Error(`Hiro API ${res.status}: ${path}`);
  return res.json();
}
