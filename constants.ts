import { PromptTemplate, PromptCategory, CharacterStyle } from "./types";

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // --- SCRIPTS (CONTENT CREATORS) ---
  {
    id: "script-youtube-long",
    title: "YouTube Vídeo Longo",
    description: "Estrutura de alta retenção para vlogs, tutoriais e reviews.",
    category: PromptCategory.SCRIPT,
    fields: [
      { id: "topic", label: "Tema do Vídeo", placeholder: "Ex: Review do iPhone 15, Tutorial de React...", type: "text" },
      { id: "hook_angle", label: "Ângulo do Gancho", placeholder: "Ex: Curiosidade polêmica, Promessa de resultado...", type: "text" },
      { id: "key_points", label: "Pontos Principais", placeholder: "Liste os tópicos que devem ser abordados...", type: "textarea" },
      { id: "cta_goal", label: "Objetivo do CTA", placeholder: "Ex: Inscrever no canal, Comprar curso...", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Atue como um estrategista de YouTube (YouTube Strategist) focado em retenção. Use os dados para criar um prompt que gere um roteiro completo. O roteiro final deve ter: Título otimizado para SEO, Gancho (Hook) magnético nos primeiros 30s, Introdução rápida, Conteúdo em tópicos estruturados (Body), Quebras de padrão (Pattern Interrupts) sugeridas e um CTA forte no final."
  },
  {
    id: "script-shorts",
    title: "YouTube Shorts Viral",
    description: "Roteiros dinâmicos e em loop de até 60 segundos.",
    category: PromptCategory.SCRIPT,
    fields: [
      { id: "topic", label: "Assunto", placeholder: "O que acontece no vídeo?", type: "text" },
      { id: "visual_hook", label: "Gancho Visual (3s)", placeholder: "O que aparece na tela imediatamente?", type: "text" },
      { id: "pacing", label: "Ritmo", placeholder: "Ex: Frenético, ASMR, Narrado rápido", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Atue como um especialista em vídeos virais de formato curto. Crie um prompt para gerar um roteiro de YouTube Shorts estritamente com menos de 60 segundos de leitura (aprox. 130-150 palavras). O prompt deve exigir: Gancho imediato, cortes rápidos, retenção de atenção e uma frase final que conecte com o início para criar um Loop perfeito."
  },
  {
    id: "script-reels",
    title: "Instagram Reels / TikTok",
    description: "Conteúdo para engajamento e crescimento de seguidores.",
    category: PromptCategory.SCRIPT,
    fields: [
      { id: "niche", label: "Nicho", placeholder: "Ex: Moda, Humor, Marketing Digital", type: "text" },
      { id: "trend_audio", label: "Áudio/Trend (Opcional)", placeholder: "Nome da música ou tipo de áudio em alta", type: "text" },
      { id: "value_prop", label: "Valor para o Seguidor", placeholder: "Dica, Inspiração, Identificação...", type: "textarea" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Atue como um Social Media Manager. Crie um prompt para gerar um roteiro de Reels/TikTok focado em crescimento. O prompt deve pedir: Sugestões de texto na tela (Text Overlays) para prender a atenção sem áudio, descrição da cena visual, roteiro falado (se houver) e uma sugestão de Legenda com Hashtags estratégicas."
  },

  // --- CHARACTERS (Pixar) ---
  {
    id: "char-pixar",
    title: "Personagem Estilo Pixar",
    description: "Crie um personagem 3D fofo e expressivo estilo Pixar.",
    category: PromptCategory.CHARACTER,
    style: CharacterStyle.PIXAR,
    fields: [
      { id: "subject", label: "Quem é o personagem?", placeholder: "Ex: Um garoto explorador, uma avó cozinheira", type: "text" },
      { id: "appearance", label: "Aparência Física", placeholder: "Cor dos olhos, cabelo, roupas...", type: "textarea" },
      { id: "expression", label: "Expressão Facial", placeholder: "Ex: Sorriso travesso, Olhar curioso", type: "text" },
      { id: "background", label: "Fundo/Cenário", placeholder: "Onde ele está?", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Você é um especialista em Prompts para Midjourney e Stable Diffusion com foco no estilo Pixar. Crie um prompt detalhado em Inglês. Use palavras-chave como: 'Pixar style, 3D render, Unreal Engine 5, cute, expressive, volumetric lighting, subsurface scattering'. Foque na descrição fornecida."
  },

  // --- CHARACTERS (Disney) ---
  {
    id: "char-disney",
    title: "Personagem Estilo Disney 2D/3D",
    description: "Princesas, heróis ou vilões no estilo clássico ou moderno.",
    category: PromptCategory.CHARACTER,
    style: CharacterStyle.DISNEY,
    fields: [
      { id: "type", label: "Arquétipo", placeholder: "Ex: Princesa, Vilão, Ajudante Mágico", type: "text" },
      { id: "features", label: "Características Marcantes", placeholder: "Olhos grandes, cabelo flutuante...", type: "textarea" },
      { id: "era", label: "Era/Estilo", placeholder: "Ex: Renascença Disney (2D), Moderno (Frozen)", type: "select", options: ["Clássico 2D", "Moderno 3D"] },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Crie um prompt mágico para gerar personagens estilo Disney. Se for 3D, foque em 'Disney Animation Studios style'. Se for 2D, foque em 'hand drawn, classic animation style'. Inclua detalhes de iluminação mágica e cores vibrantes."
  },

  // --- CHARACTERS (Cinematic/Hyper Realistic) ---
  {
    id: "char-real",
    title: "Retrato Hiper Realista",
    description: "Fotografia cinematográfica de alta fidelidade.",
    category: PromptCategory.CHARACTER,
    style: CharacterStyle.HYPER_REALISTIC,
    fields: [
      { id: "subject", label: "Sujeito", placeholder: "Homem idoso, mulher guerreira...", type: "text" },
      { id: "lighting", label: "Iluminação", placeholder: "Ex: Rembrandt lighting, Neon, Golden Hour", type: "text" },
      { id: "camera", label: "Câmera/Lente", placeholder: "Ex: 85mm, Sony A7RIV, Bokeh", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Crie um prompt para fotografia ultra-realista. Use termos técnicos de fotografia (ISO, f-stop, lens type). Palavras-chave: 'hyper-detailed, 8k, photorealistic, cinematic lighting, raw photo'."
  },

  // --- IMAGES (General) ---
  {
    id: "img-realistic",
    title: "Imagem Realista",
    description: "Cenas cotidianas e fotografias com aspecto natural.",
    category: PromptCategory.IMAGE,
    fields: [
      { id: "subject", label: "Descrição da Imagem", placeholder: "O que deve aparecer na imagem?", type: "textarea" },
      { id: "environment", label: "Ambiente", placeholder: "Ex: Cafeteria movimentada, Praia ao pôr do sol", type: "text" },
      { id: "lighting", label: "Luz", placeholder: "Ex: Luz natural suave, Luz de janela", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Crie um prompt de imagem focado em realismo natural. Use termos como 'photography', 'candid shot', 'natural lighting', 'highly detailed'. Evite exageros artísticos, focando na verossimilhança."
  },
  {
    id: "img-cinematic",
    title: "Imagem Cinemática",
    description: "Cenas épicas com aspecto de produção de Hollywood.",
    category: PromptCategory.IMAGE,
    style: CharacterStyle.CINEMATIC,
    fields: [
      { id: "scene", label: "Descrição da Cena", placeholder: "Descreva a ação ou cenário épico", type: "textarea" },
      { id: "mood", label: "Atmosfera", placeholder: "Ex: Dramática, Misteriosa, Cyberpunk", type: "text" },
      { id: "composition", label: "Composição", placeholder: "Ex: Wide shot, Rule of thirds, Low angle", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Crie um prompt visualmente impactante. Use terminologia de cinema: 'anamorphic lens', 'teal and orange grading', 'dramatic lighting', 'volumetric fog', 'widescreen'. O objetivo é parecer um frame de um filme de alto orçamento."
  },
  {
    id: "img-disney",
    title: "Cena Estilo Disney",
    description: "Paisagens mágicas e cenas completas no estilo animação.",
    category: PromptCategory.IMAGE,
    style: CharacterStyle.DISNEY,
    fields: [
      { id: "description", label: "Descrição da Cena", placeholder: "Ex: Um castelo nas nuvens, floresta encantada", type: "textarea" },
      { id: "colors", label: "Paleta de Cores", placeholder: "Ex: Vibrante, Tons pastéis, Dourado e Roxo", type: "text" },
      { id: "details", label: "Detalhes Mágicos", placeholder: "Ex: Brilhos, Pó de fada, Animais fofos", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Crie um prompt no estilo 'Disney/Pixar Animation'. Foque em 'whimsical atmosphere', 'vibrant colors', 'magical glow', 'soft shapes', '3d render style'. A imagem deve transmitir magia e encantamento."
  },
  {
    id: "img-anime",
    title: "Cena Estilo Anime",
    description: "Ilustrações japonesas, desde Studio Ghibli a Cyberpunk.",
    category: PromptCategory.IMAGE,
    style: CharacterStyle.ANIME,
    fields: [
      { id: "scene", label: "Descrição", placeholder: "O que está acontecendo?", type: "textarea" },
      { id: "art_style", label: "Estilo Específico", placeholder: "Ex: Studio Ghibli (Miyazaki), Makoto Shinkai (Céus detalhados), Cyberpunk Edgerunners", type: "text" },
      { id: "elements", label: "Elementos Visuais", placeholder: "Ex: Flores de cerejeira, Mecha, Espadas", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Crie um prompt focado em estética Anime de alta qualidade. Use termos como 'anime style', 'cel shaded', 'vibrant colors', 'highly detailed background'. Se o usuário citar Ghibli, use 'painterly style'. Se citar Shinkai, use 'beautiful sky', 'lens flare'."
  },
  {
    id: "img-hyper",
    title: "Imagem Hiper Realista",
    description: "Detalhes extremos, 8K, texturas perfeitas.",
    category: PromptCategory.IMAGE,
    style: CharacterStyle.HYPER_REALISTIC,
    fields: [
      { id: "object", label: "Objeto/Cena Principal", placeholder: "Descreva com riqueza de detalhes", type: "textarea" },
      { id: "texture", label: "Texturas", placeholder: "Ex: Pele porosa, Metal oxidado, Tecido de seda", type: "text" },
      { id: "tech_specs", label: "Especificações Técnicas", placeholder: "Ex: 8k resolution, Unreal Engine 5, Ray Tracing", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Crie um prompt focado em detalhamento técnico extremo. Use '8k resolution', 'macro photography', 'insane details', 'unreal engine 5 render', 'ray tracing'. O foco é a perfeição da textura e da luz."
  },

  // --- ANIMATION ---
  {
    id: "anim-motion",
    title: "Cena de Animação 3D",
    description: "Prompt focado em movimento abstrato e fluxo (Runway/Pika).",
    category: PromptCategory.ANIMATION,
    fields: [
      { id: "scene", label: "Descrição da Cena", placeholder: "O que acontece no vídeo?", type: "textarea" },
      { id: "movement", label: "Tipo de Movimento", placeholder: "Ex: Slow motion, Pan lateral, Zoom in rápido", type: "text" },
      { id: "style", label: "Estilo Visual", placeholder: "Ex: Cyberpunk, Aquarela, Stop Motion", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Atue como um diretor de fotografia virtual. Crie um prompt otimizado para geradores de vídeo (como Runway Gen-2 ou Pika Labs). Foque na descrição do movimento ('fluid motion', 'camera pan', 'dolly zoom') e na consistência visual."
  },
  {
    id: "anim-realistic",
    title: "Animação Ultra Realista",
    description: "Vídeos indistinguíveis da realidade (Sora/Kling).",
    category: PromptCategory.ANIMATION,
    fields: [
      { id: "subject", label: "O que aparece?", placeholder: "Ex: Um leão caminhando, pessoas na rua, chuva...", type: "text" },
      { id: "environment", label: "Ambiente/Clima", placeholder: "Ex: Floresta tropical, Dia nublado, Nova York...", type: "text" },
      { id: "camera_style", label: "Estilo de Câmera", placeholder: "Ex: GoPro, Drone, Câmera de segurança, Handheld", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Atue como um Videomaker profissional. Crie um prompt para geradores de vídeo AI high-end (Sora, Runway Gen-3, Kling) focado em fotorrealismo extremo. Use palavras-chave: 'photorealistic', '4k', 'highly detailed', 'raw footage', 'neutral color grading', 'documentary style'. Descreva texturas e iluminação natural."
  },
  {
    id: "anim-cinematic",
    title: "Animação Cinematográfica",
    description: "Estilo filme blockbuster com iluminação dramática.",
    category: PromptCategory.ANIMATION,
    fields: [
      { id: "scene", label: "Cena Épica", placeholder: "Descreva a ação dramática...", type: "textarea" },
      { id: "mood", label: "Mood/Atmosfera", placeholder: "Ex: Sombrio, Melancólico, Épico, Suspense", type: "text" },
      { id: "camera_move", label: "Movimento de Câmera", placeholder: "Ex: Slow motion, Dolly zoom, Tracking shot", type: "text" },
      { id: "lens", label: "Lente/Estética", placeholder: "Ex: Lente Anamórfica, 35mm, Granulação de filme", type: "text" },
      { id: "extra_context", label: "Descrição Opcional", placeholder: "Insira qualquer detalhe adicional, contexto específico ou preferências para refinar o resultado...", type: "textarea" }
    ],
    systemInstruction: "Atue como um Diretor de Fotografia de Cinema (DoP). Crie um prompt para gerar um vídeo com estética de filme. Foque em: 'cinematic lighting', 'teal and orange', 'depth of field', 'anamorphic lens flares', 'dynamic camera movement', 'Arri Alexa'. O resultado deve parecer um trailer de filme."
  }
];