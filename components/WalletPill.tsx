'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { fetchStxBalance } from '@/lib/stacks';
import { IS_TESTNET } from '@/lib/config';
import { explorerAddressUrl } from '@/lib/config';

function trunc(a: string) { return `${a.slice(0, 6)}…${a.slice(-4)}`; }

export default function WalletPill() {
  const { address, isLoading, connect, disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (address) fetchStxBalance(address).then(setBalance);
  }, [address]);

  if (isLoading) return null;

  if (!address) {
    return (
      <button className="btn-ghost btn-sm" onClick={() => connect()}>
        Log In
      </button>
    );
  }

  function copyAddress() {
    navigator.clipboard.writeText(address!).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className={`nw-wrap${open ? ' open' : ''}`}>
      <button
        className="nw-pill"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
      >
        <span className="nw-status" />
        <span className="nw-addr">{trunc(address)}</span>
        {IS_TESTNET && <span className="nw-net-badge">Testnet</span>}
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="nw-chevron">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="nw-dropdown" onClick={e => e.stopPropagation()}>
            <div className="nw-dd-head">
              <div className="nw-dd-label">Connected Wallet</div>
              <div className="nw-dd-full">{address}</div>
              <button className="nw-dd-copy" onClick={copyAddress}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>{copied ? 'Copied!' : 'Copy address'}</span>
              </button>
            </div>
            <div className="nw-dd-balance">
              <span className="nw-dd-bal-val">{balance ?? '—'}</span>
              <span className="nw-dd-bal-unit">STX</span>
            </div>
            <div className="nw-dd-links">
              <a href="/dashboard" className="nw-dd-link">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="2" />
                </svg>
                Dashboard
              </a>
              <a href={explorerAddressUrl(address)} target="_blank" rel="noopener" className="nw-dd-link">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                View on Explorer
              </a>
            </div>
            <button className="nw-dd-signout" onClick={disconnect}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Disconnect
            </button>
          </div>
          <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  );
}
