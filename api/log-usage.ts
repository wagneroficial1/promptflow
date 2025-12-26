import { createClient } from "@supabase/supabase-js";

function getBearerToken(req: any) {
  const h = req.headers?.authorization || req.headers?.Authorization;
  const raw = Array.isArray(h) ? h[0] : h;
  if (!raw) return null;
  const [type, token] = String(raw).split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function getRequestId(req: any): string | null {
  // Vercel pode entregar body como objeto ou string
  const body = req.body;
  if (!body) return null;

  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      return typeof parsed?.request_id === "string" ? parsed.request_id : null;
    } catch {
      return null;
    }
  }

  return typeof body?.request_id === "string" ? body.request_id : null;
}

export default async function handler(req: any, res: any) {
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

  const requestId = getRequestId(req);
  if (!requestId) {
    return res.status(400).json({ error: "Missing request_id" });
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

  // 2) grava 1 uso no mês (idempotente por request_id)
  const supabaseAdmin = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: insErr } = await supabaseAdmin
    .from("prompt_usage")
    .insert({ user_id: userId, request_id: requestId });

  if (insErr) {
    // Duplicate key (unique violation) => já foi registrado, não duplica
    const anyErr = insErr as any;
    const code = anyErr?.code; // PostgREST geralmente traz "23505"
    if (code === "23505") {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    return res.status(500).json({ error: "Insert failed", details: insErr.message });
  }

  return res.status(200).json({ ok: true, inserted: true });
}
