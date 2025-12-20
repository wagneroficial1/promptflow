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
): Promise<string> => {
  let inputDescription =
    "Aqui estão os dados fornecidos pelo usuário para criar o prompt:\n";

  for (const [key, value] of Object.entries(userInputs)) {
    inputDescription += `- ${key}: ${value}\n`;
  }

  inputDescription += `\nCom base nisso, gere o Prompt final otimizado.
  
  DIRETRIZES CRÍTICAS DE GERAÇÃO:
  1. O Prompt em si deve ser escrito em INGLÊS (English), pois funciona melhor na maioria das IAs, exceto se a plataforma especificada preferir outro idioma nativamente.
  2. O prompt gerado DEVE instruir a IA final a escrever o resultado (o roteiro, a legenda, a resposta) em: ${targetLanguage}.
  3. Integre essa instrução de idioma de forma natural no início ou corpo do prompt.
  
  DIRETRIZES DA PLATAFORMA (${targetPlatform}):
  Adapte a estrutura e sintaxe do prompt especificamente para a ferramenta '${targetPlatform}':
  
  - Se for 'Kling', 'Hailuo', 'Runway' ou 'Seedance' (Vídeo): O prompt DEVE focar puramente em descrições visuais, movimento de câmera, física e iluminação. Ignore pedidos de roteiro de fala. Use estruturas como "Scene description: [details], Camera Movement: [move], Atmosphere: [mood]". Adicione Negative Prompts se comum para essa ferramenta.
  - Se for 'Midjourney' ou 'Nano Banana' (Imagem): Use parâmetros específicos (ex: --ar 16:9, --v 6) se apropriado, foque em estilo artístico, lentes e renderização.
  - Se for 'Grok', 'ChatGPT', 'Claude', 'Gemini' (Texto/Chat): Use estrutura Markdown, peça personas claras, e formatação de texto (negrito, listas). Se for Grok, permita um tom mais "witty" ou direto se o usuário pedir.
  - Se for 'HeyGen' (Avatar): Foque no roteiro de fala que o avatar vai ler e na descrição da aparência do avatar se for criação de avatar personalizado.
  
  Gere APENAS o prompt final, sem introduções como "Aqui está seu prompt:".`;

  try {
    // ✅ Enfileira (queue) + aplica retry inteligente para 429
    const text = await generateWithRetry({
      systemInstruction,
      inputDescription,
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxRetries: 2,
    });

    return text;
  } catch (error: any) {
    // Se estourou limite, devolve um marcador para o Dashboard reagir (upgrade)
    if (error?.code === 'LIMIT_REACHED' || error?.payload?.error === 'LIMIT_REACHED') {
      return 'LIMIT_REACHED';
    }
  
    console.error("Erro ao gerar prompt com Gemini:", error);
    return "Erro ao conectar com a IA. Tente novamente mais tarde.";
  }
};
