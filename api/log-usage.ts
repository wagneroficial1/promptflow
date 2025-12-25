import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function getBearerToken(req: VercelRequest) {
  const h = req.headers.authorization || req.headers.Authorization;
  const raw = Array.isArray(h) ? h[0] : h;
  if (!raw) return null;
  const [type, token] = raw.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon || !serviceRole) {
    return res.status(500).json({ error: "Missing Supabase env vars" });
  }

  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  // 1) valida o token e pega o user_id
  const supabaseAuth = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
  if (userErr || !userData?.user) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const userId = userData.user.id;

  // 2) grava 1 uso no mês (linha em prompt_usage)
  const supabaseAdmin = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: insErr } = await supabaseAdmin
    .from("prompt_usage")
    .insert({ user_id: userId });

  if (insErr) {
    return res.status(500).json({ error: "Insert failed", details: insErr.message });
  }

  return res.status(200).json({ ok: true });
}
