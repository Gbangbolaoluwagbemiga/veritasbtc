import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import PricingCards from './PricingCards';
import PricingFaq from './PricingFaq';

export const metadata = {
  title: 'Pricing — VeritasBTC',
  description:
    'VeritasBTC pricing. Free plan forever, Pro at $0.99/month, Business at $4.99/month. First 30 days free on all paid plans.',
};

export default function PricingPage() {
  return (
    <>
      <ScrollReveal />

      {/* Page hero */}
      <section className="page-hero">
        <div className="page-hero-bg">
          <div className="hero-orb hero-orb--orange" style={{ opacity: 0.5 }} />
          <div className="hero-grid" />
        </div>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label reveal" data-delay="0">Pricing</div>
          <h1 className="page-hero-title reveal" data-delay="1">
            Less than a dollar.<br /><span className="text-grad-orange">Permanent on Bitcoin.</span>
          </h1>
          <p className="page-hero-sub reveal" data-delay="2" style={{ margin: '0 auto' }}>
            We&apos;re in early access. Every plan is free for your first 30 days. After that —
            less than your morning coffee. Early adopters lock in these rates forever.
          </p>

          <div className="launch-banner reveal" data-delay="3" style={{ maxWidth: 600, margin: '32px auto 0' }}>
            <div className="lb-pulse" />
            <span className="lb-icon">🚀</span>
            <div className="lb-text">
              <strong>Early Access Pricing</strong>
              <span>Lock in launch prices forever. These rates will never increase for early adopters.</span>
            </div>
            <div className="lb-badge">Limited Time</div>
          </div>
        </div>
      </section>

      {/* Interactive plans section (client component) */}
      <PricingCards />

      {/* FAQ (client component for accordion) */}
      <PricingFaq />

      <Footer />
    </>
  );
}
