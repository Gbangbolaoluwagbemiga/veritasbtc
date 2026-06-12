import Link from 'next/link';
import dynamic from 'next/dynamic';

const WalletPill = dynamic(() => import('./WalletPill'), { ssr: false });

const Logo = () => (
  <Link href="/" className="nav-logo">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7v10c0 7.5 5.2 13.4 12 15 6.8-1.6 12-7.5 12-15V7L16 2z" fill="rgba(247,147,26,0.15)" stroke="#F7931A" strokeWidth="1.5" />
      <path d="M10.5 16.5l3.5 3.5 7.5-7.5" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>VeritasBTC</span>
  </Link>
);

interface NavbarProps {
  activePage?: string;
}

export default function Navbar({ activePage }: NavbarProps) {
  const links = [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/products', label: 'Products' },
    { href: '/why-bitcoin', label: 'Why Bitcoin' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-inner">
        <Logo />
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="nav-link" style={activePage === l.href ? { color: 'var(--bitcoin)' } : {}}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <WalletPill />
          <Link href="/pricing" className="btn-primary btn-sm">Get Started Free</Link>
        </div>
        <NavMobile links={links} activePage={activePage} />
      </div>
    </nav>
  );
}

function NavMobile({ links, activePage }: { links: { href: string; label: string }[]; activePage?: string }) {
  return (
    <>
      <button className="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false">
        <span /><span /><span />
      </button>
      <div className="mobile-menu" id="mobile-menu">
        <ul className="mobile-nav-links">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="mobile-nav-link">{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className="mobile-nav-ctas">
          <Link href="/pricing" className="btn-primary">Get Started Free</Link>
        </div>
      </div>
    </>
  );
}
