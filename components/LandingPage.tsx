import React from 'react';
import {
  ArrowRight,
  Film,
  User,
  Wand2,
  Image,
  Youtube,
  Instagram,
  Music2,
  Twitch,
  Rocket,
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onPlans: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onPlans }) => {

  return (
    <div className="min-h-screen text-white selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden relative bg-[#05050a]">
      {/* Background Gradient (closer to prototype) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0620] via-[#070613] to-[#05050a]" />

        {/* Top halo (stronger) */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[680px] rounded-full bg-gradient-to-b from-purple-700/25 via-indigo-600/10 to-transparent blur-[90px]" />

        {/* Aurora blobs */}
        <div className="absolute top-[10%] left-[12%] w-[520px] h-[520px] rounded-full bg-purple-500/12 blur-[110px]" />
        <div className="absolute top-[18%] right-[8%] w-[560px] h-[560px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[46%] left-[-8%] w-[520px] h-[520px] rounded-full bg-blue-500/8 blur-[130px]" />
        <div className="absolute top-[58%] right-[-10%] w-[520px] h-[520px] rounded-full bg-fuchsia-500/8 blur-[140px]" />

        {/* Subtle stars (much softer) */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1.6px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>

      {/* Header / Nav */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
      <Wand2 className="w-5 h-5 text-black" />
    </div>
    <span className="text-xl font-bold tracking-tight">PromptFlow</span>
  </div>

  {/* Ações do topo */}
  <div className="flex items-center gap-4">
    {/* Botão Planos (secundário) */}
    <button
  onClick={onPlans}
  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
  Planos
 </button>

    {/* CTA principal */}
    <button
      onClick={onStart}
      className="px-5 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-200 hover:bg-white hover:text-black transition-all backdrop-blur"
    >
      Comece Gratuitamente
    </button>
  </div>
</header>


      {/* Main Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        {/* Optimized Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-300/80">
            IA Generativa Otimizada
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1]">
          Domine a Arte da <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
            Criatividade com IA
          </span>
        </h1>

        <p className="text-lg text-slate-300/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Transforme ideias abstratas em resultados visuais e textuais extraordinários. Nossa biblioteca de prompts foi desenhada para criadores que exigem excelência.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 rounded-full
                       bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#6366f1]
                       hover:scale-105 shadow-[0_0_45px_-10px_rgba(139,92,246,0.75)]"
          >
            <span>Criar Conteúdo Agora</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-slate-300/50">Sem cartão de crédito necessário • Acesso imediato</p>
        </div>

        {/* Feature Grid - same layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 text-left">
          <div className="group p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-6">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-3">YouTube & Virais</h3>
            <p className="text-sm text-slate-300/70 leading-relaxed">
              Roteiros de alta retenção para Shorts e vídeos longos que engajam desde o primeiro segundo.
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold mb-3">Mascotes & Avatares</h3>
            <p className="text-sm text-slate-300/70 leading-relaxed">
              Crie personagens consistentes e expressivos estilo Pixar para sua marca pessoal.
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
              <Image className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold mb-3">Imagens & Cenas</h3>
            <p className="text-sm text-slate-300/70 leading-relaxed">
              Gere cenários cinematográficos ultra-realistas para backgrounds e thumbnails.
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-6">
              <Film className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold mb-3">Animação IA</h3>
            <p className="text-sm text-slate-300/70 leading-relaxed">
              Controle total sobre movimento e estilo para criar B-Rolls gerados por IA.
            </p>
          </div>
        </div>

        {/* CTA Banner Section */}
        <section className="mt-40 mb-32 px-6">
  <div className="relative max-w-5xl mx-auto rounded-[32px] overflow-hidden border border-white/10 bg-[#0b0b14]">

    {/* Gradiente interno */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-500/10 pointer-events-none" />

    {/* Glow suave */}
    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/20 blur-[140px]" />

    <div className="relative z-10 px-10 py-16 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        Desbloqueie Seu{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Potencial Criativo
        </span>
      </h2>

      <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
        Não perca mais horas tentando adivinhar o prompt perfeito.
        Junte-se a milhares de criadores que já estão no futuro.
      </p>

      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition"
      >
        Experimente Gratuitamente 🚀
      </button>
    </div>
  </div>
</section>


        {/* Platforms Showcase */}
        <section className="mt-20">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300/50 mb-12">
            Plataformas que impulsionamos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 text-xl font-bold grayscale">
              <Youtube className="w-8 h-8" /> YouTube
            </div>
            <div className="flex items-center gap-2 text-xl font-bold grayscale">
              <Instagram className="w-8 h-8" /> Instagram
            </div>
            <div className="flex items-center gap-2 text-xl font-bold grayscale">
              <Music2 className="w-8 h-8" /> TikTok
            </div>
            <div className="flex items-center gap-2 text-xl font-bold grayscale">
              <Twitch className="w-8 h-8" /> TWITCH
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold">PromptFlow</span>
          </div>

          <div className="flex items-center gap-8 text-xs text-slate-300/55 font-medium">
            <a href="#" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
          </div>

          <div className="text-xs text-slate-300/45">© 2024 PromptFlow. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
