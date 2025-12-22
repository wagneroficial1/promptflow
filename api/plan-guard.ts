// api/plan-guard.ts
// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const LIMITS = {
  free: 5,
  pro: 600,
  business: 1200,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ allowed: false, error: 'Method not allowed' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // ✅ É AQUI que entra a checagem (no plan-guard, é SERVICE_ROLE_KEY)
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        allowed: false,
        error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
      });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ allowed: false, error: 'Missing Authorization Bearer token' });
    }

    // ✅ Aqui é o client correto (service role) — sem usar supabaseAnonKey
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // ✅ valida token e pega user
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ allowed: false, error: 'Invalid token' });
    }

    const userId = userData.user.id;

    // plano do usuário (se não tiver, assume free)
    const { data: sub, error: subErr } = await supabase
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) {
      return res.status(500).json({ allowed: false, error: subErr.message });
    }

    const planId = (sub?.plan_id as 'free' | 'pro' | 'business') || 'free';
    const limit = LIMITS[planId] ?? LIMITS.free;

    // contagem mensal via RPC
    const { data: usedRaw, error: usedErr } = await supabase.rpc('count_usage_current_month_v2', {
      p_user_id: userId,
    });

    if (usedErr) {
      return res.status(500).json({ allowed: false, error: usedErr.message });
    }

    const used = Number(usedRaw ?? 0);
    const allowed = used < limit;

    return res.status(200).json({
      allowed,
      reason: allowed ? null : 'LIMIT_REACHED',
      plan: planId,
      limit,
      used,
    });
  } catch (e: any) {
    return res.status(500).json({ allowed: false, error: e?.message ?? 'Unknown error' });
  }
}
