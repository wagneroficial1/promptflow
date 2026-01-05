import React, { useState, useEffect } from 'react';
import { User, PromptCategory, PromptTemplate, FavoritePrompt } from '../types';
import { PROMPT_TEMPLATES } from '../constants';
import { LogOut, Film, User as UserIcon, Video, Wand2, Copy, Check, ChevronRight, Sparkles, Globe, Image as ImageIcon, Star, Trash2, Sun, Moon, Cpu } from 'lucide-react';
import { generateProfessionalPrompt } from '../services/geminiService';
import { PLANS } from '../lib/plan';
import { loadUsage } from '../lib/usageStore';
import { incrementUsage } from '../lib/usageStore';
import type { SubscriptionPayload } from '../services/subscription';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onUpgrade?: () => void;

  subscription: SubscriptionPayload | null;
  loadingSubscription: boolean;
  subscriptionError: string | null;
}


const LANGUAGES = [
  'Português (Brasil)',
  'English (US)',
  'Español',
  'Français',
  'Deutsch',
  'Italiano',
  '日本語 (Japanese)',
  '한국어 (Korean)',
  '中文 (Chinese)'
];

const PLATFORMS = [
  'ChatGPT',
  'Claude',
  'Gemini',
  'Grok',
  'Kling',
  'Hailuo',
  'Seedance',
  'Nano Banana',
  'HeyGen',
  'Midjourney',
  'Runway Gen-3'
];

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  isDarkMode,
  toggleTheme,
  onUpgrade,
  subscription,
  loadingSubscription,
  subscriptionError,
}) => {

  const planId = subscription?.plan_id ?? 'free';
  const plan = PLANS[planId];
  const isFree = planId === 'free';
  
  const [activeCategory, setActiveCategory] = useState<PromptCategory>(PromptCategory.SCRIPT);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<FavoritePrompt[]>([]);

  const [usage, setUsage] = useState(() => loadUsage());

  useEffect(() => {
    setUsage(loadUsage());
  }, []);

  const remaining = Math.max(0, plan.limit - usage.used);

  // Form State
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [targetLanguage, setTargetLanguage] = useState<string>('Português (Brasil)');
  const [targetPlatform, setTargetPlatform] = useState<string>('ChatGPT');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load favorites on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('promptFlowFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const filteredTemplates = PROMPT_TEMPLATES.filter(t => t.category === activeCategory);

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setShowFavorites(false);
    setFormValues({});
    setGeneratedPrompt('');
    setCopied(false);
    // Set default platform based on category
    if (template.category === PromptCategory.SCRIPT) setTargetPlatform('ChatGPT');
    else if (template.category === PromptCategory.ANIMATION) setTargetPlatform('Kling');
    else if (template.category === PromptCategory.IMAGE) setTargetPlatform('Midjourney');
  };

  const handleInputChange = (id: string, value: string) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
  console.log('HANDLE GENERATE DISPAROU');
  setIsGenerating(true);
  setGeneratedPrompt('');

  // 🔒 GARANTIR QUE A SESSÃO JÁ EXISTE
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.access_token) {
    alert('Sessão ainda não carregada. Recarregue a página.');
    setIsGenerating(false);
    return;
  }

  const result = await generateProfessionalPrompt(
    selectedTemplate.systemInstruction,
    formValues,
    targetLanguage,
    targetPlatform
  );

  // 🔒 BLOQUEIO REAL POR LIMITE (backend)
  if (result === 'LIMIT_REACHED') {
    setIsGenerating(false);
    return;
  }

  if (typeof result === 'string') {
    incrementUsage();
    setUsage(loadUsage());
    setGeneratedPrompt(result);
  }

  setIsGenerating(false);
};

    
    const result = await generateProfessionalPrompt(
      selectedTemplate.systemInstruction, 
      formValues,
      targetLanguage,
      targetPlatform
    );

// 🔒 BLOQUEIO REAL POR LIMITE (fonte da verdade = backend)
if (result === 'LIMIT_REACHED') {
  setIsGenerating(false);

  // força a UI a refletir o bloqueio do backend
  setUsage({ used: plan.limit });

  return;
}



if (typeof result === 'string' && result !== 'LIMIT_REACHED') {
  setGeneratedPrompt(result);
}

setIsGenerating(false);


  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = () => {
    if (!generatedPrompt || !selectedTemplate) return;

    const existingIndex = favorites.findIndex(f => f.content === generatedPrompt);

    let newFavorites;
    if (existingIndex >= 0) {
      // Remove
      newFavorites = favorites.filter((_, index) => index !== existingIndex);
    } else {
      // Add
      const newFavorite: FavoritePrompt = {
        id: crypto.randomUUID(),
        content: generatedPrompt,
        templateTitle: selectedTemplate.title,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        category: selectedTemplate.category
      };
      newFavorites = [newFavorite, ...favorites];
    }

    setFavorites(newFavorites);
    localStorage.setItem('promptFlowFavorites', JSON.stringify(newFavorites));
  };

  const handleDeleteFavorite = (id: string) => {
    const newFavorites = favorites.filter(f => f.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('promptFlowFavorites', JSON.stringify(newFavorites));
  };

  const isCurrentPromptFavorite = favorites.some(f => f.content === generatedPrompt);

  const switchCategory = (category: PromptCategory) => {
    setActiveCategory(category);
    setSelectedTemplate(null);
    setShowFavorites(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xl">
            <Wand2 className="w-6 h-6" />
            <span>PromptFlow</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => switchCategory(PromptCategory.SCRIPT)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${!showFavorites && activeCategory === PromptCategory.SCRIPT ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-600/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Film className="w-5 h-5" />
            <span>Roteiros</span>
          </button>
          
          <button
            onClick={() => switchCategory(PromptCategory.CHARACTER)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${!showFavorites && activeCategory === PromptCategory.CHARACTER ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-600/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <UserIcon className="w-5 h-5" />
            <span>Personagens</span>
          </button>

          <button
            onClick={() => switchCategory(PromptCategory.IMAGE)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${!showFavorites && activeCategory === PromptCategory.IMAGE ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-600/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Imagens</span>
          </button>
          
          <button
            onClick={() => switchCategory(PromptCategory.ANIMATION)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${!showFavorites && activeCategory === PromptCategory.ANIMATION ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-600/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Video className="w-5 h-5" />
            <span>Animação</span>
          </button>

          <div className="my-2 border-t border-slate-200 dark:border-slate-800/50"></div>

          <button
            onClick={() => { setShowFavorites(true); setSelectedTemplate(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${showFavorites ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Star className={`w-5 h-5 ${showFavorites ? 'fill-current' : ''}`} />
            <span>Favoritos</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
            </span>
          </button>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="text-slate-900 dark:text-white font-medium">{user.name}</p>
                <p className="text-slate-500 dark:text-slate-500 text-xs truncate w-24">{user.email}</p>
              </div>
            </div>
            <button onClick={onLogout} className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 relative transition-colors duration-300">
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-slate-500 dark:text-white/70">
        Seu plano atual
      </p>
      <p className="text-lg font-semibold text-slate-900 dark:text-white">
        {loadingSubscription ? 'Validando...' : subscriptionError ? 'Erro ao validar' : plan.name}{' '}
        <span className="text-sm font-normal text-slate-500 dark:text-white/60">
          · {plan.limit} prompts/mês
        </span>
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-white/70">
        Usados:{' '}
        <span className="font-medium text-slate-900 dark:text-white">
          {usage.used}
        </span>{' '}
        · Restantes:{' '}
        <span className="font-medium text-slate-900 dark:text-white">
          {remaining}
        </span>
      </p>
    </div>
  </div>
</div>

        {/* Background blobs for main area */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
            <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px]"></div>
         </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {showFavorites ? (
            /* Favorites View */
            <div className="animate-fade-in">
              <header className="mb-8 flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500 dark:text-yellow-400 fill-current" />
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Meus Favoritos</h1>
                  <p className="text-slate-500 dark:text-slate-400">Gerencie seus prompts salvos.</p>
                </div>
              </header>

              {favorites.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                  <Star className="w-12 h-12 text-slate-400 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">Você ainda não salvou nenhum prompt.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((fav) => (
                    <div key={fav.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-2 py-1 rounded-full">{fav.category}</span>
                          <h3 className="font-bold text-slate-900 dark:text-white mt-2">{fav.templateTitle}</h3>
                          <span className="text-xs text-slate-500">{fav.createdAt}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteFavorite(fav.id)}
                          className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors p-1"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded p-3 text-xs text-slate-600 dark:text-slate-300 font-mono mb-4 h-32 overflow-hidden relative border border-slate-100 dark:border-slate-800">
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 dark:to-slate-950 pointer-events-none"></div>
                         {fav.content}
                      </div>

                      <div className="mt-auto">
                        <button 
                          onClick={() => handleCopy(fav.content)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Copy className="w-4 h-4" /> Copiar Prompt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : !selectedTemplate ? (
            /* Template Gallery */
            <div className="animate-fade-in">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{activeCategory}</h1>
                <p className="text-slate-500 dark:text-slate-400">Escolha um template para começar a criar.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20 transition-all duration-200 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${
                          template.category === PromptCategory.SCRIPT ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                          template.category === PromptCategory.CHARACTER ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                          template.category === PromptCategory.IMAGE ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' :
                          'bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400'
                        }`}>
                           {template.category === PromptCategory.SCRIPT && <Film className="w-5 h-5" />}
                           {template.category === PromptCategory.CHARACTER && <UserIcon className="w-5 h-5" />}
                           {template.category === PromptCategory.IMAGE && <ImageIcon className="w-5 h-5" />}
                           {template.category === PromptCategory.ANIMATION && <Video className="w-5 h-5" />}
                        </div>
                        {template.style && (
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {template.style}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{template.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{template.description}</p>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-500 font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Selecionar <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Generator View */
            <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up">
              {/* Form Side */}
              <div className="flex-1">
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="mb-6 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors text-sm"
                >
                  ← Voltar para galeria
                </button>
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
                  <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedTemplate.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{selectedTemplate.description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[100px]"
                            placeholder={field.placeholder}
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                          />
                        ) : field.type === 'select' ? (
                          <select 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                          >
                             <option value="" disabled>Selecione...</option>
                             {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder={field.placeholder}
                            value={formValues[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                          />
                        )}
                      </div>
                    ))}

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Language Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                          Idioma do Resultado
                        </label>
                        <select 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer hover:border-purple-500/50"
                          value={targetLanguage}
                          onChange={(e) => setTargetLanguage(e.target.value)}
                        >
                          {LANGUAGES.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>

                      {/* AI Platform Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          Plataforma Alvo (IA)
                        </label>
                        <select 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer hover:border-purple-500/50"
                          value={targetPlatform}
                          onChange={(e) => setTargetPlatform(e.target.value)}
                        >
                          {PLATFORMS.map(platform => (
                            <option key={platform} value={platform}>{platform}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        O prompt será otimizado tecnicamente para a plataforma <strong>{targetPlatform}</strong> (ex: sintaxe específica, duração, parâmetros).
                    </p>

                    {remaining === 0 ? (
  <div className="w-full mt-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <div>
      <p className="text-base font-semibold text-slate-900 dark:text-white">
        Você esgotou seu limite grátis
      </p>
      <p className="text-sm text-slate-500 dark:text-white/70">
        Faça upgrade e tenha mais prompts disponíveis por mês.
      </p>
    </div>

    <button
      type="button"
      onClick={() => onUpgrade?.()}
      className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition"
    >
      Upgrade de Plano
    </button>
  </div>
) : (
  <button
  onClick={handleGenerate}
  disabled={isGenerating}
  className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
> 
    {isGenerating ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        Gerando com IA...
      </>
    ) : (
      <>
        <Wand2 className="w-5 h-5" />
          {isFree ? 'Desbloquear (Pro)' : 'Gerar Prompt Otimizado'}
        </>
    )}
  </button>
)}

                  </div>
                </div>
              </div>

              {/* Result Side */}
              <div className="lg:w-[450px]">
                <div className={`sticky top-6 h-full min-h-[400px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 flex flex-col transition-all duration-300 shadow-sm ${generatedPrompt ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                   
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Resultado</h3>
                     <div className="flex gap-2">
                      {generatedPrompt && (
                        <>
                          <button
                            onClick={toggleFavorite}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${isCurrentPromptFavorite ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-500/30' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                            title={isCurrentPromptFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
                          >
                            <Star className={`w-3.5 h-3.5 ${isCurrentPromptFavorite ? 'fill-current' : ''}`} />
                            {isCurrentPromptFavorite ? 'Salvo' : 'Salvar'}
                          </button>

                          <button
                            onClick={() => handleCopy(generatedPrompt)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copiado!' : 'Copiar'}
                          </button>
                        </>
                      )}
                     </div>
                   </div>

                   {generatedPrompt ? (
                     <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 rounded-lg p-5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-sans text-sm md:text-base leading-7 whitespace-pre-wrap shadow-inner">
                        {generatedPrompt}
                     </div>
                   ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                       <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                       <p className="text-center text-sm px-6">Preencha o formulário e clique em gerar para ver a mágica acontecer.</p>
                     </div>
                   )}

                   {generatedPrompt && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg text-xs text-blue-700 dark:text-blue-200">
                      <strong>Dica Pro:</strong> Copie este prompt para o <strong>{targetPlatform}</strong>. Cada IA tem seus pontos fortes, e este prompt foi ajustado para eles.
                    </div>
                   )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
