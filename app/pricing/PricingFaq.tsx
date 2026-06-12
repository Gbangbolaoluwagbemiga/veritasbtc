'use client';

import { useState } from 'react';

const faqItems = [
  {
    q: 'Do I need a credit card for the free trial?',
    a: 'No. The free plan is free forever — no card required. Paid plan trials also require no credit card. We\'ll ask for one when you\'re ready to continue after 30 days.',
  },
  {
    q: 'What\'s "early access pricing"?',
    a: 'We\'re in early access and pricing is deliberately low to grow with our community. Anyone who subscribes now locks in this rate permanently — even as we add features and raise prices for new users.',
  },
  {
    q: 'What happens when I hit 25 anchors on the free plan?',
    a: 'Anchoring pauses until the next calendar month, or you can upgrade to Pro for unlimited anchoring. Your existing certificates are never affected — they\'re on Bitcoin forever.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel in one click. Your account reverts to the free plan. All existing Bitcoin anchors remain valid forever — they\'re not stored by us.',
  },
  {
    q: 'Is there a cost per Bitcoin transaction?',
    a: 'Each anchor costs approximately $0.001 in Stacks network fees, paid from your Stacks wallet. The subscription covers the VeritasBTC platform; network fees are tiny and separate.',
  },
];

export default function PricingFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="section-label reveal" data-delay="0">FAQ</div>
        <h2 className="section-title reveal" data-delay="1">Pricing questions</h2>
        <div className="faq-list">
          {faqItems.map((item, i) => (
            <div key={i} className="faq-item reveal" data-delay={String(i)}>
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {item.q}
                <span className="faq-icon">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <div className="faq-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
