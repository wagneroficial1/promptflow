// api/plan-guard.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ allowed: false });

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ allowed: false });

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data } = await supabase
    .from('subscriptions')
    .select('plan_id,status')
    .maybeSingle();

  const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  pro: 600,
  business: 1200,
};

const planId = data?.plan_id ?? 'free';
const limit = PLAN_LIMITS[planId] ?? 5;

// uso atual vem do frontend por enquanto
const used = Number(req.headers['x-usage-used'] ?? 0);

if (used >= limit) {
  return res.status(200).json({
    allowed: false,
    reason: 'LIMIT_REACHED',
    plan: planId,
    limit,
    used,
  });
}

return res.status(200).json({
  allowed: true,
  plan: planId,
  limit,
  used,
});

}
