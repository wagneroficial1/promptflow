import { getMonthKey, PlanId } from './plan';

type UsageState = {
  planId: PlanId;
  monthKey: string;
  used: number;
};

const KEY = 'promptflow:usage:v1';

export function loadUsage(): UsageState {
  const monthKey = getMonthKey();

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { planId: 'free', monthKey, used: 0 };

    const parsed = JSON.parse(raw) as Partial<UsageState>;

    // virou o mês → zera contador automaticamente
    if (parsed.monthKey !== monthKey) {
      return { planId: (parsed.planId ?? 'free') as PlanId, monthKey, used: 0 };
    }

    return {
      planId: (parsed.planId ?? 'free') as PlanId,
      monthKey,
      used: Number.isFinite(parsed.used) ? Number(parsed.used) : 0,
    };
  } catch {
    return { planId: 'free', monthKey, used: 0 };
  }
}

export function saveUsage(state: UsageState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function setPlan(planId: PlanId) {
  const current = loadUsage();
  const next: UsageState = { ...current, planId };
  saveUsage(next);
  return next;
}

export function incrementUsage(by = 1) {
  const current = loadUsage();
  const next: UsageState = { ...current, used: current.used + by };
  saveUsage(next);
  return next;
}

export function resetUsage() {
  const current = loadUsage();
  const next: UsageState = { ...current, used: 0 };
  saveUsage(next);
  return next;
}
