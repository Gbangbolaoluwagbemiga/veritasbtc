interface CacheEntry<T> { value: T; expiresAt: number; }

class TTLCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) { this.store.delete(key); return undefined; }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  has(key: string): boolean { return this.get(key) !== undefined; }
}

// Module-level singletons — persist across requests in the same serverless instance
export const anchorCache = new TTLCache<unknown>();   // 1 hour — on-chain data is immutable
export const identityCache = new TTLCache<unknown>(); // 10 min
export const txCache = new TTLCache<unknown>();        // permanent once confirmed
export const statsCache = new TTLCache<unknown>();     // 5 min

export const TTL = {
  ANCHOR: 60 * 60 * 1000,       // 1 hour — anchors never change
  IDENTITY: 10 * 60 * 1000,     // 10 min — identities rarely change
  TX_PENDING: 4 * 1000,         // 4 sec — poll until confirmed
  TX_CONFIRMED: 24 * 60 * 60 * 1000, // 1 day — confirmed TXes are permanent
  STATS: 5 * 60 * 1000,         // 5 min
} as const;
