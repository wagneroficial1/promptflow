import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function getBearerToken(req: VercelRequest) {
  const h = req.headers.authorization || (req.headers as any).Authorization;
  const raw = Array.isArray(h) ? h[0] : h;
  if (!raw) return null;
  const [type, token] = raw.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

// Lê e parseia JSON do body de forma resiliente (req.body pode vir string/objeto/undefined)
async function readJsonBody(req: VercelRequest): Promise<any> {
  // 1) se já veio parseado
  if (req.body && typeof req.body === "object") return req.body;

  // 2) se veio como string
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  // 3) fallback: ler stream
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on("end", () => resolve());
    req.on("error", reject);
  });

  if (chunks.length === 0) return null;

  const raw = Buffer.concat(chunks).toString("utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
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

  // 2) lê request_id do body
  const body = await readJsonBody(req);
  const rawRequestId =
  (typeof body?.request_id === "string" ? body.request_id : null) ??
  (typeof body?.requestId === "string" ? body.requestId : null);

const requestId = rawRequestId && rawRequestId.trim() ? rawRequestId.trim() : null;

  if (!requestId) {
    return res.status(400).json({ error: "Missing request_id" });
  }

  // 3) grava 1 uso (1 requestId = 1 insert) usando service role
  const supabaseAdmin = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: insErr } = await supabaseAdmin
    .from("prompt_usage")
    .insert({ user_id: userId, request_id: requestId });

  // Se bater no unique index (mesmo user_id + request_id), tratamos como "ok" (idempotência)
  if (insErr) {
    const code = (insErr as any).code;
    if (code === "23505") {
      return res.status(200).json({ ok: true, deduped: true });
    }
    return res.status(500).json({ error: "Insert failed", details: insErr.message });
  }

  return res.status(200).json({ ok: true, request_id: requestId });
}
