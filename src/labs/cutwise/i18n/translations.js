// Cutwise — UI translations (EN / PT / ES)
// Internal option values are always English (used by scoring logic).
// Only display strings are translated here.

const t = {
  en: {
    // ── Nav ────────────────────────────────────────────────────────────────────
    startAnalysis: 'Start analysis',
    imperial: 'in / lb',
    metric: 'mm / kg',

    // ── Hero ───────────────────────────────────────────────────────────────────
    tagline: 'Cutting technology selector',
    heroTitle1: 'Find the right cut for your',
    heroTitle2: 'material, tolerance,',
    heroTitle3: 'and budget',
    heroSubtitle: 'Answer a few questions about your job. Get a full comparison report across Laser, Plasma, Waterjet, and Oxyfuel — with cost breakdowns and a clear recommendation.',
    betaTitle: 'This is a beta.',
    betaBody: "We're still building the process database — cost estimates and recommendations are directional, not definitive. Use results as a starting point, not a final answer. Feedback helps us improve.",
    startFree: 'Start free analysis →',
    seeSample: 'See sample report',
    feature1: 'No sign-up to start',
    feature2: 'Metric & Imperial',
    feature3: 'Report sent to your inbox',

    // ── Wizard steps ──────────────────────────────────────────────────────────
    steps: [
      { title: 'What are you cutting?',          sub: 'Tell us about the material.' },
      { title: 'Describe the cut',               sub: 'Geometry and finish requirements.' },
      { title: 'Precision requirements',         sub: 'How tight does it need to be?' },
      { title: 'Volume & production',            sub: 'How many parts, how often?' },
      { title: 'What matters most?',             sub: 'This drives the recommendation.' },
      { title: 'Where should we send your report?', sub: 'Emailed to you instantly.' },
    ],
    stepOf: (c, total) => `STEP ${c} OF ${total}`,
    optional: 'optional',

    // ── Field labels ──────────────────────────────────────────────────────────
    fields: {
      material:   'Material type',
      thickness:  'Material thickness (mm)',
      thicknessIn:'Material thickness (in)',
      size:       'Part size (approx.)',
      geometry:   'Cut geometry',
      finish:     'Surface finish needed',
      haz:        'Heat sensitivity',
      tolerance:  'Dimensional tolerance',
      squareness: 'Edge squareness',
      quantity:   'Quantity per run',
      frequency:  'How often?',
      priority:   'Top priority',
      budget:     'Rough budget per part',
      firstName:  'First name',
      company:    'Company',
      email:      'Email address',
    },

    // ── Option display (internal English key → display label) ─────────────────
    options: {
      'Mild steel': 'Mild steel', 'Stainless steel': 'Stainless steel',
      'Aluminum': 'Aluminum', 'Copper': 'Copper', 'Titanium': 'Titanium', 'Other': 'Other',
      '< 100mm': '< 100mm', '100–500mm': '100–500mm', '500mm–1m': '500mm–1m', '> 1m': '> 1m',
      'Straight lines': 'Straight lines', 'Simple curves': 'Simple curves',
      'Complex contours': 'Complex contours', 'Holes / piercing': 'Holes / piercing', 'Mixed': 'Mixed',
      'Rough (structural)': 'Rough (structural)', 'Medium (functional)': 'Medium (functional)',
      'Fine (visible / precise)': 'Fine (visible / precise)',
      'Not sensitive': 'Not sensitive', 'Somewhat sensitive': 'Somewhat sensitive', 'Very sensitive': 'Very sensitive',
      '±0.5mm (loose)': '±0.5mm (loose)', '±0.2mm (standard)': '±0.2mm (standard)',
      '±0.1mm (tight)': '±0.1mm (tight)', '< ±0.05mm (precision)': '< ±0.05mm (precision)',
      'Not critical': 'Not critical', 'Important': 'Important', 'Critical': 'Critical',
      '1–5 (prototype)': '1–5 (prototype)', '6–50 (small batch)': '6–50 (small batch)',
      '51–500 (medium)': '51–500 (medium)', '500+ (production)': '500+ (production)',
      'One-off': 'One-off', 'Occasionally': 'Occasionally', 'Monthly': 'Monthly',
      'Weekly / continuous': 'Weekly / continuous',
      'Lowest cost': 'Lowest cost', 'Fastest turnaround': 'Fastest turnaround',
      'Best quality': 'Best quality', 'No heat distortion': 'No heat distortion',
      '< $2': '< $2', '$2–10': '$2–10', '$10–50': '$10–50', '$50+': '$50+', 'Not sure yet': 'Not sure yet',
    },

    // ── Email step ────────────────────────────────────────────────────────────
    phFirstName: 'Ana', phCompany: 'Acme Mfg.', phEmail: 'you@company.com',
    noSpam: 'No spam. Only used to send this report.',
    reportIncludes: 'Your report includes a technology recommendation, full cost breakdown, quality scorecard, and time estimates.',

    // ── Wizard navigation ─────────────────────────────────────────────────────
    back: '← Back', continue: 'Continue →', getReport: 'Get my report →',
    buildingReport: 'Building your report...',

    // ── Live comparison panel ─────────────────────────────────────────────────
    liveComparison: 'Live comparison',
    waitingInput: 'Waiting for input', partialEstimate: 'Partial estimate', goodEstimate: 'Good estimate',
    leading: 'Leading', notApplicable: 'Not applicable', perPart: '/ part',
    quality: 'Quality', speed: 'Speed', costFit: 'Cost fit', signal: 'Signal',

    // ── Availability reasons ──────────────────────────────────────────────────
    oxyfuelOnly: 'Oxyfuel only cuts mild steel',
    maxThickLong: (n) => `Max ${n}mm for this process`,
    mildSteelOnly: 'Mild steel only',
    maxThick: (n) => `Max ${n}mm`,

    // ── Signal messages ───────────────────────────────────────────────────────
    signalFor: (mat, th, tech, unit) =>
      `For ${mat || 'your material'}${th ? ` at ${th}${unit}` : ''}, ${tech} is currently leading.`,
    signalWaterjet: ' Waterjet advantage: zero heat-affected zone.',
    signalSpecialty: ' Waterjet preferred for specialty materials.',
    signalOxyfuel: ' Oxyfuel is highly competitive at this thickness.',

    // ── Report sub-nav ────────────────────────────────────────────────────────
    reportLabel: 'Report', newAnalysis: 'New analysis', exportPdf: 'Export PDF',

    // ── Recommendation banner ─────────────────────────────────────────────────
    recommendedTech: 'RECOMMENDED TECHNOLOGY',
    estCostPerPart: 'Est. cost per part', industryAvgBasis: 'industry average basis',
    recDesc: (mat, thick, tech) =>
      `For ${mat || 'your material'} at ${thick}, ${tech.toLowerCase()} delivers the best balance of quality, speed, and cost for your requirements.`,

    // ── Not-applicable notice ─────────────────────────────────────────────────
    notApplicableJob: 'Not applicable for this job:',

    // ── Scorecard ─────────────────────────────────────────────────────────────
    sideBySide: 'Side-by-side scorecard',
    criterion: 'Criterion',
    scorecardRows: ['Cut quality', 'Tolerance', 'Speed', 'Heat zone', 'Cost fit', 'Thick plate'],
    scorecardQuality: {
      plasma_conv: '⚡ Fair', plasma_hidef: '✓ Good',
      laser_low: '✓ Very good', laser_high: '★ Excellent',
      waterjet: '★ Excellent', oxyfuel: '✗ Rough',
    },
    scorecardSpeed: {
      plasma_conv: '⚡ Fastest', plasma_hidef: '⚡ Very fast',
      laser_low: '✓ Fast', laser_high: '✓ Fast',
      waterjet: '✗ Slow', oxyfuel: '✗ Slow',
    },
    scorecardHeat: {
      plasma_conv: '✗ High', plasma_hidef: '⚡ Medium',
      laser_low: '⚡ Low', laser_high: '⚡ Low',
      waterjet: '★ None', oxyfuel: '✗ High',
    },
    scorecardCost: {
      plasma_conv: '★ Lowest', plasma_hidef: '✓ Low',
      laser_low: '✓ Medium', laser_high: '⚡ Higher',
      waterjet: '⚡ Higher', oxyfuel: '★ Lowest',
    },
    scorecardThick: {
      plasma_conv: '✓ Good', plasma_hidef: '★ Excellent',
      laser_low: '✗ Limited', laser_high: '⚡ Medium',
      waterjet: '★ Excellent', oxyfuel: '★ Best',
    },

    // ── Cost breakdown ────────────────────────────────────────────────────────
    costBreakdown: 'Cost per part — breakdown',
    labor: 'Labor', abrasive: 'Abrasive', oxyFuel: 'O₂ + fuel',
    gas: 'Gas', electricity: 'Electricity', consumables: 'Consumables', cycleTime: 'Cycle time',

    // ── Score bars section ────────────────────────────────────────────────────
    qualitySpeedCost: 'Quality · Speed · Cost comparison',

    // ── Feedback ──────────────────────────────────────────────────────────────
    wereEstimatesAccurate: 'Were these estimates accurate?',
    helpImprove: 'Help improve the cost engine',
    closeX: 'Close ×', leaveFeedback: 'Leave feedback →',
    howAccurate: 'How accurate was the overall recommendation?',
    feedbackRatings: ['Way off', 'Somewhat off', 'Close enough', 'Pretty accurate', 'Spot on'],
    feedbackPlaceholder: 'e.g. Laser cost was accurate but plasma was 30% high for our shop rate...',
    anonymous: 'Anonymous · used only to improve estimates',
    sendFeedback: 'Send feedback',
    thankYou: 'Thank you — that genuinely helps.',
    thankYouNote: 'Every piece of feedback directly adjusts our cost model.',

    // ── Tech labels ───────────────────────────────────────────────────────────
    techs: {
      plasma_conv:  { label: 'Plasma (Conventional)',    short: 'Plasma Conv.' },
      plasma_hidef: { label: 'Plasma (High Definition)', short: 'Plasma HiDef' },
      laser_low:    { label: 'Laser (Low End)',          short: 'Laser Low' },
      laser_high:   { label: 'Laser (High End)',         short: 'Laser High' },
      waterjet:     { label: 'Waterjet',                 short: 'Waterjet' },
      oxyfuel:      { label: 'Oxyfuel',                  short: 'Oxyfuel' },
    },
  },

  // ════════════════════════════════════════════════════════════════════════════
  pt: {
    startAnalysis: 'Iniciar análise',
    imperial: 'pol / lb',
    metric: 'mm / kg',

    tagline: 'Seletor de tecnologia de corte',
    heroTitle1: 'Encontre o corte ideal para o seu',
    heroTitle2: 'material, tolerância,',
    heroTitle3: 'e orçamento',
    heroSubtitle: 'Responda algumas perguntas sobre o seu trabalho. Receba um relatório completo comparando Laser, Plasma, Waterjet e Oxicorte — com análise de custos e uma recomendação clara.',
    betaTitle: 'Esta é uma versão beta.',
    betaBody: 'Ainda estamos construindo o banco de dados de processos — as estimativas de custo e recomendações são indicativas, não definitivas. Use os resultados como ponto de partida, não como resposta final. Seu feedback nos ajuda a melhorar.',
    startFree: 'Iniciar análise gratuita →',
    seeSample: 'Ver relatório de exemplo',
    feature1: 'Sem cadastro para começar',
    feature2: 'Métrico & Imperial',
    feature3: 'Relatório enviado ao seu e-mail',

    steps: [
      { title: 'O que você está cortando?',          sub: 'Nos conte sobre o material.' },
      { title: 'Descreva o corte',                   sub: 'Geometria e requisitos de acabamento.' },
      { title: 'Requisitos de precisão',             sub: 'Quão preciso precisa ser?' },
      { title: 'Volume & produção',                  sub: 'Quantas peças e com que frequência?' },
      { title: 'O que é mais importante?',           sub: 'Isso define a recomendação.' },
      { title: 'Onde enviamos o seu relatório?',     sub: 'Enviado ao seu e-mail imediatamente.' },
    ],
    stepOf: (c, total) => `ETAPA ${c} DE ${total}`,
    optional: 'opcional',

    fields: {
      material:   'Tipo de material',
      thickness:  'Espessura do material (mm)',
      thicknessIn:'Espessura do material (pol)',
      size:       'Tamanho da peça (aprox.)',
      geometry:   'Geometria do corte',
      finish:     'Acabamento superficial necessário',
      haz:        'Sensibilidade ao calor',
      tolerance:  'Tolerância dimensional',
      squareness: 'Perpendicularidade da borda',
      quantity:   'Quantidade por lote',
      frequency:  'Com que frequência?',
      priority:   'Prioridade principal',
      budget:     'Orçamento aproximado por peça',
      firstName:  'Nome',
      company:    'Empresa',
      email:      'E-mail',
    },

    options: {
      'Mild steel': 'Aço carbono', 'Stainless steel': 'Aço inox',
      'Aluminum': 'Alumínio', 'Copper': 'Cobre', 'Titanium': 'Titânio', 'Other': 'Outro',
      '< 100mm': '< 100mm', '100–500mm': '100–500mm', '500mm–1m': '500mm–1m', '> 1m': '> 1m',
      'Straight lines': 'Linhas retas', 'Simple curves': 'Curvas simples',
      'Complex contours': 'Contornos complexos', 'Holes / piercing': 'Furos / perfurações', 'Mixed': 'Misto',
      'Rough (structural)': 'Bruto (estrutural)', 'Medium (functional)': 'Médio (funcional)',
      'Fine (visible / precise)': 'Fino (visível / preciso)',
      'Not sensitive': 'Não sensível', 'Somewhat sensitive': 'Pouco sensível', 'Very sensitive': 'Muito sensível',
      '±0.5mm (loose)': '±0.5mm (amplo)', '±0.2mm (standard)': '±0.2mm (padrão)',
      '±0.1mm (tight)': '±0.1mm (justo)', '< ±0.05mm (precision)': '< ±0.05mm (precisão)',
      'Not critical': 'Não crítico', 'Important': 'Importante', 'Critical': 'Crítico',
      '1–5 (prototype)': '1–5 (protótipo)', '6–50 (small batch)': '6–50 (pequeno lote)',
      '51–500 (medium)': '51–500 (médio)', '500+ (production)': '500+ (produção)',
      'One-off': 'Único', 'Occasionally': 'Ocasionalmente', 'Monthly': 'Mensal',
      'Weekly / continuous': 'Semanal / contínuo',
      'Lowest cost': 'Menor custo', 'Fastest turnaround': 'Menor prazo',
      'Best quality': 'Melhor qualidade', 'No heat distortion': 'Sem distorção térmica',
      '< $2': '< $2', '$2–10': '$2–10', '$10–50': '$10–50', '$50+': '$50+', 'Not sure yet': 'Ainda não sei',
    },

    phFirstName: 'Ana', phCompany: 'Empresa Ltda.', phEmail: 'voce@empresa.com',
    noSpam: 'Sem spam. Usado apenas para enviar este relatório.',
    reportIncludes: 'Seu relatório inclui uma recomendação de tecnologia, análise completa de custos, scorecard de qualidade e estimativas de tempo.',

    back: '← Voltar', continue: 'Continuar →', getReport: 'Receber meu relatório →',
    buildingReport: 'Gerando seu relatório...',

    liveComparison: 'Comparação em tempo real',
    waitingInput: 'Aguardando dados', partialEstimate: 'Estimativa parcial', goodEstimate: 'Boa estimativa',
    leading: 'Em destaque', notApplicable: 'Não aplicável', perPart: '/ peça',
    quality: 'Qualidade', speed: 'Velocidade', costFit: 'Custo', signal: 'Sinal',

    oxyfuelOnly: 'Oxicorte apenas para aço carbono',
    maxThickLong: (n) => `Máx. ${n}mm para este processo`,
    mildSteelOnly: 'Apenas aço carbono',
    maxThick: (n) => `Máx. ${n}mm`,

    signalFor: (mat, th, tech, unit) =>
      `Para ${mat || 'seu material'}${th ? ` em ${th}${unit}` : ''}, ${tech} está em destaque.`,
    signalWaterjet: ' Vantagem do Waterjet: zona afetada pelo calor zero.',
    signalSpecialty: ' Waterjet preferido para materiais especiais.',
    signalOxyfuel: ' Oxicorte é muito competitivo nesta espessura.',

    reportLabel: 'Relatório', newAnalysis: 'Nova análise', exportPdf: 'Exportar PDF',

    recommendedTech: 'TECNOLOGIA RECOMENDADA',
    estCostPerPart: 'Custo est. por peça', industryAvgBasis: 'base média do setor',
    recDesc: (mat, thick, tech) =>
      `Para ${mat || 'seu material'} em ${thick}, ${tech.toLowerCase()} oferece o melhor equilíbrio entre qualidade, velocidade e custo para seus requisitos.`,

    notApplicableJob: 'Não aplicável para este trabalho:',

    sideBySide: 'Comparação lado a lado',
    criterion: 'Critério',
    scorecardRows: ['Qualidade de corte', 'Tolerância', 'Velocidade', 'Zona de calor', 'Custo', 'Chapa grossa'],
    scorecardQuality: {
      plasma_conv: '⚡ Regular', plasma_hidef: '✓ Bom',
      laser_low: '✓ Muito bom', laser_high: '★ Excelente',
      waterjet: '★ Excelente', oxyfuel: '✗ Bruto',
    },
    scorecardSpeed: {
      plasma_conv: '⚡ Mais rápido', plasma_hidef: '⚡ Muito rápido',
      laser_low: '✓ Rápido', laser_high: '✓ Rápido',
      waterjet: '✗ Lento', oxyfuel: '✗ Lento',
    },
    scorecardHeat: {
      plasma_conv: '✗ Alta', plasma_hidef: '⚡ Média',
      laser_low: '⚡ Baixa', laser_high: '⚡ Baixa',
      waterjet: '★ Nenhuma', oxyfuel: '✗ Alta',
    },
    scorecardCost: {
      plasma_conv: '★ Mais baixo', plasma_hidef: '✓ Baixo',
      laser_low: '✓ Médio', laser_high: '⚡ Maior',
      waterjet: '⚡ Maior', oxyfuel: '★ Mais baixo',
    },
    scorecardThick: {
      plasma_conv: '✓ Bom', plasma_hidef: '★ Excelente',
      laser_low: '✗ Limitado', laser_high: '⚡ Médio',
      waterjet: '★ Excelente', oxyfuel: '★ Melhor',
    },

    costBreakdown: 'Custo por peça — detalhamento',
    labor: 'Mão de obra', abrasive: 'Abrasivo', oxyFuel: 'O₂ + combustível',
    gas: 'Gás', electricity: 'Energia', consumables: 'Consumíveis', cycleTime: 'Tempo de ciclo',

    qualitySpeedCost: 'Comparação Qualidade · Velocidade · Custo',

    wereEstimatesAccurate: 'As estimativas foram precisas?',
    helpImprove: 'Ajude a melhorar o motor de custos',
    closeX: 'Fechar ×', leaveFeedback: 'Deixar feedback →',
    howAccurate: 'Quão precisa foi a recomendação geral?',
    feedbackRatings: ['Muito errada', 'Um pouco errada', 'Razoável', 'Bem precisa', 'Perfeita'],
    feedbackPlaceholder: 'ex: O custo do laser estava certo, mas o plasma foi 30% alto para nossa operação...',
    anonymous: 'Anônimo · usado apenas para melhorar as estimativas',
    sendFeedback: 'Enviar feedback',
    thankYou: 'Obrigado — isso realmente ajuda.',
    thankYouNote: 'Cada feedback ajusta diretamente nosso modelo de custos.',

    techs: {
      plasma_conv:  { label: 'Plasma (Convencional)',        short: 'Plasma Conv.' },
      plasma_hidef: { label: 'Plasma (Alta Definição)',      short: 'Plasma HD' },
      laser_low:    { label: 'Laser (Entrada)',              short: 'Laser Básico' },
      laser_high:   { label: 'Laser (Alta Performance)',     short: 'Laser HP' },
      waterjet:     { label: 'Waterjet',                     short: 'Waterjet' },
      oxyfuel:      { label: 'Oxicorte',                     short: 'Oxicorte' },
    },
  },

  // ════════════════════════════════════════════════════════════════════════════
  es: {
    startAnalysis: 'Iniciar análisis',
    imperial: 'pulg / lb',
    metric: 'mm / kg',

    tagline: 'Selector de tecnología de corte',
    heroTitle1: 'Encuentra el corte correcto para tu',
    heroTitle2: 'material, tolerancia,',
    heroTitle3: 'y presupuesto',
    heroSubtitle: 'Responde algunas preguntas sobre tu trabajo. Obtén un informe completo comparando Láser, Plasma, Waterjet y Oxicorte — con análisis de costos y una recomendación clara.',
    betaTitle: 'Esta es una versión beta.',
    betaBody: 'Aún estamos construyendo la base de datos de procesos — las estimaciones de costo y recomendaciones son indicativas, no definitivas. Usa los resultados como punto de partida, no como respuesta final. Tu feedback nos ayuda a mejorar.',
    startFree: 'Iniciar análisis gratuito →',
    seeSample: 'Ver informe de ejemplo',
    feature1: 'Sin registro para empezar',
    feature2: 'Métrico & Imperial',
    feature3: 'Informe enviado a tu correo',

    steps: [
      { title: '¿Qué estás cortando?',                 sub: 'Cuéntanos sobre el material.' },
      { title: 'Describe el corte',                    sub: 'Geometría y requisitos de acabado.' },
      { title: 'Requisitos de precisión',              sub: '¿Qué tan ajustado necesita ser?' },
      { title: 'Volumen y producción',                 sub: '¿Cuántas piezas y con qué frecuencia?' },
      { title: '¿Qué es lo más importante?',           sub: 'Esto define la recomendación.' },
      { title: '¿A dónde enviamos tu informe?',        sub: 'Enviado a tu correo al instante.' },
    ],
    stepOf: (c, total) => `PASO ${c} DE ${total}`,
    optional: 'opcional',

    fields: {
      material:   'Tipo de material',
      thickness:  'Espesor del material (mm)',
      thicknessIn:'Espesor del material (pulg)',
      size:       'Tamaño de la pieza (aprox.)',
      geometry:   'Geometría del corte',
      finish:     'Acabado superficial requerido',
      haz:        'Sensibilidad al calor',
      tolerance:  'Tolerancia dimensional',
      squareness: 'Perpendicularidad del borde',
      quantity:   'Cantidad por lote',
      frequency:  '¿Con qué frecuencia?',
      priority:   'Prioridad principal',
      budget:     'Presupuesto aproximado por pieza',
      firstName:  'Nombre',
      company:    'Empresa',
      email:      'Correo electrónico',
    },

    options: {
      'Mild steel': 'Acero al carbono', 'Stainless steel': 'Acero inoxidable',
      'Aluminum': 'Aluminio', 'Copper': 'Cobre', 'Titanium': 'Titanio', 'Other': 'Otro',
      '< 100mm': '< 100mm', '100–500mm': '100–500mm', '500mm–1m': '500mm–1m', '> 1m': '> 1m',
      'Straight lines': 'Líneas rectas', 'Simple curves': 'Curvas simples',
      'Complex contours': 'Contornos complejos', 'Holes / piercing': 'Agujeros / perforaciones', 'Mixed': 'Mixto',
      'Rough (structural)': 'Rugoso (estructural)', 'Medium (functional)': 'Medio (funcional)',
      'Fine (visible / precise)': 'Fino (visible / preciso)',
      'Not sensitive': 'No sensible', 'Somewhat sensitive': 'Algo sensible', 'Very sensitive': 'Muy sensible',
      '±0.5mm (loose)': '±0.5mm (holgado)', '±0.2mm (standard)': '±0.2mm (estándar)',
      '±0.1mm (tight)': '±0.1mm (ajustado)', '< ±0.05mm (precision)': '< ±0.05mm (precisión)',
      'Not critical': 'No crítico', 'Important': 'Importante', 'Critical': 'Crítico',
      '1–5 (prototype)': '1–5 (prototipo)', '6–50 (small batch)': '6–50 (lote pequeño)',
      '51–500 (medium)': '51–500 (mediano)', '500+ (production)': '500+ (producción)',
      'One-off': 'Una vez', 'Occasionally': 'Ocasionalmente', 'Monthly': 'Mensual',
      'Weekly / continuous': 'Semanal / continuo',
      'Lowest cost': 'Menor costo', 'Fastest turnaround': 'Menor tiempo de entrega',
      'Best quality': 'Mejor calidad', 'No heat distortion': 'Sin distorsión térmica',
      '< $2': '< $2', '$2–10': '$2–10', '$10–50': '$10–50', '$50+': '$50+', 'Not sure yet': 'Aún no sé',
    },

    phFirstName: 'Ana', phCompany: 'Empresa S.A.', phEmail: 'tu@empresa.com',
    noSpam: 'Sin spam. Solo se usa para enviar este informe.',
    reportIncludes: 'Tu informe incluye una recomendación de tecnología, análisis completo de costos, scorecard de calidad y estimaciones de tiempo.',

    back: '← Atrás', continue: 'Continuar →', getReport: 'Obtener mi informe →',
    buildingReport: 'Generando tu informe...',

    liveComparison: 'Comparación en vivo',
    waitingInput: 'Esperando datos', partialEstimate: 'Estimación parcial', goodEstimate: 'Buena estimación',
    leading: 'Destacado', notApplicable: 'No aplicable', perPart: '/ pieza',
    quality: 'Calidad', speed: 'Velocidad', costFit: 'Costo', signal: 'Señal',

    oxyfuelOnly: 'Oxicorte solo para acero al carbono',
    maxThickLong: (n) => `Máx. ${n}mm para este proceso`,
    mildSteelOnly: 'Solo acero al carbono',
    maxThick: (n) => `Máx. ${n}mm`,

    signalFor: (mat, th, tech, unit) =>
      `Para ${mat || 'tu material'}${th ? ` en ${th}${unit}` : ''}, ${tech} está destacado.`,
    signalWaterjet: ' Ventaja del Waterjet: zona afectada por calor cero.',
    signalSpecialty: ' Waterjet preferido para materiales especiales.',
    signalOxyfuel: ' Oxicorte es muy competitivo a este espesor.',

    reportLabel: 'Informe', newAnalysis: 'Nuevo análisis', exportPdf: 'Exportar PDF',

    recommendedTech: 'TECNOLOGÍA RECOMENDADA',
    estCostPerPart: 'Costo est. por pieza', industryAvgBasis: 'base promedio del sector',
    recDesc: (mat, thick, tech) =>
      `Para ${mat || 'tu material'} en ${thick}, ${tech.toLowerCase()} ofrece el mejor equilibrio entre calidad, velocidad y costo para tus requisitos.`,

    notApplicableJob: 'No aplicable para este trabajo:',

    sideBySide: 'Comparación lado a lado',
    criterion: 'Criterio',
    scorecardRows: ['Calidad de corte', 'Tolerancia', 'Velocidad', 'Zona de calor', 'Costo', 'Chapa gruesa'],
    scorecardQuality: {
      plasma_conv: '⚡ Regular', plasma_hidef: '✓ Bueno',
      laser_low: '✓ Muy bueno', laser_high: '★ Excelente',
      waterjet: '★ Excelente', oxyfuel: '✗ Rugoso',
    },
    scorecardSpeed: {
      plasma_conv: '⚡ Más rápido', plasma_hidef: '⚡ Muy rápido',
      laser_low: '✓ Rápido', laser_high: '✓ Rápido',
      waterjet: '✗ Lento', oxyfuel: '✗ Lento',
    },
    scorecardHeat: {
      plasma_conv: '✗ Alta', plasma_hidef: '⚡ Media',
      laser_low: '⚡ Baja', laser_high: '⚡ Baja',
      waterjet: '★ Ninguna', oxyfuel: '✗ Alta',
    },
    scorecardCost: {
      plasma_conv: '★ Más bajo', plasma_hidef: '✓ Bajo',
      laser_low: '✓ Medio', laser_high: '⚡ Mayor',
      waterjet: '⚡ Mayor', oxyfuel: '★ Más bajo',
    },
    scorecardThick: {
      plasma_conv: '✓ Bueno', plasma_hidef: '★ Excelente',
      laser_low: '✗ Limitado', laser_high: '⚡ Medio',
      waterjet: '★ Excelente', oxyfuel: '★ Mejor',
    },

    costBreakdown: 'Costo por pieza — desglose',
    labor: 'Mano de obra', abrasive: 'Abrasivo', oxyFuel: 'O₂ + combustible',
    gas: 'Gas', electricity: 'Electricidad', consumables: 'Consumibles', cycleTime: 'Tiempo de ciclo',

    qualitySpeedCost: 'Comparación Calidad · Velocidad · Costo',

    wereEstimatesAccurate: '¿Fueron precisas estas estimaciones?',
    helpImprove: 'Ayuda a mejorar el motor de costos',
    closeX: 'Cerrar ×', leaveFeedback: 'Dejar feedback →',
    howAccurate: '¿Qué tan precisa fue la recomendación general?',
    feedbackRatings: ['Muy errada', 'Algo errada', 'Más o menos', 'Bastante precisa', 'Perfecta'],
    feedbackPlaceholder: 'ej: El costo del láser fue preciso pero el plasma fue 30% alto para nuestra operación...',
    anonymous: 'Anónimo · usado solo para mejorar las estimaciones',
    sendFeedback: 'Enviar feedback',
    thankYou: 'Gracias — eso realmente ayuda.',
    thankYouNote: 'Cada feedback ajusta directamente nuestro modelo de costos.',

    techs: {
      plasma_conv:  { label: 'Plasma (Convencional)',        short: 'Plasma Conv.' },
      plasma_hidef: { label: 'Plasma (Alta Definición)',     short: 'Plasma HD' },
      laser_low:    { label: 'Láser (Básico)',               short: 'Láser Básico' },
      laser_high:   { label: 'Láser (Alta Performance)',     short: 'Láser HP' },
      waterjet:     { label: 'Waterjet',                     short: 'Waterjet' },
      oxyfuel:      { label: 'Oxicorte',                     short: 'Oxicorte' },
    },
  },
}

export default t
