import React from 'react';
import { ArrowRight, Sparkles, Film, User, Video, TrendingUp, Wand2, Image } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-purple-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Brand Header */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center backdrop-blur-md">
           <Wand2 className="w-6 h-6 text-purple-400" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          PromptFlow
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-screen text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8 animate-fade-in-down">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-slate-300">A ferramenta secreta dos Top Creators</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 max-w-5xl">
          Crie Roteiros Virais e Personagens Únicos
        </h1>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Plataforma especializada para YouTubers e Influenciadores. Gere templates de prompts otimizados para roteiros de alta retenção (Shorts, Reels, YouTube) e consistência visual.
        </p>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-purple-600 rounded-full hover:bg-purple-700 hover:scale-105 focus:outline-none ring-offset-2 focus:ring-2 ring-purple-400"
        >
          <span>Criar Conteúdo Agora</span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 -z-10 rounded-full blur-md bg-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 text-left w-full">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">YouTube & Virais</h3>
            <p className="text-slate-400">Templates específicos para vídeos longos de alta retenção, Shorts e Reels focados em looping e engajamento.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Mascotes & Avatares</h3>
            <p className="text-slate-400">Gere prompts para criar seu próprio personagem ou mascote 3D consistente estilo Pixar ou Disney.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Imagens & Cenas</h3>
            <p className="text-slate-400">Crie paisagens realistas, fotografias cinematográficas e artes conceituais com controle total de luz e textura.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Animação IA</h3>
            <p className="text-slate-400">Controle total sobre movimentos de câmera e estilo para criar B-Rolls e animações cinematográficas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};