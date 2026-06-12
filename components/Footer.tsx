import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="nav-logo" style={{ marginBottom: 12 }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L4 7v10c0 7.5 5.2 13.4 12 15 6.8-1.6 12-7.5 12-15V7L16 2z" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="1.5" />
                <path d="M10.5 16.5l3.5 3.5 7.5-7.5" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>VeritasBTC</span>
            </Link>
            <p className="footer-tagline">Prove what&apos;s real on Bitcoin.</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <Link href="/how-it-works" className="footer-link">How It Works</Link>
              <Link href="/products" className="footer-link">Products</Link>
              <Link href="/pricing" className="footer-link">Pricing</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Learn</div>
              <Link href="/why-bitcoin" className="footer-link">Why Bitcoin</Link>
              <Link href="/verify" className="footer-link">Verify a File</Link>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <Link href="/" className="footer-link">Home</Link>
              <a href="mailto:hello@veritasbtc.io" className="footer-link">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VeritasBTC. Built on Bitcoin.</span>
        </div>
      </div>
    </footer>
  );
}
