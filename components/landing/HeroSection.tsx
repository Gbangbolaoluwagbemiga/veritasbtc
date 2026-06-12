'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';

const QR_PATTERN = [
  [1,1,1,1,1,1,1,0],
  [1,0,0,0,0,0,1,0],
  [1,0,1,1,1,0,1,0],
  [1,0,0,0,0,0,1,0],
  [1,1,1,1,1,1,1,0],
  [0,0,1,0,0,1,0,1],
  [1,1,0,1,1,0,1,0],
  [0,1,0,0,1,0,1,1],
];

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { address, connect } = useWallet();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const HEX = '0123456789abcdef';
    const COL_W = 18;
    let animId: number;
    let lastTime = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let cols = Math.floor(canvas.width / COL_W);
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -50);
    const speeds: number[] = Array.from({ length: cols }, () => 0.15 + Math.random() * 0.25);
    const bright: boolean[] = Array.from({ length: cols }, () => Math.random() > 0.85);

    function draw(ts: number) {
      if (!canvas) return;
      if (ts - lastTime < 50) { animId = requestAnimationFrame(draw); return; }
      lastTime = ts;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = 'rgba(5,5,8,0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${COL_W - 2}px monospace`;

      for (let i = 0; i < cols; i++) {
        const isBright = bright[i];
        const alpha = isBright ? 0.9 : (0.06 + Math.random() * 0.1);
        ctx.fillStyle = `rgba(247,147,26,${alpha})`;
        const char = HEX[Math.floor(Math.random() * HEX.length)];
        ctx.fillText(char, i * COL_W, drops[i] * COL_W);

        drops[i] += speeds[i];
        if (drops[i] * COL_W > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          bright[i] = Math.random() > 0.85;
        }
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  function handlePrimaryCTA() {
    if (address) {
      window.location.href = '/dashboard';
    } else {
      connect();
    }
  }

  return (
    <>
      <section className="hero">
        <canvas id="hero-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="hero-scan" aria-hidden="true" />

        <div className="hero-split-wrap">
          {/* Left */}
          <div className="hero-left">
            <div className="hero-badge">🔐 Bitcoin-Native Content Verification</div>

            <h1 className="hero-title">
              The internet <span className="strike">lies.</span>
              <br />
              <span className="text-grad-orange">Bitcoin doesn&apos;t.</span>
            </h1>

            <p className="hero-sub">
              Anchor any file — photo, document, voice note, video — to the Bitcoin blockchain in
              under 3 seconds. Create irrefutable proof of authenticity that no one can fake,
              alter, or delete.
            </p>

            <div className="hero-ctas">
              <button className="btn-primary btn-lg" onClick={handlePrimaryCTA}>
                Start Protecting Free →
              </button>
              <Link href="/how-it-works" className="btn-ghost btn-lg">
                See How It Works
              </Link>
            </div>

            <div className="trust-strip">
              <div className="trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 7v10c0 7.5 5.2 13.4 12 15 6.8-1.6 12-7.5 12-15V7L16 2z" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="1.5" />
                  <path d="M8.5 12l2.5 2.5 5-5" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Bitcoin-secured
              </div>
              <div className="trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#10D48E" strokeWidth="1.5" />
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="#10D48E" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Files never leave device
              </div>
              <div className="trust-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#A855F7" strokeWidth="1.5" />
                  <path d="M12 6v6l4 2" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Permanent proof
              </div>
            </div>
          </div>

          {/* Right — certificate card */}
          <div className="hero-right">
            <div className="hero-cert hc-verified">
              <div className="hc-brand">
                VeritasBTC <span className="hc-net">MAINNET</span>
              </div>
              <div className="hc-authentic">✓ AUTHENTIC</div>
              <div className="hc-file-row">
                <span className="hc-file-icon">📸</span>
                <span className="hc-file-name">photo_evidence_2026.jpg</span>
              </div>
              <div className="hc-hash-row">
                SHA-256: <span className="hc-hash">a3f8b2e9c1d7...</span>
              </div>
              <div className="hc-chain-row">
                Bitcoin Block <span style={{ color: 'var(--bitcoin)' }}>#893,412</span>
              </div>
              <div className="hc-footer">
                <div className="hc-qr" aria-hidden="true">
                  {QR_PATTERN.map((row, ri) => (
                    <div key={ri} className="hc-qr-row">
                      {row.map((cell, ci) => (
                        <div
                          key={ci}
                          className="hc-qr-cell"
                          style={{ background: cell ? '#F7931A' : 'transparent' }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="hc-stamp">ANCHORED</div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="hf-card hf-card--1">
              🔒 Tamper-Proof · Bitcoin Secured
            </div>
            <div className="hf-card hf-card--2">
              ⚡ 3 sec confirmation
            </div>
            <div className="hf-card hf-card--3">
              10,847 documents anchored
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hs-num">10,847+</div>
          <div className="hs-label">Documents Anchored</div>
        </div>
        <div className="hero-stat-div" />
        <div className="hero-stat">
          <div className="hs-num">3,241</div>
          <div className="hs-label">Identities Verified</div>
        </div>
        <div className="hero-stat-div" />
        <div className="hero-stat">
          <div className="hs-num">99.9%</div>
          <div className="hs-label">Uptime Since 2009</div>
        </div>
      </div>
    </>
  );
}
