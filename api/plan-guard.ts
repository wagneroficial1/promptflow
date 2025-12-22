// api/plan-guard.ts
// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ allowed: false });

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ allowed: false, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });
    }


    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ allowed: false, error: 'Missing Authorization Bearer token' });

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });


    // 1) Descobre o userId pelo JWT
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ allowed: false, error: 'Invalid token' });
    }
    const userId = userData.user.id;

    // 2) Lê plano do usuário
    const { data: subData, error: subErr } = await supabase
      .from('subscriptions')
      .select('plan_id,status')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) return res.status(500).json({ allowed: false, error: subErr.message });

    const PLAN_LIMITS: Record<string, number> = { free: 5, pro: 600, business: 1200 };
    const planId = subData?.plan_id ?? 'free';
    const limit = PLAN_LIMITS[planId] ?? 5;

    // 3) Conta uso do mês no banco (função v2 que você acabou de criar)
    const { data: usedData, error: usedErr } = await supabase
      .rpc('count_usage_current_month_v2', { p_user_id: userId });

    if (usedErr) return res.status(500).json({ allowed: false, error: usedErr.message });

    const used = Number(usedData ?? 0);

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
  } catch (e: any) {
    return res.status(500).json({ allowed: false, error: e?.message ?? 'Unknown error' });
  }
}
