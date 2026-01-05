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
