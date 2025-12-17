export enum PromptCategory {
  SCRIPT = 'Roteiro',
  CHARACTER = 'Personagem',
  ANIMATION = 'Animação',
  IMAGE = 'Imagem'
}

export enum CharacterStyle {
  PIXAR = 'Pixar',
  CARTOON_3D = '3D Cartoon',
  DISNEY = 'Disney',
  HYPER_REALISTIC = 'Hiper Realista',
  CINEMATIC = 'Cinemático',
  ANIME = 'Anime'
}

export interface InputField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[]; // For select inputs
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  style?: CharacterStyle; // Optional, mainly for characters
  fields: InputField[];
  systemInstruction: string; // Instruction for Gemini on how to build this prompt
}

export interface FavoritePrompt {
  id: string;
  content: string;
  templateTitle: string;
  createdAt: string;
  category: PromptCategory;
}

export interface User {
  email: string;
  name: string;
}

export type ViewState = 'landing' | 'auth' | 'dashboard';