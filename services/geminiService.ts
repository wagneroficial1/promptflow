import { supabase } from './supabaseClient';

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
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      console.log('[DEBUG] access_token:', token);

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

      const json = await res.json();


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
): Promise<string> => {
  import { supabase } from './supabaseClient';

export const generateProfessionalPrompt = async (
  systemInstruction: string,
  inputDescription: string,
  model: string = 'gemini-1.5-flash',
  temperature: number = 0.7
): Promise<string> => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const res = await fetch('/api/generatePrompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      systemInstruction,
      inputDescription,
      model,
      temperature,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    if (json?.error === 'LIMIT_REACHED') {
      return 'LIMIT_REACHED';
    }

    throw new Error(json?.message || 'Erro ao gerar prompt');
  }

  return json.text;
};
