import React from 'react';
import { ArrowRight, Sparkles, Film, User, Video, Wand2, Image, Youtube, Instagram, Music2, Twitch, Rocket } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#05050a] text-white selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-purple-900/20 via-blue-900/5 to-transparent blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]"></div>
        
        {/* Subtle Stars/Dots Pattern */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Header / Nav */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
             <Wand2 className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">PromptFlow</span>
        </div>
        <button 
          onClick={onStart}
          className="px-5 py-2 rounded-lg border border-slate-800 text-sm font-medium text-slate-300 hover:bg-white hover:text-black transition-all"
        >
          Comece Gratuitamente
        </button>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        
        {/* Optimized Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 mb-10 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400">IA Generativa Otimizada</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1]">
          Domine a Arte da <br /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
            Criatividade com IA
          </span>
        </h1>

        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Transforme ideias abstratas em resultados visuais e textuais extraordinários. Nossa biblioteca de prompts foi desenhada para criadores que exigem excelência.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-purple-600 rounded-full hover:bg-purple-500 hover:scale-105 shadow-[0_0_30px_-5px_rgba(147,51,234,0.5)]"
          >
            <span>Criar Conteúdo Agora</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-slate-500">Sem cartão de crédito necessário • Acesso imediato</p>
        </div>

        {/* Feature Grid - Identical to Prototype */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 text-left">
          
          {/* Card 1: YouTube */}
          <div className="group p-8 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-6">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-3">YouTube & Virais</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Roteiros de alta retenção para Shorts e vídeos longos que engajam desde o primeiro segundo.</p>
          </div>
          
          {/* Card 2: Characters */}
          <div className="group p-8 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
              <User className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold mb-3">Mascotes & Avatares</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Crie personagens consistentes e expressivos estilo Pixar para sua marca pessoal.</p>
          </div>

          {/* Card 3: Images */}
          <div className="group p-8 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
              <Image className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold mb-3">Imagens & Cenas</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Gere cenários cinematográficos ultra-realistas para backgrounds e thumbnails.</p>
          </div>

          {/* Card 4: Animation */}
          <div className="group p-8 rounded-2xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-6">
              <Film className="w-5 h-5 text-pink-500" />
            </div>
            <h3 className="text-lg font-bold mb-3">Animação IA</h3>
            <p className="text-sm text-slate-400 leading-relaxed">Controle total sobre movimento e estilo para criar B-Rolls gerados por IA.</p>
          </div>
        </div>

        {/* CTA Banner Section */}
        <section className="mt-40 mb-32">
          <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[40px] bg-gradient-to-b from-slate-900/50 to-slate-950 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-purple-600/20 blur-[80px] group-hover:scale-150 transition-transform duration-700"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Desbloqueie Seu <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Potencial Criativo</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Não perca mais horas tentando adivinhar o prompt perfeito. Junte-se a milhares de criadores que já estão no futuro.
            </p>
            <button 
              onClick={onStart}
              className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center gap-2 mx-auto"
            >
              Experimente Gratuitamente <Rocket className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Platforms Showcase */}
        <section className="mt-20">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-12">Plataformas que impulsionamos</p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 text-xl font-bold grayscale"><Youtube className="w-8 h-8" /> YouTube</div>
            <div className="flex items-center gap-2 text-xl font-bold grayscale"><Instagram className="w-8 h-8" /> Instagram</div>
            <div className="flex items-center gap-2 text-xl font-bold grayscale"><Music2 className="w-8 h-8" /> TikTok</div>
            <div className="flex items-center gap-2 text-xl font-bold grayscale"><Twitch className="w-8 h-8" /> TWITCH</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-bold">PromptFlow</span>
          </div>
          
          <div className="flex items-center gap-8 text-xs text-slate-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>

          <div className="text-xs text-slate-600">
            © 2024 PromptFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
