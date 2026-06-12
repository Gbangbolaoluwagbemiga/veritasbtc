import Link from 'next/link';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: 'Products — VeritasBTC',
  description:
    'VeritasBTC products for individuals, journalists, businesses and developers. Protect every photo, contract, invoice, and voice note with Bitcoin.',
};

export default function ProductsPage() {
  return (
    <>
      <ScrollReveal />

      {/* Page hero */}
      <section className="page-hero">
        <div className="page-hero-bg">
          <div className="hero-orb hero-orb--orange" style={{ opacity: 0.5 }} />
          <div className="hero-grid" />
        </div>
        <div className="container">
          <div className="section-label reveal" data-delay="0">Products</div>
          <h1 className="page-hero-title reveal" data-delay="1">
            Every tool to<br /><span className="text-grad-orange">prove what&apos;s real.</span>
          </h1>
          <p className="page-hero-sub reveal" data-delay="2">
            From personal photo protection to enterprise invoice fraud shields — every
            product anchors to the same immutable Bitcoin record.
          </p>
        </div>
      </section>

      {/* Product grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="prod-grid">

            {/* Personal Shield */}
            <div className="prod-card reveal" data-delay="0">
              <div className="prod-icon" style={{ background: 'rgba(16,212,142,0.1)', borderColor: 'rgba(16,212,142,0.2)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.1 3.5 9.1 8 10.3C16.5 21.1 20 17.1 20 12V6L12 2z" fill="rgba(16,212,142,0.15)" stroke="#10D48E" strokeWidth="1.5" />
                  <path d="M8.5 12l2.5 2.5 5-5" stroke="#10D48E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Personal Shield</h3>
              <p className="prod-desc">
                Protect your photos, voice notes, and personal documents. Perfect for
                journalists, creators, and anyone who produces original content.
              </p>
              <ul className="prod-features">
                <li>25 free anchors per month</li>
                <li>Drag-and-drop dashboard</li>
                <li>Shareable QR certificates</li>
                <li>Certificate history wallet</li>
                <li>Instant public verification</li>
              </ul>
              <div className="prod-use-cases">
                <span>Photographers</span><span>Journalists</span><span>Creators</span>
              </div>
              <Link href="/pricing" className="btn-ghost" style={{ marginTop: 'auto' }}>
                Start Free →
              </Link>
            </div>

            {/* Trust Circle */}
            <div className="prod-card prod-card--featured reveal" data-delay="1">
              <div className="prod-card-badge">Most Loved</div>
              <div className="prod-icon" style={{ background: 'rgba(247,147,26,0.1)', borderColor: 'rgba(247,147,26,0.2)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="7" r="4" fill="rgba(247,147,26,0.1)" stroke="#F7931A" strokeWidth="1.5" />
                  <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="17" cy="9" r="3" fill="rgba(247,147,26,0.1)" stroke="#F7931A" strokeWidth="1.5" />
                  <path d="M21 21v-1.5a3 3 0 00-2-2.83" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Trust Circle</h3>
              <p className="prod-desc">
                Build a private network of verified identities you trust. When a document
                comes from someone in your Trust Circle, you know it&apos;s real — anchored by
                Bitcoin, not by their word.
              </p>
              <ul className="prod-features">
                <li>Unlimited anchoring</li>
                <li>Up to 10 trusted contacts</li>
                <li>Live identity verification</li>
                <li>Real-time notifications</li>
                <li>Shared certificate vault</li>
              </ul>
              <div className="prod-use-cases">
                <span>Families</span><span>Teams</span><span>Law firms</span>
              </div>
              <Link href="/pricing" className="btn-primary" style={{ marginTop: 'auto' }}>
                Start Free →
              </Link>
            </div>

            {/* Business Vault */}
            <div className="prod-card reveal" data-delay="2">
              <div className="prod-icon" style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.2)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="14" rx="3" fill="rgba(59,130,246,0.1)" stroke="#3B82F6" strokeWidth="1.5" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#3B82F6" strokeWidth="1.5" />
                  <circle cx="12" cy="14" r="2" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" strokeWidth="1.5" />
                </svg>
              </div>
              <h3>Business Vault</h3>
              <p className="prod-desc">
                Invoice fraud protection, contract lifecycle management, and team
                verification. A CEO deep-fake voice note won&apos;t fool your finance team when
                every payment instruction requires a Bitcoin certificate.
              </p>
              <ul className="prod-features">
                <li>Invoice fraud shield</li>
                <li>Contract anchoring workflow</li>
                <li>25-member team access</li>
                <li>REST API + webhooks</li>
                <li>Gmail &amp; Outlook extension</li>
                <li>Compliance reports</li>
              </ul>
              <div className="prod-use-cases">
                <span>Finance teams</span><span>Legal</span><span>HR</span>
              </div>
              <Link href="/pricing" className="btn-ghost" style={{ marginTop: 'auto' }}>
                Start Free →
              </Link>
            </div>

            {/* Developer API */}
            <div className="prod-card reveal" data-delay="3">
              <div className="prod-icon" style={{ background: 'rgba(107,33,168,0.1)', borderColor: 'rgba(107,33,168,0.2)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <polyline points="16 18 22 12 16 6" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="8 6 2 12 8 18" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="2" x2="12" y2="22" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                </svg>
              </div>
              <h3>Developer API</h3>
              <p className="prod-desc">
                Embed Bitcoin content verification directly into your platform. One API
                call to anchor, one to verify. SDKs for JavaScript, Python, and Go.
                Webhook support for on-chain confirmations.
              </p>
              <ul className="prod-features">
                <li>REST API with API key auth</li>
                <li>Anchor &amp; verify endpoints</li>
                <li>Batch anchoring (up to 100)</li>
                <li>Webhook on confirmation</li>
                <li>Full OpenAPI spec</li>
                <li>JS / Python / Go SDKs</li>
              </ul>
              <div className="prod-use-cases">
                <span>SaaS platforms</span><span>Media</span><span>Developers</span>
              </div>
              <a href="mailto:api@veritasbtc.io" className="btn-ghost" style={{ marginTop: 'auto' }}>
                Request Access →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-label reveal" data-delay="0">Use Cases</div>
          <h2 className="section-title reveal" data-delay="1">Who uses VeritasBTC</h2>
          <div className="uc-grid">
            {[
              { icon: '📸', title: 'Press photographers', desc: 'Anchor every photo at the point of capture. Prove it\'s unedited before it ever hits a newsroom.' },
              { icon: '⚖️', title: 'Lawyers & notaries', desc: 'Timestamped contract signatures and document versions that hold up in court — on Bitcoin, not a central server.' },
              { icon: '🏢', title: 'Finance teams', desc: 'Eliminate invoice fraud. A PDF without a Bitcoin certificate simply doesn\'t get paid.' },
              { icon: '🎵', title: 'Musicians & artists', desc: 'Prove creation date of original works before filing copyright. Your Bitcoin anchor IS your timestamp.' },
              { icon: '🏛️', title: 'Government & courts', desc: 'Immutable evidence of when digital documents existed. No trusted third party required.' },
              { icon: '📱', title: 'Everyday people', desc: 'Protect your voice notes, property photos, and personal records from being faked or altered.' },
            ].map((uc, i) => (
              <div key={i} className="uc-card reveal" data-delay={String(i)}>
                <div className="uc-icon">{uc.icon}</div>
                <h4>{uc.title}</h4>
                <p>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title reveal" data-delay="0">Start protecting your content today</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }} className="reveal" data-delay="1">
            Free plan · No credit card · 30-second setup
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }} className="reveal" data-delay="2">
            <Link href="/pricing" className="btn-primary btn-lg">Get Started Free →</Link>
            <Link href="/how-it-works" className="btn-ghost btn-lg">See How It Works</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
