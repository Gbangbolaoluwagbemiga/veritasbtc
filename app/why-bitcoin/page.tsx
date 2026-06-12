import Link from 'next/link';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: 'Why Bitcoin — VeritasBTC',
  description:
    'Why Bitcoin is the only ledger that matters for content verification. 16 years of uptime, true immutability, and no trusted third party.',
};

export default function WhyBitcoinPage() {
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
          <div className="section-label reveal" data-delay="0">Why Bitcoin</div>
          <h1 className="page-hero-title reveal" data-delay="1">
            The only ledger that<br /><span className="text-grad-orange">can&apos;t be rewritten.</span>
          </h1>
          <p className="page-hero-sub reveal" data-delay="2">
            Any database can be hacked, edited, or shut down. Bitcoin is the one system
            in history where altering a past record requires redoing more computational
            work than all the world&apos;s data centers combined.
          </p>
        </div>
      </section>

      {/* 4 pillars */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="wb-pillars">
            {[
              {
                icon: '🏔️',
                title: '16 years of uptime',
                body: 'Bitcoin has been running continuously since January 3, 2009 — never hacked, never shut down, never had a single block rolled back. Your anchor from today will be readable in 2050.',
                stat: '99.98% uptime since 2009',
                delay: 0,
              },
              {
                icon: '🌐',
                title: 'True decentralization',
                body: 'No company, government, or court can delete a Bitcoin record. It exists across 15,000+ nodes in 100+ countries. There is no "take down" request that works.',
                stat: '15,000+ independent nodes',
                delay: 1,
              },
              {
                icon: '🔐',
                title: 'Cryptographic immutability',
                body: 'Each Bitcoin block contains the hash of the previous one. Changing any historical record would require recomputing every block since — an impossibility with current and foreseeable computing power.',
                stat: '600+ EH/s of network security',
                delay: 2,
              },
              {
                icon: '⚖️',
                title: 'No trusted third party',
                body: "Traditional notarization requires you to trust the notary, their database, and their government. Bitcoin requires you to trust math. Math doesn't have a business model, and it can't be subpoenaed.",
                stat: 'Zero custodians needed',
                delay: 3,
              },
            ].map((p) => (
              <div key={p.title} className="wb-pillar reveal" data-delay={String(p.delay)}>
                <div className="wb-pillar-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <div className="wb-stat">{p.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-label reveal" data-delay="0">Comparison</div>
          <h2 className="section-title reveal" data-delay="1">Bitcoin vs. alternatives</h2>
          <div className="wb-table-wrap reveal" data-delay="2">
            <table className="wb-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th className="wb-th-btc">Bitcoin ₿</th>
                  <th>Central database</th>
                  <th>Other blockchains</th>
                  <th>Notary / timestamp</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cannot be deleted', '✓', '✗', '~', '✗'],
                  ['No single point of failure', '✓', '✗', '~', '✗'],
                  ['Works in 2050', '✓', '✗', '?', '✗'],
                  ['Censor-resistant', '✓', '✗', '~', '✗'],
                  ['Globally accepted proof', '✓', '✗', '✗', '~'],
                  ['No company dependency', '✓', '✗', '~', '✗'],
                ].map(([prop, btc, central, other, notary]) => (
                  <tr key={prop}>
                    <td>{prop}</td>
                    <td className="wb-yes">{btc}</td>
                    <td className={central === '✗' ? 'wb-no' : 'wb-maybe'}>{central}</td>
                    <td className={other === '✓' ? 'wb-yes' : other === '✗' ? 'wb-no' : 'wb-maybe'}>{other}</td>
                    <td className={notary === '✗' ? 'wb-no' : 'wb-maybe'}>{notary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: 'var(--text-subtle)', fontSize: 12, marginTop: 12, textAlign: 'center' }} className="reveal" data-delay="3">
            ✓ = Yes &nbsp;&nbsp; ✗ = No &nbsp;&nbsp; ~ = Partial / depends on governance
          </p>
        </div>
      </section>

      {/* Stacks explanation */}
      <section className="section">
        <div className="container">
          <div className="wb-stacks-grid">
            <div className="reveal" data-delay="0">
              <div className="section-label">The Technology</div>
              <h2 className="section-title">
                Built on Stacks,<br /><span className="text-grad-orange">secured by Bitcoin.</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.7, marginBottom: 24 }}>
                Stacks is a Bitcoin Layer 2 that enables smart contracts without changing
                Bitcoin itself. Every Stacks transaction settles on Bitcoin via &ldquo;Proof of
                Transfer&rdquo; — making VeritasBTC&apos;s anchoring both cheap and Bitcoin-native.
              </p>
              <div className="wb-tech-flow">
                <div className="wb-tech-step">
                  <div className="wb-ts-label">Your file</div>
                  <div className="wb-ts-arrow">→ SHA-256 →</div>
                  <div className="wb-ts-label">Fingerprint</div>
                  <div className="wb-ts-arrow">→ Stacks TX →</div>
                  <div className="wb-ts-label" style={{ color: 'var(--bitcoin)' }}>Bitcoin Block</div>
                </div>
              </div>
            </div>

            <div className="wb-stacks-cards reveal" data-delay="1">
              {[
                { num: '~$0.001', label: 'Cost per anchor' },
                { num: '~3s', label: 'To confirmation' },
                { num: 'Clarity', label: 'Smart contract language' },
                { num: 'sBTC', label: 'Bitcoin-pegged asset' },
              ].map((c) => (
                <div key={c.label} className="wb-sc">
                  <div className="wb-sc-num">{c.num}</div>
                  <div className="wb-sc-label">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-surface)', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title reveal" data-delay="0">
            The world&apos;s strongest ledger.<br />Now in your pocket.
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }} className="reveal" data-delay="1">
            Join early access. Free for the first 30 days.
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
