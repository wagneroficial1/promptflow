import { supabase } from "./supabaseClient";

export type SubscriptionPayload = {
  plan: "free" | "pro" | "business";
  status?: string;           // ex: "active", "trialing", etc (depende do seu backend)
  currentPeriodEnd?: string; // opcional, se seu backend retornar
};

export async function fetchSubscription(): Promise<{
  ok: boolean;
  status: number;
  data?: SubscriptionPayload;
  error?: string;
}> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;

  if (!token) {
    return { ok: false, status: 401, error: "Sem sessão/token." };
  }

  const res = await fetch("/api/subscription", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // se vier vazio/sem json
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: body?.error || "Falha ao consultar assinatura.",
    };
  }

  // Ajuste aqui se o seu backend retornar em outro formato.
  // Ex: { plan: "pro" } ou { subscription: { plan: "pro" } }
  const raw = (body?.subscription ?? body) as any;

  const plan = (raw?.plan ?? raw?.plan_id ?? "free") as "free" | "pro" | "business";

  const data: SubscriptionPayload = {
    plan,
    status: raw?.status,
    currentPeriodEnd: raw?.currentPeriodEnd ?? raw?.current_period_end,
  };

  return { ok: true, status: res.status, data };
}
