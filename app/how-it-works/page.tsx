import Link from 'next/link';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import FaqAccordion from './FaqAccordion';

export const metadata = {
  title: 'How It Works — VeritasBTC',
  description:
    'Learn exactly how VeritasBTC anchors your content to Bitcoin in 3 seconds. SHA-256 fingerprinting, Stacks Protocol, and Bitcoin permanence explained.',
};

export default function HowItWorksPage() {
  return (
    <>
      <ScrollReveal />

      {/* Page hero */}
      <section className="page-hero">
        <div className="page-hero-bg">
          <div className="hero-orb hero-orb--orange" style={{ opacity: 0.6 }} />
          <div className="hero-grid" />
        </div>
        <div className="container">
          <div className="section-label reveal" data-delay="0">How It Works</div>
          <h1 className="page-hero-title reveal" data-delay="1">
            Three steps.<br /><span className="text-grad-orange">Permanent proof.</span>
          </h1>
          <p className="page-hero-sub reveal" data-delay="2">
            No uploads. No cloud. No trust required. Your file never leaves your device —
            only its cryptographic fingerprint touches the blockchain.
          </p>
        </div>
      </section>

      {/* Step by step */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="hiw-steps">

            <div className="hiw-step reveal" data-delay="0">
              <div className="hiw-step-num">01</div>
              <div className="hiw-step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="1.5" />
                  <path d="M8 12h8M12 8v8" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Select your file</h3>
              <p>
                Drop any file — photo, PDF, audio, video, contract — into the VeritasBTC
                dashboard. The file is read directly in your browser using the Web Crypto API.{' '}
                <strong>It never leaves your device.</strong>
              </p>
              <div className="hiw-step-detail">
                <span className="hiw-pill">Any file type</span>
                <span className="hiw-pill">No upload</span>
                <span className="hiw-pill">100% local</span>
              </div>
            </div>

            <div className="hiw-step-arrow" aria-hidden="true">→</div>

            <div className="hiw-step reveal" data-delay="1">
              <div className="hiw-step-num">02</div>
              <div className="hiw-step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="4" fill="rgba(247,147,26,0.1)" stroke="#F7931A" strokeWidth="1.5" />
                  <path d="M7 12h2l2-4 2 8 2-4h2" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>SHA-256 fingerprint</h3>
              <p>
                Your browser computes a SHA-256 hash of the file — a unique 64-character
                hexadecimal string. Change even one pixel, and the hash is completely
                different. This fingerprint is mathematically irreversible.
              </p>
              <div className="hiw-step-detail">
                <div className="hiw-hash-demo">
                  <span className="hiw-hash-label">SHA-256:</span>
                  <span className="hiw-hash-value">a3f7b29e1c4d8f0e7b2a5c3d9e1f4a8b…</span>
                </div>
              </div>
            </div>

            <div className="hiw-step-arrow" aria-hidden="true">→</div>

            <div className="hiw-step reveal" data-delay="2">
              <div className="hiw-step-num">03</div>
              <div className="hiw-step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.1 3.5 9.1 8 10.3C16.5 21.1 20 17.1 20 12V6L12 2z" fill="rgba(247,147,26,0.1)" stroke="#F7931A" strokeWidth="1.5" />
                  <path d="M8.5 12l2.5 2.5 5-5" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Anchored to Bitcoin</h3>
              <p>
                The fingerprint is submitted to the Stacks smart contract, which writes it
                to the Bitcoin blockchain. Within seconds, your content&apos;s hash is permanently
                part of a block that cannot be altered, censored, or deleted.
              </p>
              <div className="hiw-step-detail">
                <span className="hiw-pill hiw-pill--green">₿ Bitcoin Block #902,441</span>
                <span className="hiw-pill">~3 seconds</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section className="section hiw-privacy-section">
        <div className="container">
          <div className="hiw-privacy-grid">
            <div className="reveal" data-delay="0">
              <div className="section-label">Privacy by Design</div>
              <h2 className="section-title">
                What we store.<br /><span className="text-grad-orange">What we never see.</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>
                VeritasBTC stores only a mathematical fingerprint — never your content.
                The SHA-256 hash cannot be reversed to reconstruct your file. Think of it
                as a seal, not a copy.
              </p>
              <div className="hiw-privacy-list">
                <div className="hiw-priv-item hiw-priv-item--yes">
                  <span className="hiw-priv-icon">✓</span>
                  <div>
                    <strong>SHA-256 hash</strong>
                    <span>64 hex characters. Stored on Bitcoin forever.</span>
                  </div>
                </div>
                <div className="hiw-priv-item hiw-priv-item--yes">
                  <span className="hiw-priv-icon">✓</span>
                  <div>
                    <strong>Block number &amp; timestamp</strong>
                    <span>When the anchor was confirmed on Bitcoin.</span>
                  </div>
                </div>
                <div className="hiw-priv-item hiw-priv-item--yes">
                  <span className="hiw-priv-icon">✓</span>
                  <div>
                    <strong>Your Stacks address</strong>
                    <span>Public proof of ownership.</span>
                  </div>
                </div>
                <div className="hiw-priv-item hiw-priv-item--no">
                  <span className="hiw-priv-icon hiw-priv-icon--no">✗</span>
                  <div>
                    <strong>Your file content</strong>
                    <span>Never uploaded, never stored anywhere.</span>
                  </div>
                </div>
                <div className="hiw-priv-item hiw-priv-item--no">
                  <span className="hiw-priv-icon hiw-priv-icon--no">✗</span>
                  <div>
                    <strong>Metadata or filename</strong>
                    <span>Only what you explicitly choose to label it.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hiw-privacy-visual reveal" data-delay="1">
              <div className="hiw-pv-card">
                <div className="hiw-pv-row">
                  <div className="hiw-pv-label">Your device</div>
                  <div className="hiw-pv-file">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="2" width="18" height="20" rx="3" fill="rgba(247,147,26,0.1)" stroke="#F7931A" strokeWidth="1.2" />
                    </svg>
                    press-conference.jpg
                  </div>
                </div>
                <div className="hiw-pv-arrow">↓ SHA-256 only</div>
                <div className="hiw-pv-row">
                  <div className="hiw-pv-label">Stacks contract</div>
                  <div className="hiw-pv-hash">a3f7b29e1c4d8f0e…</div>
                </div>
                <div className="hiw-pv-arrow">↓ settled in Bitcoin block</div>
                <div className="hiw-pv-row">
                  <div className="hiw-pv-label">Bitcoin blockchain</div>
                  <div className="hiw-pv-block">₿ Block #902,441 · Jun 11 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification section */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-label reveal" data-delay="0">Verification</div>
          <h2 className="section-title reveal" data-delay="1">
            Anyone can verify.<br /><span className="text-grad-orange">No account needed.</span>
          </h2>
          <p className="section-sub reveal" data-delay="2">
            Share a QR code or a link. The recipient drops the same file into the verify
            page — their browser hashes it locally and queries Bitcoin. Authentic or fake —
            answered in under a second.
          </p>
          <div className="hiw-verify-grid reveal" data-delay="3">
            <div className="hiw-verify-step">
              <div className="hiw-vs-num">1</div>
              <p>Recipient receives the file and your VeritasBTC certificate link or QR code</p>
            </div>
            <div className="hiw-vs-arrow">→</div>
            <div className="hiw-verify-step">
              <div className="hiw-vs-num">2</div>
              <p>They drop the file into the verify page — hashed locally, no upload</p>
            </div>
            <div className="hiw-vs-arrow">→</div>
            <div className="hiw-verify-step">
              <div className="hiw-vs-num">3</div>
              <p>Bitcoin ledger is queried. Match = AUTHENTIC. No match = FAKE or ALTERED.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-label reveal" data-delay="0">FAQ</div>
          <h2 className="section-title reveal" data-delay="1">Common questions</h2>
          <FaqAccordion
            items={[
              {
                q: "What happens if Bitcoin goes down?",
                a: "Bitcoin has been online with 99.98% uptime for 16 years. Your anchor is in thousands of nodes globally. No single point of failure.",
              },
              {
                q: "Can I anchor a 10 GB video?",
                a: "Yes. File size doesn't matter — we only hash it. The SHA-256 computation is done in your browser and takes a few seconds even for large files.",
              },
              {
                q: "Is my content private?",
                a: "Completely. Only the mathematical fingerprint is stored on-chain. The hash cannot be reversed to reveal your content. No one at VeritasBTC ever sees your files.",
              },
              {
                q: "What if I lose the original file?",
                a: "The anchor on Bitcoin proves the file existed at a specific block time. To verify, you or anyone else needs the original file — which is by design. Store your originals safely.",
              },
              {
                q: "What blockchain is used?",
                a: "Stacks (a Bitcoin Layer 2) is used for smart contract execution. Every Stacks transaction is settled and secured by Bitcoin's proof-of-work. The anchor is ultimately in Bitcoin.",
              },
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-surface)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title reveal" data-delay="0">Ready to anchor your first file?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }} className="reveal" data-delay="1">
            Free forever plan. No credit card. Takes 30 seconds to set up.
          </p>
          <Link href="/pricing" className="btn-primary btn-lg reveal" data-delay="2">
            Start for Free →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
