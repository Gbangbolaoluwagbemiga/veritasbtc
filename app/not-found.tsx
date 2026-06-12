import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg-void)' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔗</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900, color: 'var(--bitcoin)', lineHeight: 1, marginBottom: 16 }}>
          404
        </div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
          This page doesn&apos;t exist — but your content&apos;s Bitcoin anchor is permanent forever.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
            Go Home
          </Link>
          <Link href="/dashboard" className="btn-ghost" style={{ textDecoration: 'none' }}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
