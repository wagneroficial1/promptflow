export type PlanId = 'free' | 'pro' | 'business';

export const PLANS: Record<PlanId, { name: string; limit: number; priceLabel?: string }> = {
  free: { name: 'Free', limit: 5 },
  pro: { name: 'Pro', limit: 600, priceLabel: 'R$29/mês' },
  business: { name: 'Business', limit: 1200, priceLabel: 'R$49/mês' },
};

export function getMonthKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`; // ex: 2025-12
}
