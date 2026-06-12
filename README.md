# VeritasBTC

> Bitcoin-native content authentication. Anchor any file to the Bitcoin blockchain in under 3 seconds — creating irrefutable proof of authenticity that no one can fake, alter, or delete.

**Live contracts on Stacks mainnet** — `SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK`

---

## SDK

The official JavaScript/TypeScript SDK is published on npm:

```bash
npm install veritasbtc-sdk
```

```typescript
import { createClient } from 'veritasbtc-sdk';

const veritas = createClient(); // mainnet by default

const result = await veritas.verify(file);
console.log(result.verified);   // true / false
console.log(result.anchor);     // on-chain record
console.log(result.identity);   // owner identity
```

Full SDK docs: [npmjs.com/package/veritasbtc-sdk](https://www.npmjs.com/package/veritasbtc-sdk) · [SDK source](https://github.com/Gbangbolaoluwagbemiga/veritasbtc-sdk)

---

## What It Does

VeritasBTC lets anyone prove that a file existed, unchanged, at a specific point in time — by writing a cryptographic fingerprint (SHA-256 hash) to the Stacks blockchain, which is anchored to every Bitcoin block.

- **Files never leave your device.** Only the 32-byte hash is sent to the blockchain.
- **Permanent and tamper-proof.** Once anchored, no one — not even us — can alter or remove the record.
- **Instantly verifiable.** Anyone with the original file can verify its authenticity in seconds, no account required.

**Use cases:** journalism, legal evidence, creative copyright, academic research, medical records, supply chain, NFT provenance.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  veritasbtc-sdk  (npm: veritasbtc-sdk)                   │
│  Zero-dep TypeScript SDK — verify any file in 3 lines    │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTP
                           ▼
┌──────────────────────────────────────────────────────────┐
│  Next.js 16 App (this repo)                              │
│  • /dashboard     — anchor, verify, trust circles        │
│  • /verify        — public certificate verification      │
│  • /pricing       — plan management                      │
│  • /how-it-works, /products, /why-bitcoin                │
│                                                          │
│  API Proxy Layer (server-side cache)                     │
│  • GET /api/anchor?hash=   TTL: 1 hour                   │
│  • GET /api/identity?address=  TTL: 10 min               │
│  • GET /api/tx?txId=       TTL: 4s pending / 1 day done  │
│  • GET /api/stats          TTL: 5 min                    │
└──────────────────┬───────────────────────────────────────┘
                   │ @stacks/connect (writes) · Hiro API (reads)
                   ▼
┌──────────────────────────────────────────────────────────┐
│  Stacks L2 (Bitcoin-anchored)                            │
│  veritasbtc-identity.clar  — identity registry           │
│  veritasbtc-anchors.clar   — content fingerprints        │
└──────────────────────────────────────────────────────────┘
                   │ anchored to every block
                   ▼
          ₿  Bitcoin Mainnet
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, App Router, Turbopack |
| Wallet auth | `@stacks/connect` v8 (Leather / Xverse) |
| Contract writes | `@stacks/transactions` v7 |
| Contract reads | In-house TTL cache → Hiro API (no rate limits) |
| Smart contracts | Clarity 2 on Stacks (separate repo) |
| SDK | `veritasbtc-sdk` — zero-dependency, ESM + CJS |
| Styling | Vanilla CSS with CSS custom properties |
| Deployment | Vercel (recommended) |

---

## Local Development

### Prerequisites

- Node.js 20+
- A Stacks wallet: [Leather](https://leather.io) or [Xverse](https://xverse.app)

### Setup

```bash
git clone https://github.com/Gbangbolaoluwagbemiga/veritasbtc.git
cd veritasbtc
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### Network Config

No `.env` file needed. All config lives in `lib/config.ts`:

```ts
export const IS_TESTNET = false;  // switch to true for testnet development
export const CONTRACT_ADDRESS = 'SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK';
```

---

## Project Structure

```
veritasbtc/
├── app/
│   ├── api/
│   │   ├── anchor/route.ts       # GET /api/anchor?hash= — 1h cache
│   │   ├── identity/route.ts     # GET /api/identity?address= — 10m cache
│   │   ├── tx/route.ts           # GET /api/tx?txId= — 4s/1d cache
│   │   └── stats/route.ts        # GET /api/stats — 5m cache
│   ├── dashboard/
│   │   ├── DashboardClient.tsx   # full dashboard UI (anchor, verify, circles, history)
│   │   ├── dashboard.css         # dashboard-specific styles
│   │   └── page.tsx              # SSR-safe wrapper (dynamic import, ssr:false)
│   ├── verify/
│   │   └── page.tsx              # public certificate verification — no wallet needed
│   ├── pricing/                  # plan selection + FAQ
│   ├── how-it-works/             # product education
│   ├── products/                 # product suite overview
│   ├── why-bitcoin/              # Bitcoin trust narrative
│   ├── globals.css               # all global styles
│   ├── layout.tsx                # root layout with fonts + nav
│   ├── not-found.tsx             # branded 404 page
│   └── page.tsx                  # landing page
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx       # hex-rain canvas animation + cert card
│   │   ├── InstantVerify.tsx     # client-side SHA-256 drop zone widget
│   │   ├── HowItWorksSection.tsx
│   │   └── PricingPreview.tsx
│   ├── NavbarClient.tsx          # scroll + mobile hamburger logic
│   ├── Navbar.tsx                # nav markup with WalletPill
│   ├── WalletPill.tsx            # address pill, STX balance, disconnect dropdown
│   ├── AnnounceBar.tsx           # dismissible launch banner
│   ├── Footer.tsx
│   └── ScrollReveal.tsx
├── hooks/
│   ├── useWallet.ts              # SSR-safe wallet state (lazy require pattern)
│   └── usePlan.ts                # plan tier + trial management
└── lib/
    ├── config.ts                 # network + contract address constants
    ├── stacks.ts                 # contract call helpers (reads → /api/*, writes → wallet)
    ├── cache.ts                  # TTL in-memory cache (anchor/identity/tx/stats)
    ├── hiro.ts                   # fetchWithRetry — exponential backoff, 429 handling
    ├── clarity.ts                # zero-dep Clarity codec (bufferCV, principalCV)
    └── plan.ts                   # plan logic + localStorage persistence
```

---

## Key Implementation Notes

### SSR Safety
`@stacks/connect` references browser globals at module evaluation time. All Stacks imports are lazy-required inside functions — never at module level. The dashboard uses `dynamic(() => import('./DashboardClient'), { ssr: false })`.

### Backend Caching (Scale)
All read-only contract calls are proxied through `/api/*` route handlers with in-memory TTL caching. Anchors are immutable once written, so they cache for 1 hour. A single cached response serves thousands of users without hitting Hiro's rate limits.

### Wallet Flow
1. User clicks "Connect" → `showConnect()` opens the Hiro wallet modal
2. On finish → session stored in Gaia (encrypted), user redirected to `/dashboard`
3. Dashboard reads address from `userSession.loadUserData()`, selects testnet or mainnet address based on `IS_TESTNET`

### Content Anchoring Flow
1. User drops a file → `crypto.subtle.digest('SHA-256', buffer)` runs in the browser — file never leaves the device
2. 32-byte hash passed to `openContractCall` → `anchor-content` on the Stacks chain
3. TX broadcast, `pollTx()` polls `/api/tx` every 4 seconds for confirmation
4. On success → certificate modal with QR code, block height, and shareable `/verify?hash=...` link

### Public Verification
Anyone can verify a file at `/verify?hash=<64-char-hex>` — no wallet required. Calls `/api/anchor` (cached) and displays owner, block height, content type, and Stacks Explorer links.

---

## Smart Contracts

Contracts live in a separate repo: [veritasbtc-contracts](https://github.com/Gbangbolaoluwagbemiga/veritasbtc-contracts)

| Contract | Mainnet Address |
|---|---|
| `veritasbtc-identity` | `SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK.veritasbtc-identity` |
| `veritasbtc-anchors` | `SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK.veritasbtc-anchors` |

View on Stacks Explorer: https://explorer.hiro.so/address/SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK

---

## Deploying to Vercel

1. Push this repo to GitHub (already done)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import `veritasbtc`
3. Framework: **Next.js** (auto-detected)
4. No environment variables required
5. Click **Deploy**

Every push to `main` will trigger an automatic redeploy.

---

## Ecosystem

| Package | Status | Install |
|---|---|---|
| `veritasbtc-sdk` | ✅ Live on npm | `npm install veritasbtc-sdk` |
| `@veritasbtc/react` | Planned | React component library |
| `@veritasbtc/badge` | Planned | Framework-agnostic web component |

---

## Roadmap

- [x] `veritasbtc-sdk` — published on npm, zero-dependency, full TypeScript
- [ ] `@veritasbtc/react` — React component library: `<VerifyBadge>`, `<AnchorButton>`, `<CertificateCard>`
- [ ] `@veritasbtc/badge` — framework-agnostic web component for embedding proof badges
- [ ] Lemon Squeezy billing integration (Pro / Business tiers)
- [ ] Batch anchoring UI for Business plan
- [ ] Upstash Redis for distributed caching (multi-region Vercel deployments)
- [ ] REST API for enterprise integrations

---

## Contributing

Issues and PRs welcome. The on-chain contracts are immutable, but the frontend, SDK, and badge packages are open for community contribution.

---

## License

MIT
