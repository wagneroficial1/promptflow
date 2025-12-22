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
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return res.status(500).json({
        allowed: false,
        error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY',
      });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ allowed: false, error: 'Missing Authorization Bearer token' });
    }

    // 1) Valida o JWT com ANON + Bearer (RLS)
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ allowed: false, error: 'Invalid token' });
    }

    const userId = userData.user.id;

    // 2) Usa SERVICE ROLE para ler plano + contar uso (sem depender de RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) {
      return res.status(500).json({ allowed: false, error: subErr.message });
    }

    const planId = (sub?.plan_id as string) || 'free';
    const status = (sub?.status as string) || 'active';
    const limit = LIMITS[planId] ?? LIMITS.free;

    // Se quiser bloquear quando status não for active:
    if (status !== 'active') {
      return res.status(200).json({
        allowed: false,
        reason: 'INACTIVE_SUBSCRIPTION',
        plan: planId,
        status,
        limit,
        used: 0,
      });
    }

    const { data: usedData, error: usedErr } = await supabaseAdmin.rpc(
      'count_usage_current_month_v2',
      { p_user_id: userId }
    );

    if (usedErr) {
      return res.status(500).json({ allowed: false, error: usedErr.message });
    }

    const used = Number(usedData ?? 0);
    const allowed = used < limit;

    return res.status(200).json({
      allowed,
      reason: allowed ? 'OK' : 'LIMIT_REACHED',
      plan: planId,
      status,
      limit,
      used,
    });
  } catch (e: any) {
    return res.status(500).json({ allowed: false, error: e?.message ?? 'Unknown error' });
  }
}
