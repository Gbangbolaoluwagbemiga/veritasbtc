'use client';

import './verify.css';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAnchor } from '@/lib/stacks';
import { explorerBlockUrl, explorerAddressUrl } from '@/lib/config';

interface AnchorData {
  owner: string;
  block: string | number;
  contentType: string;
  label: string;
}

function VerifyContent() {
  const params = useSearchParams();
  const hash = params.get('hash') ?? '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle');
  const [data, setData] = useState<AnchorData | null>(null);

  useEffect(() => {
    if (!hash || hash.length !== 64) {
      setStatus('idle');
      return;
    }
    setStatus('loading');
    const buf = new Uint8Array(hash.match(/.{2}/g)!.map(b => parseInt(b, 16))).buffer;
    getAnchor(buf)
      .then(result => {
        if (result.type === 'some' || result.value) {
          const v = result.value ?? result;
          setData({
            owner: v.owner?.value ?? v.owner ?? '',
            block: v['block-height']?.value ?? v.block ?? '?',
            contentType: v['content-type']?.value ?? v.contentType ?? 'unknown',
            label: v.label?.value ?? v.label ?? '',
          });
          setStatus('found');
        } else {
          setStatus('notfound');
        }
      })
      .catch(() => setStatus('error'));
  }, [hash]);

  const shortHash = hash ? `${hash.slice(0, 12)}...${hash.slice(-8)}` : '';

  return (
    <div className="vp-wrap">
      <div className="vp-card">
        {/* Header */}
        <div className="vp-brand">
          <Link href="/" className="vp-logo">VeritasBTC</Link>
          <span className="vp-tagline">Bitcoin Content Verification</span>
        </div>

        {!hash && (
          <div className="vp-state">
            <div className="vp-state-icon">🔍</div>
            <div className="vp-state-title">No Hash Provided</div>
            <p className="vp-state-desc">This page verifies a file&apos;s Bitcoin anchor. Share a certificate link to verify a specific file.</p>
            <Link href="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: 16, display: 'inline-flex' }}>
              Back to Home
            </Link>
          </div>
        )}

        {hash && status === 'loading' && (
          <div className="vp-state">
            <div className="vp-spinner" />
            <div className="vp-state-title">Querying Bitcoin...</div>
            <p className="vp-state-desc">Checking the Stacks blockchain for hash <code className="vp-hash-inline">{shortHash}</code></p>
          </div>
        )}

        {status === 'found' && data && (
          <>
            <div className="vp-result vp-result--authentic">
              <div className="vp-result-icon">✅</div>
              <div className="vp-result-title">AUTHENTIC</div>
              <div className="vp-result-sub">Bitcoin Record Found · Content Not Altered</div>
            </div>

            <div className="vp-rows">
              <div className="vp-row">
                <span className="vp-key">SHA-256 Hash</span>
                <span className="vp-val vp-mono">{shortHash}</span>
              </div>
              {data.label && (
                <div className="vp-row">
                  <span className="vp-key">Label</span>
                  <span className="vp-val">{data.label}</span>
                </div>
              )}
              <div className="vp-row">
                <span className="vp-key">Content Type</span>
                <span className="vp-val">{data.contentType}</span>
              </div>
              <div className="vp-row">
                <span className="vp-key">Anchored By</span>
                <a href={explorerAddressUrl(data.owner)} target="_blank" rel="noopener noreferrer" className="vp-val vp-mono vp-link">
                  {data.owner.slice(0, 8)}...{data.owner.slice(-6)}
                </a>
              </div>
              <div className="vp-row">
                <span className="vp-key">Bitcoin Block</span>
                <a href={explorerBlockUrl(data.block)} target="_blank" rel="noopener noreferrer" className="vp-val vp-link" style={{ color: 'var(--bitcoin)' }}>
                  #{data.block}
                </a>
              </div>
            </div>

            <div className="vp-actions">
              <a href={explorerBlockUrl(data.block)} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ textDecoration: 'none' }}>
                View on Explorer ↗
              </a>
              <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
                Anchor Your Files
              </Link>
            </div>
          </>
        )}

        {status === 'notfound' && (
          <div className="vp-state">
            <div className="vp-state-icon">⚠️</div>
            <div className="vp-result vp-result--fake" style={{ marginBottom: 20 }}>
              <div className="vp-result-title" style={{ color: 'var(--red)' }}>NOT FOUND</div>
              <div className="vp-result-sub" style={{ color: 'var(--text-muted)' }}>No Bitcoin record for this fingerprint</div>
            </div>
            <p className="vp-state-desc">
              Hash <code className="vp-hash-inline">{shortHash}</code> has no anchor on Bitcoin.
              The file may have been altered, or was never anchored.
            </p>
            <Link href="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: 16, display: 'inline-flex' }}>
              Anchor Your Files
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="vp-state">
            <div className="vp-state-icon">🔌</div>
            <div className="vp-state-title">Network Error</div>
            <p className="vp-state-desc">Could not reach the Stacks network. Please try again.</p>
            <button className="btn-ghost" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>
              Retry
            </button>
          </div>
        )}

        <div className="vp-footer">
          Powered by <strong>VeritasBTC</strong> · Bitcoin-anchored content verification
          <br />
          <Link href="/" style={{ color: 'var(--bitcoin)', textDecoration: 'none', fontSize: '0.78rem' }}>
            Anchor your own files →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="vp-wrap">
        <div className="vp-card">
          <div className="vp-state">
            <div className="vp-spinner" />
          </div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
