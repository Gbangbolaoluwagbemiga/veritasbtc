'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { setPlan } from '@/lib/plan';

const plans = [
  {
    id: 'free' as const,
    name: 'Free',
    monthly: 0,
    annual: 0,
    period: 'forever',
    features: [
      '25 Bitcoin anchors / month',
      'Unlimited verifications',
      'Shareable QR certificates',
      'Certificate history',
    ],
    cta: 'Get Started Free',
    variant: 'ghost' as const,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    monthly: 0.99,
    annual: 0.69,
    period: '/month after trial',
    trial: '30 days FREE',
    featured: true,
    features: [
      'Unlimited Bitcoin anchoring',
      'Live identity verification',
      'Family trust circle (10 members)',
      'Priority anchoring (< 3 sec)',
      'Full certificate history',
      'Mobile-ready QR wallet',
    ],
    cta: 'Claim 30 Days Free →',
    variant: 'primary' as const,
  },
  {
    id: 'business' as const,
    name: 'Business',
    monthly: 4.99,
    annual: 3.49,
    period: '/month after trial',
    trial: '30 days FREE',
    features: [
      'Everything in Pro',
      'Invoice fraud shield',
      'Contract lifecycle anchoring',
      'Up to 25 team members',
      'REST API + webhooks',
      'Gmail / Outlook extension',
    ],
    cta: 'Claim 30 Days Free →',
    variant: 'ghost' as const,
  },
];

export default function PricingPreview() {
  const [annual, setAnnual] = useState(false);
  const { address, connect } = useWallet();
  const router = useRouter();

  function handlePlanCTA(planId: string) {
    if (address) {
      setPlan(planId as 'free' | 'pro' | 'business');
      router.push('/dashboard');
    } else {
      connect(planId);
    }
  }

  return (
    <section className="section" id="pricing-preview" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="section-label reveal" data-delay="0">Pricing</div>
        <h2 className="section-title reveal" data-delay="1">
          Less than a dollar.<br />
          <span className="text-grad-orange">Permanent on Bitcoin.</span>
        </h2>
        <p className="section-sub reveal" data-delay="2">
          First 30 days free on all paid plans. No credit card required. Early adopters
          lock in launch pricing forever.
        </p>

        {/* Toggle */}
        <div className="pricing-toggle reveal" data-delay="3">
          <span className={`pt-label${!annual ? ' active' : ''}`}>Monthly</span>
          <label className="pt-switch">
            <input
              type="checkbox"
              checked={annual}
              onChange={(e) => setAnnual(e.target.checked)}
            />
            <span className="pt-slider" />
          </label>
          <span className={`pt-label${annual ? ' active' : ''}`}>
            Annual <span className="pt-save">Save 30%</span>
          </span>
        </div>

        <div className="pricing-grid reveal" data-delay="4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card${plan.featured ? ' pricing-card--featured' : ''}`}
            >
              {plan.featured && <div className="prcard-featured-badge">🔥 Most Popular</div>}
              {plan.trial && (
                <div className={`prcard-free-ribbon${!plan.featured ? ' prcard-free-ribbon--dark' : ''}`}>
                  {plan.trial}
                </div>
              )}

              <div className="prcard-header">
                <div className="prcard-name">{plan.name}</div>
                <div className="prcard-price-wrap">
                  {plan.id !== 'free' && <div className="prcard-was">was ${plan.id === 'pro' ? '5' : '50'}</div>}
                  <span className="prcard-price">
                    {plan.monthly === 0
                      ? '$0'
                      : `$${annual ? plan.annual : plan.monthly}`}
                  </span>
                  <span className="prcard-period">{plan.period}</span>
                </div>
              </div>

              <ul className="prcard-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="prf-check">✓</span> {f}
                  </li>
                ))}
              </ul>

              <button
                className={`${plan.variant === 'primary' ? 'btn-primary' : 'btn-ghost'} prcard-cta`}
                onClick={() => handlePlanCTA(plan.id)}
                data-plan={plan.id}
              >
                {plan.cta}
              </button>

              {plan.id !== 'free' && (
                <div className="prcard-trial">
                  No card needed · Cancel anytime · Price locked forever
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pricing-proof reveal" data-delay="5">
          <div className="pp-item">
            <span className="pp-icon">🔒</span>
            <span>Files never leave your device</span>
          </div>
          <div className="pp-div" />
          <div className="pp-item">
            <span className="pp-icon">₿</span>
            <span>Every anchor costs ~$0.001 in Bitcoin fees</span>
          </div>
          <div className="pp-div" />
          <div className="pp-item">
            <span className="pp-icon">♾️</span>
            <span>Your certificate lasts as long as Bitcoin does</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }} className="reveal" data-delay="6">
          <Link href="/pricing" className="btn-ghost">
            See full pricing details →
          </Link>
        </div>
      </div>
    </section>
  );
}
