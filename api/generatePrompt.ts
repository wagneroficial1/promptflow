// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const LIMITS: Record<string, number> = {
  free: 5,
  pro: 600,
  business: 1200,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY' });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Missing Authorization Bearer token' });
    }

    // Supabase client usando JWT do usuário (RLS aplica)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const userId = userData.user.id;

    // Plano (fonte da verdade)
    const { data: subRow, error: subErr } = await supabase
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) return res.status(500).json({ error: subErr.message });

    const planId = subRow?.plan_id ?? 'free';
    const limit = LIMITS[planId] ?? LIMITS.free;

    // Conta uso do mês (função SQL que você criou)
    const { data: usedData, error: usedErr } = await supabase
      .rpc('count_usage_current_month', { p_user_id: userId });

    if (usedErr) return res.status(500).json({ error: usedErr.message });

    const used = Number(usedData ?? 0);
    const remaining = Math.max(0, limit - used);

    // ✅ Regra definitiva:
    // remaining > 0 -> pode gerar
    // remaining === 0 -> bloqueia + upgrade
    if (remaining === 0) {
      return res.status(403).json({
        error: 'LIMIT_REACHED',
        message: 'Você atingiu o limite mensal do seu plano.',
        plan: planId,
        used,
        limit,
        remaining: 0,
      });
    }

    // Registra o uso ANTES de chamar a IA (para garantir consumo)
    const { error: insErr } = await supabase
      .from('prompt_usage')
      .insert({ user_id: userId });

    if (insErr) return res.status(500).json({ error: insErr.message });

    // Agora gera o prompt no servidor
    const { systemInstruction, inputDescription, model, temperature } = req.body ?? {};
    if (!systemInstruction || !inputDescription || !model) {
      return res.status(400).json({ error: 'Missing systemInstruction/inputDescription/model' });
    }

    const geminiKey = process.env.GEMINI_API_KEY; // ✅ NÃO usar VITE_ aqui
    if (!geminiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [{ text: inputDescription }],
        },
      ],
      config: {
        systemInstruction,
        temperature: temperature ?? 0.7,
      },
    });


    const text = response.text || 'Não foi possível gerar o prompt. Tente novamente.';

    // Após inserir 1 uso, o novo "used" efetivo é used+1
    const newUsed = used + 1;
    const newRemaining = Math.max(0, limit - newUsed);

    return res.status(200).json({
      text,
      plan: planId,
      used: newUsed,
      limit,
      remaining: newRemaining,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message ?? 'Unknown error' });
  }
}
