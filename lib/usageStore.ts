import { getMonthKey, PlanId } from './plan';

type UsageState = {
  planId: PlanId;
  monthKey: string;
  used: number;
};

const BASE_KEY = 'promptflow:usage:v1';

function getUsageKey(userId: string) {
  return `${BASE_KEY}:${userId}`;
}


export function loadUsage(userId?: string): UsageState {
  const monthKey = getMonthKey();
  const KEY = userId ? getUsageKey(userId) : BASE_KEY;

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

export function saveUsage(state: UsageState, userId?: string) {
  const KEY = userId ? getUsageKey(userId) : BASE_KEY;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function setPlan(planId: PlanId, userId?: string) {
  const current = loadUsage(userId);
  const next: UsageState = { ...current, planId };
  saveUsage(next, userId);
  return next;
}

export function incrementUsage(by = 1, userId?: string) {
  const current = loadUsage(userId);
  const next: UsageState = { ...current, used: current.used + by };
  saveUsage(next, userId);
  return next;
}

export function resetUsage(userId?: string) {
  const current = loadUsage(userId);
  const next: UsageState = { ...current, used: 0 };
  saveUsage(next, userId);
  return next;
}
