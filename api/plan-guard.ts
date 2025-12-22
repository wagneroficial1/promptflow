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

    // 1) ENV
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // ✅ A checagem que você perguntou fica EXATAMENTE aqui
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        allowed: false,
        error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
      });
    }

    // 2) TOKEN
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ allowed: false, error: 'Missing Authorization Bearer token' });
    }

    // 3) Supabase client (SERVICE ROLE)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 4) Validar o token e pegar userId
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ allowed: false, error: 'Invalid token' });
    }

    const userId = userData.user.id;

    // 5) Plano do usuário (se não existir, assume free)
    const { data: sub, error: subErr } = await supabase
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) {
      return res.status(500).json({ allowed: false, error: subErr.message });
    }

    const plan_id = sub?.plan_id ?? 'free';
    const status = sub?.status ?? 'active';

    const limit = LIMITS[plan_id] ?? LIMITS.free;

    // 6) Contagem mensal via RPC
    const { data: usedData, error: usedErr } = await supabase.rpc('count_usage_current_month_v2', {
      p_user_id: userId,
    });

    if (usedErr) {
      return res.status(500).json({ allowed: false, error: usedErr.message });
    }

    const used = Number(usedData ?? 0);

    const allowed = status === 'active' && used < limit;

    return res.status(200).json({
      allowed,
      reason: allowed ? null : 'LIMIT_REACHED',
      plan: plan_id,
      status,
      limit,
      used,
    });
  } catch (e: any) {
    return res.status(500).json({ allowed: false, error: e?.message ?? 'Unknown error' });
  }
}
