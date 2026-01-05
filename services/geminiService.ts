// NÃO USAR MAIS — Gemini agora é chamado no backend (/api/generatePrompt)
// import { GoogleGenAI } from "@google/genai";

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
// const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Detecta rate limit (429) de forma resiliente
function isRateLimitError(err: unknown): boolean {
  const anyErr = err as any;
  const status = anyErr?.status ?? anyErr?.response?.status;
  const message = String(anyErr?.message ?? "").toLowerCase();
  return status === 429 || message.includes("429") || message.includes("rate");
}

async function generateWithRetry(params: {
  systemInstruction: string;
  inputDescription: string;
  model: string;
  temperature?: number;
  maxRetries?: number;
}): Promise<string> {
  const {
    systemInstruction,
    inputDescription,
    model,
    temperature = 0.7,
    maxRetries = 2,
  } = params;

  let attempt = 0;

  while (true) {
    try {
      // Pega o token do usuário logado
      const sessionRaw = localStorage.getItem('sb-mzyumkehycctfzsbzgzo-auth-token');
      const session = sessionRaw ? JSON.parse(sessionRaw) : null;
      const token = session?.access_token;

      const res = await fetch('/api/generatePrompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        systemInstruction,
        inputDescription,
        model,
        temperature,
      }),
    });
    
    console.log('[PromptFlow][generateWithRetry]', {
      status: res.status,
      ok: res.ok,
    });


      const data = await res.json();

      // Limite atingido -> propaga erro específico
      if (!res.ok) {
        const err: any = new Error(data?.message || 'Erro ao gerar prompt');
        err.code = data?.error;
        err.status = res.status;
        err.payload = data;
        throw err;
      }

      return data.text || "Não foi possível gerar o prompt. Tente novamente.";
    } catch (error) {
      if (isRateLimitError(error) && attempt < maxRetries) {
        attempt++;
        const waitMs = randomInt(1000, 3000);
        console.warn(`[PromptFlow] 429 detectado. Retry ${attempt}/${maxRetries} em ${waitMs}ms`);
        await sleep(waitMs);
        continue;
      }

      throw error;
    }
  }
}


export const generateProfessionalPrompt = async (
  systemInstruction: string,
  userInputs: Record<string, string>,
  targetLanguage: string = "Português (Brasil)",
  targetPlatform: string = "ChatGPT"
): Promise<{
  text?: string;
  error?: 'LIMIT_REACHED' | 'GENERIC_ERROR';
  used?: number;
  remaining?: number;
  limit?: number;
}> => {
  let inputDescription =
    "Aqui estão os dados fornecidos pelo usuário para criar o prompt:\n";

  for (const [key, value] of Object.entries(userInputs)) {
    inputDescription += `- ${key}: ${value}\n`;
  }

  inputDescription += `\nCom base nisso, gere o Prompt final otimizado.`;

  try {
    // Pega o token do usuário logado (mesmo método do generateWithRetry)
const sessionRaw = localStorage.getItem('sb-mzyumkehycctfzsbzgzo-auth-token');
const session = sessionRaw ? JSON.parse(sessionRaw) : null;
const token = session?.access_token;

const res = await fetch('/api/generatePrompt', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  body: JSON.stringify({
    systemInstruction,
    inputDescription,
    targetLanguage,
    targetPlatform,
  }),
});

    const data = await res.json();

    if (!res.ok) {
      if (data?.error === 'LIMIT_REACHED') {
        return {
          error: 'LIMIT_REACHED',
          used: data.used,
          remaining: data.remaining,
          limit: data.limit,
        };
      }

      return { error: 'GENERIC_ERROR' };
    }

    return {
      text: data.text,
      used: data.used,
      remaining: data.remaining,
      limit: data.limit,
    };
  } catch {
    return { error: 'GENERIC_ERROR' };
  }
};
