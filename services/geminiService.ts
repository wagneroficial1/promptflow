import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODELS } from "./geminiModels";
import { enqueue } from "./requestQueue";

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

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Retry inteligente só para 429 (1–3s + tentativas limitadas)
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
      if (!ai) {
        return "Configuração incompleta: defina a variável VITE_GEMINI_API_KEY na Vercel para ativar a geração de prompts.";
      }

      const response = await ai.models.generateContent({
        model,
        contents: inputDescription,
        config: {
          systemInstruction,
          temperature,
        },
      });

      return response.text || "Não foi possível gerar o prompt. Tente novamente.";
    } catch (error) {
      // Só faz retry para 429
      if (isRateLimitError(error) && attempt < maxRetries) {
        attempt++;
        const waitMs = randomInt(1000, 3000);
        console.warn(
          `[Gemini] 429 detectado. Retry ${attempt}/${maxRetries} em ${waitMs}ms`
        );
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
    const text = await enqueue(() =>
      generateWithRetry({
        systemInstruction,
        inputDescription,
        model: GEMINI_MODELS.textPrompt,
        temperature: 0.7,
        maxRetries: 2, // 2 retries = até 3 tentativas no total
      })
    );

    return text;
  } catch (error) {
    console.error("Erro ao gerar prompt com Gemini:", error);
    return "Erro ao conectar com a IA. Verifique sua chave de API ou tente novamente mais tarde.";
  }
};
