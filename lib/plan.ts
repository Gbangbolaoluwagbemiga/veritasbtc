const PLAN_KEY = 'veritas-plan';

export const PLANS = {
  free:     { id: 'free',     name: 'Free',     color: '#8888AA', anchors: 25,       trial: false, price: '$0' },
  pro:      { id: 'pro',      name: 'Pro',       color: '#F7931A', anchors: Infinity, trial: true,  price: '$0.99' },
  business: { id: 'business', name: 'Business',  color: '#A855F7', anchors: Infinity, trial: true,  price: '$4.99' },
} as const;

export type PlanId = keyof typeof PLANS;

export interface StoredPlan {
  id: PlanId;
  trialStart: number | null;
}

export function getPlan(): StoredPlan {
  if (typeof window === 'undefined') return { id: 'free', trialStart: null };
  try {
    return JSON.parse(localStorage.getItem(PLAN_KEY) || 'null') ?? { id: 'free', trialStart: null };
  } catch { return { id: 'free', trialStart: null }; }
}

export function setPlan(planId: PlanId): StoredPlan {
  const existing = getPlan();
  const trialStart = planId !== 'free'
    ? (existing.id === planId && existing.trialStart ? existing.trialStart : Date.now())
    : null;
  const plan: StoredPlan = { id: planId, trialStart };
  if (typeof window !== 'undefined') localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  return plan;
}

export function getTrialDaysLeft(): number | null {
  const plan = getPlan();
  if (plan.id === 'free' || !plan.trialStart) return null;
  const elapsed = (Date.now() - plan.trialStart) / (1000 * 60 * 60 * 24);
  return Math.max(0, 30 - Math.floor(elapsed));
}

export function isTrialActive(): boolean {
  const d = getTrialDaysLeft();
  return d !== null && d > 0;
}

export function isTrialExpired(): boolean {
  const d = getTrialDaysLeft();
  return d !== null && d === 0;
}

export function canAnchor(anchorCount: number): boolean {
  const plan = getPlan();
  if (plan.id !== 'free') return true;
  return anchorCount < 25;
}
