import React from 'react';
import { Wand2 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onPlans: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onPlans }) => {
  return (
    <div className="min-h-screen bg-[#05050a] text-white flex flex-col">
      
      {/* Header */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">PromptFlow</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onPlans}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition"
          >
            Planos
          </button>

          <button
            onClick={onStart}
            className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-slate-200 transition"
          >
            Comece Gratuitamente
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Crie prompts poderosos com IA
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Gere prompts otimizados para imagens, personagens, vídeos e muito mais —
            sem complicação.
          </p>

          <button
            onClick={onStart}
            className="px-10 py-4 rounded-full bg-purple-600 hover:bg-purple-500 transition font-bold"
          >
            Criar agora
          </button>
        </div>
      </main>
    </div>
  );
};
