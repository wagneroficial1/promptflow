import React from 'react';

interface PlansPageProps {
  onBack: () => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onBack }) => {

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden relative bg-[#05050a]">
      {/* Background igual ao da Home */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0620] via-[#070613] to-[#05050a]" />

        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[680px] rounded-full bg-gradient-to-b from-purple-700/25 via-indigo-600/10 to-transparent blur-[90px]" />

        <div className="absolute top-[15%] left-[10%] w-[520px] h-[520px] rounded-full bg-purple-500/12 blur-[110px]" />
        <div className="absolute top-[20%] right-[8%] w-[560px] h-[560px] rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
      </div>

      
{/* Header / Top Bar */}
<header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
      <span className="text-black font-bold">✦</span>
    </div>
    <span className="text-xl font-bold tracking-tight">PromptFlow</span>
  </div>

  <button
    onClick={onBack}
    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
  >
    ← Voltar
  </button>
</header>

      {/* Conteúdo */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Escolha o plano ideal para você
        </h1>

        <p className="text-lg text-slate-300/70 max-w-2xl mx-auto mb-20">
          Tenha acesso a prompts profissionais, criados para máxima performance em conteúdo, imagem, vídeo e automação.
        </p>

        {/* Cards de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FREE */}
          <div className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl text-left">
            <h3 className="text-xl font-bold mb-1">Free</h3>
            <p className="text-slate-400 mb-6">Para experimentar sem compromisso</p>

            <div className="text-4xl font-bold mb-6">
              R$ 0
              <span className="text-base text-slate-400 font-medium"> / mês</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-slate-300/80">
              <li>• 5 prompts por mês</li>
              <li>• Acesso básico à plataforma</li>
              <li>• Ideal para testar o fluxo</li>
            </ul>

            <button className="w-full py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition">
              Começar grátis
            </button>
          </div>

          {/* PRO — plano principal */}
          <div className="relative p-8 rounded-2xl bg-white/[0.06] border border-purple-400/50 backdrop-blur-xl text-left scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-purple-500 text-xs font-bold">
              MAIS POPULAR
            </div>

            <h3 className="text-xl font-bold mb-1">Pro</h3>
            <p className="text-slate-300 mb-6">Liberdade para criar todos os dias</p>

            <div className="text-4xl font-bold mb-6">
              R$ 29
              <span className="text-base text-slate-300 font-medium"> / mês</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-slate-200">
              <li>• 600 prompts por mês (≈ 20 por dia)</li>
              <li>• Todos os templates</li>
              <li>• Histórico completo</li>
              <li>• Salvar e reutilizar prompts</li>
            </ul>

            <button className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition-all">
              Assinar Pro
            </button>
          </div>

          {/* BUSINESS */}
          <div className="p-8 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl text-left">
            <h3 className="text-xl font-bold mb-1">Business</h3>
            <p className="text-slate-400 mb-6">Para uso profissional e intensivo</p>

            <div className="text-4xl font-bold mb-6">
              R$ 49
              <span className="text-base text-slate-400 font-medium"> / mês</span>
            </div>

            <ul className="space-y-3 mb-8 text-sm text-slate-300/80">
              <li>• 1200 prompts por mês (≈ 40 por dia)</li>
              <li>• Uso intensivo sem fricção</li>
              <li>• Ideal para equipes e agências</li>
              <li>• Prioridade futura</li>
            </ul>

            <button className="w-full py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition">
              Assinar Business
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
