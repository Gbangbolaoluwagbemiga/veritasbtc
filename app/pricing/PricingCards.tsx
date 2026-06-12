'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { setPlan } from '@/lib/plan';

interface Plan {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  period: string;
  trial?: string;
  featured?: boolean;
  features: string[];
  cta: string;
  variant: 'primary' | 'ghost';
  was?: string;
}

const plans: Plan[] = [
  {
    id: 'free',
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
    variant: 'ghost',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 0.99,
    annual: 0.69,
    period: '/month after trial',
    trial: '30 days FREE',
    featured: true,
    was: '5',
    features: [
      'Unlimited Bitcoin anchoring',
      'Live identity verification',
      'Family trust circle (10 members)',
      'Priority anchoring (< 3 sec)',
      'Full certificate history',
      'Mobile-ready QR wallet',
    ],
    cta: 'Claim 30 Days Free →',
    variant: 'primary',
  },
  {
    id: 'business',
    name: 'Business',
    monthly: 4.99,
    annual: 3.49,
    period: '/month after trial',
    trial: '30 days FREE',
    was: '50',
    features: [
      'Everything in Pro',
      'Invoice fraud shield',
      'Contract lifecycle anchoring',
      'Up to 25 team members',
      'REST API + webhooks',
      'Gmail / Outlook extension',
    ],
    cta: 'Claim 30 Days Free →',
    variant: 'ghost',
  },
];

export default function PricingCards() {
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
    <section className="section" id="plans" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className="pricing-toggle reveal" data-delay="0">
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

        <div className="pricing-grid reveal" data-delay="1">
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
                  {plan.was && <div className="prcard-was">was ${plan.was}</div>}
                  <span className="prcard-price">
                    {plan.monthly === 0
                      ? '$0'
                      : `$${annual ? plan.annual : plan.monthly}`}
                  </span>
                  <span className="prcard-period">{plan.period}</span>
                </div>
                <p className="prcard-desc">
                  {plan.id === 'free' && 'Start protecting your content today. No card. No expiry.'}
                  {plan.id === 'pro' && 'Full identity + family protection. Less than a dollar a month.'}
                  {plan.id === 'business' && 'Invoice fraud protection, team verification, and full API access.'}
                </p>
              </div>

              <ul className="prcard-features">
                {plan.features.map((f) => (
                  <li key={f}><span className="prf-check">✓</span> {f}</li>
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

        <div className="pricing-proof reveal" data-delay="2">
          <div className="pp-item"><span className="pp-icon">🔒</span><span>Files never leave your device</span></div>
          <div className="pp-div" />
          <div className="pp-item"><span className="pp-icon">₿</span><span>Every anchor costs ~$0.001 in Bitcoin fees</span></div>
          <div className="pp-div" />
          <div className="pp-item"><span className="pp-icon">♾️</span><span>Your certificate lasts as long as Bitcoin does</span></div>
        </div>

        <div className="pricing-enterprise reveal" data-delay="3">
          <div className="pe-text">
            <h3>University, Government, or NGO?</h3>
            <p>
              Custom pricing for institutions anchoring at scale. Includes batch tools,
              LMS integration, compliance reports, and a dedicated support line.
            </p>
          </div>
          <a href="mailto:enterprise@veritasbtc.io" className="btn-ghost">Talk to Our Team →</a>
        </div>
      </div>
    </section>
  );
}
