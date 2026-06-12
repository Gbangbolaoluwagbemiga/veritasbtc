'use client';

import { useEffect, useState } from 'react';
import { getPlan, setPlan, getTrialDaysLeft, isTrialExpired, PLANS, type PlanId, type StoredPlan } from '@/lib/plan';

export function usePlan() {
  const [plan, setPlanState] = useState<StoredPlan>({ id: 'free', trialStart: null });
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // Apply pending plan from pricing page
    const pending = localStorage.getItem('pending-plan') as PlanId | null;
    if (pending && PLANS[pending]) {
      setPlan(pending);
      localStorage.removeItem('pending-plan');
    }
    refresh();
  }, []);

  function refresh() {
    const p = getPlan();
    setPlanState(p);
    setDaysLeft(getTrialDaysLeft());
    setExpired(isTrialExpired());
  }

  function applyPlan(planId: PlanId) {
    setPlan(planId);
    refresh();
  }

  return { plan, daysLeft, expired, applyPlan, refresh };
}
