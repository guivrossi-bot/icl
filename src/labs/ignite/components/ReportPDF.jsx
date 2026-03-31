import { INDUSTRY_DEFAULTS, APP_CALC_MAP } from "../lib/calculators";

const APP_ICONS = {
  burnRate: "🔥", noPreheat: "🌡️", training: "🎓", setup: "⚙️",
  grinding: "🔩", skeleton: "🏗️", beveling: "📐", marking: "✏️",
  gouging: "⚡", tempAttach: "🔗",
};

const APP_NAMES = {
  en: {
    burnRate: "Burn Rate — General Cutting",
    noPreheat: "No Preheat Required",
    training: "Reduced Training Time",
    setup: "Reduced Setup Time",
    grinding: "Reduction in Grinding",
    skeleton: "Skeleton Removal",
    beveling: "Post-Table Beveling",
    marking: "Handheld Marking",
    gouging: "Plasma Gouging vs. Carbon Arc Gouging",
    tempAttach: "Temporary Attachment Removal",
  },
  es: {
    burnRate: "Velocidad de Corte General",
    noPreheat: "Sin Precalentamiento",
    training: "Tiempo de Entrenamiento Reducido",
    setup: "Tiempo de Configuracion Reducido",
    grinding: "Reduccion en Esmerilado",
    skeleton: "Remocion de Esqueleto",
    beveling: "Biselado Post-Mesa",
    marking: "Marcado Manual",
    gouging: "Gouging Plasma vs. Arco de Carbon",
    tempAttach: "Remocion de Fijaciones Temporales",
  },
  pt: {
    burnRate: "Taxa de Corte Geral",
    noPreheat: "Sem Pre-aquecimento",
    training: "Tempo de Treinamento Reduzido",
    setup: "Tempo de Configuracao Reduzido",
    grinding: "Reducao no Esmerilamento",
    skeleton: "Remocao de Esqueleto",
    beveling: "Chanframento Pos-Mesa",
    marking: "Marcacao Manual",
    gouging: "Goivagem Plasma vs. Arco de Carbono",
    tempAttach: "Remocao de Fixacoes Temporarias",
  },
};

const APP_WHY = {
  en: {
    burnRate: "Plasma cuts steel at significantly higher speeds than oxyfuel because it does not require preheating. The arc temperature reaches 20,000°C — far exceeding oxyfuel's 3,500°C — allowing it to melt and expel metal instantly. Cut speeds are based on validated cut charts for 12mm mild steel.",
    noPreheat: "Every oxyfuel cut requires 10–30 seconds of preheating before the arc can pierce the steel. Plasma pierces instantly. This saving compounds with every single torch start across your entire workforce throughout the year.",
    training: "Oxyfuel systems require extensive safety training due to the use of combustible gases — cylinder handling, hose management, gas leak detection, and fire watch procedures. Plasma systems eliminate these risks and the associated training burden.",
    setup: "Oxyfuel torches must be re-setup whenever they sit idle for more than 15 minutes due to gas cooling and tip fouling. Plasma systems require significantly fewer and faster setups, freeing operators to focus on cutting.",
    grinding: "Oxyfuel produces a heat-affected zone (HAZ) that oxidizes and hardens the cut edge, requiring extensive grinding before welding. Plasma's smaller HAZ produces a cleaner edge that requires far less grinding — typically 20% of oxyfuel grinding time.",
    skeleton: "After CNC cutting, the leftover steel skeleton must be removed before the next plate can load. With oxyfuel this is slow and awkward. A dedicated plasma system with a long torch cuts the skeleton faster and more safely, increasing table utilization.",
    beveling: "Oxyfuel bevel cutting is slow, requires preheating, and leaves rough edges that need grinding. Plasma bevels at higher speeds, requires no preheating, produces cleaner edges, and eliminates the gas cost — replacing $12.98/hr fuel gas with $1.68/hr electricity.",
    marking: "Manual hand punching is slow, repetitive, and causes ergonomic injuries. Plasma marking is 8–10x faster, produces a permanent mark that survives shot blasting and painting, and eliminates repetitive motion injuries.",
    gouging: "Carbon arc gouging (CAG) requires expensive carbon rods, generates significant noise and fine carbon particulate, and leaves a rough surface requiring heavy grinding. Plasma gouging is faster, quieter, cleaner, and produces less post-weld grinding.",
    tempAttach: "Removing temporary attachments with oxyfuel or CAG leaves significant material that must be ground flush. Plasma FlushCut technology allows cutting parallel to the base metal, leaving minimal material for grinding and allowing lugs to be reused up to 10 times.",
  },
  es: {
    burnRate: "El plasma corta acero a velocidades significativamente mayores que el oxicombustible porque no requiere precalentamiento. La temperatura del arco alcanza 20.000°C, muy por encima de los 3.500°C del oxicombustible.",
    noPreheat: "Cada corte con oxicombustible requiere entre 10 y 30 segundos de precalentamiento. El plasma perfora instantaneamente. Este ahorro se acumula con cada inicio de antorcha en toda su fuerza laboral durante el ano.",
    training: "Los sistemas de oxicombustible requieren una amplia capacitacion en seguridad debido al uso de gases combustibles. Los sistemas de plasma eliminan estos riesgos y la carga de capacitacion asociada.",
    setup: "Las antorchas de oxicombustible deben reconfigurarse cuando permanecen inactivas mas de 15 minutos. Los sistemas de plasma requieren configuraciones significativamente menos frecuentes y mas rapidas.",
    grinding: "El oxicombustible produce una zona afectada por el calor que oxida y endurece el borde cortado, requiriendo esmerilado extenso antes de soldar. El plasma produce un borde mas limpio que requiere mucho menos esmerilado.",
    skeleton: "Despues del corte CNC, el esqueleto de acero sobrante debe retirarse antes de cargar la siguiente plancha. Con oxicombustible esto es lento. Un sistema de plasma con antorcha larga corta el esqueleto mas rapidamente.",
    beveling: "El biselado con oxicombustible es lento, requiere precalentamiento y deja bordes rugosos. El plasma bisela a mayor velocidad, sin precalentamiento, y elimina el costo del gas.",
    marking: "El punzonado manual es lento y causa lesiones ergonomicas. El marcado plasma es 8-10 veces mas rapido y produce una marca permanente que sobrevive al granallado y la pintura.",
    gouging: "El gouging con arco de carbon requiere varillas costosas, genera ruido y particulas de carbono. El gouging plasma es mas rapido, silencioso y limpio.",
    tempAttach: "La remocion de fijaciones temporales con oxicombustible deja material significativo que debe esmerilarse. La tecnologia FlushCut de plasma permite cortar paralelo al metal base.",
  },
  pt: {
    burnRate: "O plasma corta aco a velocidades significativamente maiores que o oxicombustivel porque nao requer pre-aquecimento. A temperatura do arco atinge 20.000 graus C, muito acima dos 3.500 graus C do oxicombustivel.",
    noPreheat: "Cada corte com oxicombustivel requer de 10 a 30 segundos de pre-aquecimento. O plasma perfura instantaneamente. Essa economia se acumula com cada partida de macario em toda sua forca de trabalho durante o ano.",
    training: "Os sistemas de oxicombustivel requerem treinamento extenso em seguranca devido ao uso de gases combustiveis. Os sistemas de plasma eliminam esses riscos e a carga de treinamento associada.",
    setup: "Os macaricos de oxicombustivel precisam ser reconfigurados quando ficam inativos por mais de 15 minutos. Os sistemas de plasma requerem configuracoes significativamente menos frequentes e mais rapidas.",
    grinding: "O oxicombustivel produz uma zona afetada pelo calor que oxida e endurece a borda cortada, exigindo esmerilamento extenso antes de soldar. O plasma produz uma borda mais limpa que requer muito menos esmerilamento.",
    skeleton: "Apos o corte CNC, o esqueleto de aco restante deve ser removido antes de carregar a proxima chapa. Com oxicombustivel isso e lento. Um sistema de plasma com tocha longa corta o esqueleto mais rapidamente.",
    beveling: "O chanframento com oxicombustivel e lento, requer pre-aquecimento e deixa bordas asperas. O plasma chanfra em maior velocidade, sem pre-aquecimento, e elimina o custo do gas.",
    marking: "O puncionamento manual e lento e causa lesoes ergonomicas. A marcacao a plasma e 8-10 vezes mais rapida e produz uma marca permanente que sobrevive ao jateamento e pintura.",
    gouging: "A goivagem com arco de carbono requer varetas caras, gera ruido e particulas de carbono. A goivagem a plasma e mais rapida, silenciosa e limpa.",
    tempAttach: "A remocao de fixacoes temporarias com oxicombustivel deixa material significativo que deve ser esmerilado. A tecnologia FlushCut de plasma permite cortar paralelo ao metal base.",
  },
};

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtNum = (n) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

function getBreakdownText(appId, data, result, unit, lang) {
  const d = data;
  const isM = unit === "metric";
  const sp = isM ? "mm/min" : "ipm";
  const lu = isM ? "m" : "in";

  const lines = {
    burnRate: [
      { label: "Employees x daily cut x operating days", value: fmtNum(d.employees) + " x " + d.dailyCut + " " + lu + " x " + d.opDays + " days = " + fmtNum(d.employees * d.dailyCut * d.opDays) + " " + lu + "/yr" },
      { label: "Active cutting at " + d.torchUse + "% torch use", value: fmtNum(d.employees * d.dailyCut * d.opDays * d.torchUse / 100) + " " + lu + "/yr" },
      { label: "Plasma cut speed vs oxyfuel", value: d.plasmaSpeed + " " + sp + " vs " + d.torchSpeed + " " + sp },
      { label: "Time saved x labor rate", value: fmtNum(result.timeSavings) + " hrs x $" + d.laborRate + "/hr = " + fmtCurrency(result.savings) },
    ],
    noPreheat: [
      { label: "Torch starts per year", value: fmtNum(d.plasmaStarts * d.opDays * d.employees) + " starts/yr" },
      { label: "Preheat time eliminated", value: d.preheatTime + " sec/start" },
      { label: "Total time saved", value: fmtNum(result.timeSavings) + " hrs/yr x $" + d.laborRate + "/hr = " + fmtCurrency(result.savings) },
    ],
    training: [
      { label: "Operators trained per year", value: fmtNum(d.trainEmployees * d.trainWeeks) + " operators" },
      { label: "Oxyfuel vs plasma training", value: d.oxyTraining + " hrs vs " + d.plasmaTraining + " hrs per operator" },
      { label: "Total hours saved", value: fmtNum(result.timeSavings) + " hrs x $" + d.laborRate + "/hr = " + fmtCurrency(result.savings) },
    ],
    setup: [
      { label: "Oxyfuel setups per year", value: fmtNum(d.torchSetups * d.numShifts * d.opDays * d.employees * d.oxySetup / 60) + " hrs/yr" },
      { label: "Plasma setups per year", value: fmtNum(d.plasmaSetups * d.numShifts * d.opDays * d.employees * d.plasmaSetup / 60) + " hrs/yr" },
      { label: "Time saved x labor rate", value: fmtNum(result.timeSavings) + " hrs x $" + d.laborRate + "/hr = " + fmtCurrency(result.savings) },
    ],
    grinding: [
      { label: "Current oxyfuel grinding", value: fmtNum(d.grindEmployees * d.dailyGrind * d.opDays) + " hrs/yr" },
      { label: "Plasma grinding at " + d.plasmaGrindPct + "% of oxyfuel", value: fmtNum(d.grindEmployees * d.dailyGrind * d.opDays * d.plasmaGrindPct / 100) + " hrs/yr" },
      { label: "Time saved x labor rate", value: fmtNum(result.timeSavings) + " hrs x $" + d.laborRate + "/hr = " + fmtCurrency(result.savings) },
    ],
    skeleton: [
      { label: "Current skeleton removal time", value: fmtNum(d.skelEmployees * d.skelHours * d.skelShifts * d.opDays) + " hrs/yr" },
      { label: "Plasma long torch 50% faster", value: fmtNum(result.timeSavings) + " hrs saved/yr" },
      { label: "Time saved x labor rate", value: fmtNum(result.timeSavings) + " hrs x $" + d.laborRate + "/hr = " + fmtCurrency(result.savings) },
    ],
    beveling: [
      { label: "Bevel stations x hours x days", value: d.bevelStations + " x " + d.bevelHours + " hrs x " + d.opDays + " days" },
      { label: "Plasma vs oxyfuel speed", value: d.bevelPlasmaSpeed + " " + sp + " vs " + d.bevelOxySpeed + " " + sp },
      { label: "Gas cost eliminated", value: "$" + d.gasCost + "/hr replaced by $" + d.elecCost + "/hr electricity" },
      { label: "Total labor + operating savings", value: fmtCurrency(result.savings) + "/yr" },
    ],
    marking: [
      { label: "Total marking length per year", value: fmtNum(d.markEmployees * d.dailyMark * d.opDays) + " " + lu + "/yr" },
      { label: "Plasma vs hand punching speed", value: d.plasmaMarkSpeed + " " + sp + " vs " + d.punchSpeed + " " + sp },
      { label: "Time saved x labor rate", value: fmtNum(result.timeSavings) + " hrs x $" + d.laborRate + "/hr = " + fmtCurrency(result.savings) },
    ],
    gouging: [
      { label: "Total gouging length per year", value: fmtNum(d.gougEmployees * d.gougLength * d.opDays) + " " + (isM ? "m" : "ft") + "/yr" },
      { label: "Plasma vs CAG speed", value: d.plasmaGougSpeed + " " + sp + " vs " + d.cagSpeed + " " + sp },
      { label: "Grinding reduction", value: d.grindAfterPlasma + " min vs " + d.grindAfterCAG + " min per 30m" },
      { label: "Total cost reduction", value: fmtCurrency(result.savings) + "/yr" },
    ],
    tempAttach: [
      { label: "Total cut length per year", value: fmtNum(d.employees * d.dailyCutLength * d.opDays) + " " + lu + "/yr" },
      { label: "FlushCut rate vs current method", value: d.flushCutRate + " " + sp + " vs " + d.altRate + " " + sp },
      { label: "Grinding reduction", value: d.grindPctPlasma + "% of current grinding time" },
      { label: "Time saved x labor rate", value: fmtNum(result.timeSavings) + " hrs x $" + d.laborRate + "/hr = " + fmtCurrency(result.savings) },
    ],
  };

  return lines[appId] || [];
}

export function generatePDF({ apps, calcData, unit, lang, userInfo }) {
  const defaults = INDUSTRY_DEFAULTS[unit];
  const names = APP_NAMES[lang] || APP_NAMES.en;
  const why = APP_WHY[lang] || APP_WHY.en;

  const results = apps.map((appId) => {
    const data = { ...(defaults[appId] || {}), ...(calcData[appId] || {}) };
    let result = { timeSavings: 0, savings: 0 };
    try { result = APP_CALC_MAP[appId](data, unit); } catch (e) {}
    const breakdown = getBreakdownText(appId, data, result, unit, lang);
    return { appId, data, result, breakdown, ...result };
  });

  const totalSavings = results.reduce((s, r) => s + (r.savings || 0), 0);
  const totalTime = results.reduce((s, r) => s + (r.timeSavings || 0), 0);
  const topResult = [...results].sort((a, b) => b.savings - a.savings)[0];
  const date = new Date().toLocaleDateString(
    lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8"/>
<title>Ignite Report — ${userInfo.company || "Shipyard"}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a2e; font-size: 13px; line-height: 1.6; }
  .page { max-width: 820px; margin: 0 auto; padding: 48px; }

  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 3px solid #0a1929; margin-bottom: 32px; }
  .brand-name { font-size: 26px; font-weight: 800; color: #00bcd4; letter-spacing: 3px; text-transform: uppercase; }
  .brand-tag { font-size: 11px; color: #999; margin-top: 2px; }
  .header-meta { text-align: right; font-size: 12px; color: #666; line-height: 1.8; }
  .header-meta strong { color: #1a1a2e; font-size: 15px; display: block; }

  .hero { background: #0a1929; color: #fff; border-radius: 14px; padding: 36px; margin-bottom: 32px; text-align: center; }
  .hero-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; color: #00bcd4; text-transform: uppercase; margin-bottom: 8px; }
  .hero-amount { font-size: 72px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 6px; }
  .hero-period { font-size: 16px; color: #90a4ae; margin-bottom: 24px; }
  .hero-stats { display: flex; justify-content: center; gap: 48px; }
  .hero-stat { text-align: center; }
  .hero-stat-val { font-size: 28px; font-weight: 800; color: #00bcd4; display: block; }
  .hero-stat-label { font-size: 11px; color: #90a4ae; margin-top: 2px; }

  .methodology { background: #f0f9ff; border: 1px solid #b3e0f7; border-left: 4px solid #00bcd4; border-radius: 0 10px 10px 0; padding: 18px 22px; margin-bottom: 28px; }
  .methodology h3 { font-size: 12px; font-weight: 700; color: #006064; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .methodology p { font-size: 12px; color: #37474f; line-height: 1.7; margin-bottom: 6px; }
  .methodology p:last-child { margin-bottom: 0; }

  .section-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #00bcd4; text-transform: uppercase; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e8f4f8; margin-top: 32px; }

  .summary-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  .summary-table thead tr { background: #0a1929; }
  .summary-table thead th { color: #fff; padding: 10px 14px; font-size: 11px; font-weight: 700; text-align: left; }
  .summary-table thead th:not(:first-child) { text-align: right; }
  .summary-table tbody tr { border-bottom: 1px solid #f0f0f0; }
  .summary-table tbody tr:hover { background: #f8fdfd; }
  .summary-table tbody td { padding: 10px 14px; }
  .summary-table tbody td:not(:first-child) { text-align: right; }
  .summary-table tfoot tr { background: #f8fdfd; border-top: 2px solid #0a1929; }
  .summary-table tfoot td { padding: 12px 14px; font-weight: 800; font-size: 14px; }
  .summary-table tfoot td:not(:first-child) { text-align: right; }
  .savings-val { color: #00838f; font-weight: 700; }
  .total-savings { color: #006064; font-size: 16px; font-weight: 800; }
  .pct-bar { display: inline-block; width: 60px; height: 5px; background: #e8f4f8; border-radius: 100px; vertical-align: middle; margin-left: 6px; overflow: hidden; }
  .pct-fill { height: 100%; background: linear-gradient(90deg, #00bcd4, #ff9800); border-radius: 100px; }

  .app-section { margin-bottom: 28px; border: 1px solid #e8f0fe; border-radius: 12px; overflow: hidden; page-break-inside: avoid; }
  .app-header { background: #0a1929; padding: 14px 20px; display: flex; align-items: center; gap: 12px; }
  .app-icon { font-size: 20px; }
  .app-name { font-size: 15px; font-weight: 700; color: #fff; }
  .app-saving { margin-left: auto; font-size: 18px; font-weight: 800; color: #00bcd4; }
  .app-body { padding: 18px 20px; }
  .app-why { font-size: 12px; color: #455a64; line-height: 1.7; margin-bottom: 14px; padding: 12px 16px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #00bcd4; }
  .app-breakdown { width: 100%; border-collapse: collapse; }
  .app-breakdown tr { border-bottom: 1px solid #f0f0f0; }
  .app-breakdown tr:last-child { border-bottom: none; font-weight: 700; background: #f0f9ff; }
  .app-breakdown td { padding: 7px 10px; font-size: 12px; color: #455a64; }
  .app-breakdown td:last-child { text-align: right; color: #006064; font-weight: 600; }
  .app-time { font-size: 12px; color: #90a4ae; margin-top: 8px; }

  .additional { background: #fff8e1; border: 1px solid #ffe082; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
  .additional h3 { font-size: 12px; font-weight: 700; color: #f57f17; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .additional-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .additional-item { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #5d4037; line-height: 1.5; }
  .additional-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff9800; flex-shrink: 0; margin-top: 4px; }

  .top-opp { background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 10px; padding: 16px 20px; margin-bottom: 28px; display: flex; gap: 14px; align-items: flex-start; }
  .top-opp-label { font-size: 10px; font-weight: 700; color: #2e7d32; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .top-opp-text { font-size: 14px; font-weight: 600; color: #1a1a2e; }

  .credibility { border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
  .credibility h3 { font-size: 12px; font-weight: 700; color: #0a1929; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .credibility p { font-size: 12px; color: #455a64; line-height: 1.7; margin-bottom: 8px; }

  .cta { background: #0a1929; color: #fff; border-radius: 12px; padding: 24px 28px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
  .cta-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .cta-sub { font-size: 12px; color: #90a4ae; }
  .cta-links { text-align: right; font-size: 12px; line-height: 2; }
  .cta-links a { color: #00bcd4; text-decoration: none; display: block; }

  .footer { padding-top: 20px; border-top: 2px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
  .footer-brand { font-size: 14px; font-weight: 800; color: #00bcd4; letter-spacing: 2px; }
  .footer-sub { font-size: 10px; color: #999; margin-top: 2px; }
  .disclaimer { font-size: 10px; color: #bbb; line-height: 1.6; margin-top: 16px; }

  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .page { padding: 24px; }
    .app-section { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div>
      <div class="brand-name">⚡ Ignite</div>
      <div class="brand-tag">Cut costs. Not corners. — Part of the Industrial Cutting Processes ecosystem</div>
    </div>
    <div class="header-meta">
      <strong>${userInfo.name || "Shipyard Report"}</strong>
      ${userInfo.company || ""}
      <br/>${date}
    </div>
  </div>

  <div class="hero">
    <div class="hero-label">${lang === "en" ? "Total Estimated Annual Savings" : lang === "es" ? "Ahorros Anuales Estimados Totales" : "Economias Anuais Estimadas Totais"}</div>
    <div class="hero-amount">${fmtCurrency(totalSavings)}</div>
    <div class="hero-period">${lang === "en" ? "per year" : lang === "es" ? "por ano" : "por ano"}</div>
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="hero-stat-val">${fmtNum(totalTime)}</span>
        <span class="hero-stat-label">${lang === "en" ? "hours saved/yr" : lang === "es" ? "horas ahorradas/ano" : "horas economizadas/ano"}</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-val">~${Math.max(1, Math.round(totalTime / 1800))}</span>
        <span class="hero-stat-label">${lang === "en" ? "equivalent FTEs freed" : lang === "es" ? "FTEs equivalentes liberados" : "FTEs equivalentes liberados"}</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-val">${apps.length}</span>
        <span class="hero-stat-label">${lang === "en" ? "applications analyzed" : lang === "es" ? "aplicaciones analizadas" : "aplicacoes analisadas"}</span>
      </div>
    </div>
  </div>

  <div class="methodology">
    <h3>${lang === "en" ? "About this report & methodology" : lang === "es" ? "Sobre este informe y metodologia" : "Sobre este relatorio e metodologia"}</h3>
    <p>${lang === "en"
      ? "This report was generated using Ignite — a plasma cutting savings calculator built on industry benchmarks validated across shipyards worldwide. All cut speeds are based on published cut charts for 12mm (1/2\") mild steel, the most common thickness in shipbuilding applications."
      : lang === "es"
      ? "Este informe fue generado usando Ignite, una calculadora de ahorros en corte plasma construida sobre referencias de la industria validadas en astilleros de todo el mundo. Todas las velocidades de corte se basan en tablas de corte publicadas para acero dulce de 12mm."
      : "Este relatorio foi gerado usando o Ignite, uma calculadora de economias em corte a plasma construida sobre benchmarks do setor validados em estaleiros em todo o mundo. Todas as velocidades de corte sao baseadas em tabelas de corte publicadas para aco doce de 12mm."}</p>
    <p>${lang === "en"
      ? "Labor savings are calculated using your provided hourly rate and operational data. Where custom data was not provided, industry averages from direct observation at leading global shipyards were used. Actual savings will vary based on material thickness, operator skill, and operational conditions."
      : lang === "es"
      ? "Los ahorros de mano de obra se calculan usando la tarifa horaria y los datos operativos proporcionados. Donde no se proporcionaron datos personalizados, se utilizaron promedios de la industria de observaciones directas en astilleros lideres mundiales."
      : "As economias de mao de obra sao calculadas usando sua taxa horaria e dados operacionais fornecidos. Onde dados personalizados nao foram fornecidos, foram usadas medias do setor de observacoes diretas em estaleiros lideres mundiais."}</p>
  </div>

  ${topResult ? `
  <div class="top-opp">
    <div style="font-size:24px">💡</div>
    <div>
      <div class="top-opp-label">${lang === "en" ? "Biggest opportunity" : lang === "es" ? "Mayor oportunidad" : "Maior oportunidade"}</div>
      <div class="top-opp-text">${names[topResult.appId]} — ${fmtCurrency(topResult.savings)} ${lang === "en" ? "in potential annual savings" : lang === "es" ? "en ahorros anuales potenciales" : "em economias anuais potenciais"} (${fmtNum(topResult.timeSavings)} ${lang === "en" ? "hrs/yr" : "hrs/ano"})</div>
    </div>
  </div>
  ` : ""}

  <div class="section-title">${lang === "en" ? "Summary by application" : lang === "es" ? "Resumen por aplicacion" : "Resumo por aplicacao"}</div>
  <table class="summary-table">
    <thead>
      <tr>
        <th>${lang === "en" ? "Application" : lang === "es" ? "Aplicacion" : "Aplicacao"}</th>
        <th>${lang === "en" ? "Annual Savings" : lang === "es" ? "Ahorros Anuales" : "Economias Anuais"}</th>
        <th>${lang === "en" ? "Time Saved" : lang === "es" ? "Tiempo Ahorrado" : "Tempo Economizado"}</th>
        <th>${lang === "en" ? "Share" : lang === "es" ? "Participacion" : "Participacao"}</th>
      </tr>
    </thead>
    <tbody>
      ${results.map(({ appId, savings, timeSavings }) => {
        const pct = totalSavings > 0 ? (savings / totalSavings * 100) : 0;
        return `<tr>
          <td>${APP_ICONS[appId]} ${names[appId]}</td>
          <td class="savings-val">${fmtCurrency(savings)}</td>
          <td>${fmtNum(timeSavings)} hrs</td>
          <td>${pct.toFixed(0)}% <span class="pct-bar"><span class="pct-fill" style="width:${Math.min(100,pct)}%"></span></span></td>
        </tr>`;
      }).join("")}
    </tbody>
    <tfoot>
      <tr>
        <td>${lang === "en" ? "Total" : "Total"}</td>
        <td class="total-savings">${fmtCurrency(totalSavings)}</td>
        <td>${fmtNum(totalTime)} hrs</td>
        <td>100%</td>
      </tr>
    </tfoot>
  </table>

  <div class="section-title">${lang === "en" ? "Detailed breakdown by application" : lang === "es" ? "Desglose detallado por aplicacion" : "Detalhamento por aplicacao"}</div>

  ${results.map(({ appId, savings, timeSavings, data, result, breakdown }) => `
  <div class="app-section">
    <div class="app-header">
      <span class="app-icon">${APP_ICONS[appId]}</span>
      <span class="app-name">${names[appId]}</span>
      <span class="app-saving">${fmtCurrency(savings)}/yr</span>
    </div>
    <div class="app-body">
      <div class="app-why">${why[appId] || ""}</div>
      <table class="app-breakdown">
        ${breakdown.map((row, i) => `
        <tr>
          <td>${row.label}</td>
          <td>${row.value}</td>
        </tr>`).join("")}
      </table>
      <div class="app-time">${lang === "en" ? "Time saved:" : lang === "es" ? "Tiempo ahorrado:" : "Tempo economizado:"} ${fmtNum(timeSavings)} hrs/yr — ${lang === "en" ? "equivalent to" : lang === "es" ? "equivalente a" : "equivalente a"} ~${Math.max(1, Math.round(timeSavings / 1800))} FTE</div>
    </div>
  </div>
  `).join("")}

${(() => {
    const additionalItems = {
      en: [
        { text: "Reduced scrap rates from cleaner cuts and smaller heat-affected zones", alwaysShow: true },
        { text: "Fewer workplace injuries — reduced grinding and elimination of combustible gases", alwaysShow: true },
        { text: "Improved weld quality — smaller HAZ and cleaner edges reduce weld defects and rework", alwaysShow: true },
        { text: "Temporary attachment reuse — plasma FlushCut allows lugs to be reused up to 10 times", hideIf: "tempAttach" },
        { text: "Reduced fire watcher costs — oxyfuel requires dedicated fire watchers in confined spaces", hideIf: "burnRate" },
        { text: "Lower consumable gas costs — plasma eliminates acetylene and oxygen cylinder expenses", hideIf: "beveling" },
        { text: "Increased CNC table utilization — faster skeleton removal means less table downtime", hideIf: "skeleton" },
        { text: "Operator ergonomics and retention — less grinding and combustible gas exposure improves working conditions", hideIf: "grinding" },
      ],
      es: [
        { text: "Reduccion de tasas de desperdicio por cortes mas limpios y menor zona afectada por calor", alwaysShow: true },
        { text: "Menos lesiones laborales — reduccion del esmerilado y eliminacion de gases combustibles", alwaysShow: true },
        { text: "Mejor calidad de soldadura — menor zona afectada por calor reduce defectos y retrabajos", alwaysShow: true },
        { text: "Reutilizacion de fijaciones temporales — FlushCut permite reutilizar lugs hasta 10 veces", hideIf: "tempAttach" },
        { text: "Reduccion de costos de vigilancia de incendios requerida por oxicombustible", hideIf: "burnRate" },
        { text: "Menores costos de gas consumible — el plasma elimina los gastos de cilindros de acetileno y oxigeno", hideIf: "beveling" },
        { text: "Mayor utilizacion de la mesa CNC — remocion rapida de esqueleto significa menos tiempo de inactividad", hideIf: "skeleton" },
        { text: "Ergonomia y retencion de operadores — menos esmerilado y exposicion a gases mejora las condiciones", hideIf: "grinding" },
      ],
      pt: [
        { text: "Reducao de taxas de refugo por cortes mais limpos e menor zona afetada pelo calor", alwaysShow: true },
        { text: "Menos lesoes no trabalho — reducao do esmerilamento e eliminacao de gases combustiveis", alwaysShow: true },
        { text: "Melhor qualidade de solda — menor zona afetada pelo calor reduz defeitos e retrabalho", alwaysShow: true },
        { text: "Reutilizacao de fixacoes temporarias — FlushCut permite reutilizar olhais ate 10 vezes", hideIf: "tempAttach" },
        { text: "Reducao de custos de vigilancia de incendio exigida pelo oxicombustivel", hideIf: "burnRate" },
        { text: "Menores custos de gas consumivel — o plasma elimina as despesas de cilindros de acetileno e oxigenio", hideIf: "beveling" },
        { text: "Maior utilizacao da mesa CNC — remocao rapida de esqueleto significa menos tempo de inatividade", hideIf: "skeleton" },
        { text: "Ergonomia e retencao de operadores — menos esmerilamento e exposicao a gases melhora as condicoes", hideIf: "grinding" },
      ],
    };

    const items = additionalItems[lang] || additionalItems.en;
    const filtered = items.filter(item => item.alwaysShow || !apps.includes(item.hideIf));

    if (filtered.length === 0) return "";

    return `
    <div class="additional">
      <h3>${lang === "en" ? "Additional savings not included in this report" : lang === "es" ? "Ahorros adicionales no incluidos en este informe" : "Economias adicionais nao incluidas neste relatorio"}</h3>
      <p style="font-size:11px;color:#b8860b;margin-bottom:12px">${lang === "en" ? "These benefits apply to your operation but are not quantified in the calculations above." : lang === "es" ? "Estos beneficios aplican a su operacion pero no estan cuantificados en los calculos anteriores." : "Esses beneficios se aplicam a sua operacao mas nao estao quantificados nos calculos acima."}</p>
      <div class="additional-grid">
        ${filtered.map(item => `
        <div class="additional-item">
          <div class="additional-dot"></div>
          <span>${item.text}</span>
        </div>`).join("")}
      </div>
    </div>`;
  })()}

  <div class="credibility">
    <h3>${lang === "en" ? "About this analysis" : lang === "es" ? "Sobre este analisis" : "Sobre esta analise"}</h3>
    <p>${lang === "en"
      ? "This report is part of the Industrial Cutting Processes ecosystem — a platform covering applications, trade-offs, and decision-making factors across plasma, laser, waterjet, and related cutting technologies. The ecosystem is built on direct observation and collaboration with industry-leading shipyards across the Americas, Europe, and Asia-Pacific."
      : lang === "es"
      ? "Este informe es parte del ecosistema Industrial Cutting Processes, una plataforma que cubre aplicaciones, compensaciones y factores de decision en plasma, laser, chorro de agua y tecnologias de corte relacionadas."
      : "Este relatorio faz parte do ecossistema Industrial Cutting Processes, uma plataforma que cobre aplicacoes, trade-offs e fatores de decisao em plasma, laser, jato de agua e tecnologias de corte relacionadas."}</p>
    <p>${lang === "en"
      ? "Savings projections are based on industry-standard benchmarks, validated cut speed data, and operational observations from shipyards of comparable size and complexity. These figures represent conservative estimates — many shipyards report savings significantly above these projections upon full implementation."
      : lang === "es"
      ? "Las proyecciones de ahorro se basan en referencias estandar de la industria, datos de velocidad de corte validados y observaciones operativas de astilleros de tamano y complejidad comparables."
      : "As projecoes de economia sao baseadas em benchmarks padrao do setor, dados de velocidade de corte validados e observacoes operacionais de estaleiros de tamanho e complexidade comparaveis."}</p>
  </div>

  <div class="cta">
    <div>
      <div class="cta-title">${lang === "en" ? "Ready to implement these savings?" : lang === "es" ? "Listo para implementar estos ahorros?" : "Pronto para implementar essas economias?"}</div>
      <div class="cta-sub">${lang === "en" ? "Let's talk about your specific operation and how plasma cutting can be implemented in your yard." : lang === "es" ? "Hablemos sobre su operacion especifica y como implementar el corte plasma en su astillero." : "Vamos conversar sobre sua operacao especifica e como implementar o corte a plasma no seu estaleiro."}</div>
    </div>
    <div class="cta-links">
      <a href="https://www.linkedin.com/in/guivrossi/">💬 linkedin.com/in/guivrossi</a>
      <a href="https://www.linkedin.com/newsletters/industrial-cutting-processes-7419724116267520000/">📰 Industrial Cutting Processes</a>
    </div>
  </div>

  <div class="footer">
    <div>
      <div class="footer-brand">⚡ IGNITE</div>
      <div class="footer-sub">Cut costs. Not corners. — Industrial Cutting Processes ecosystem</div>
    </div>
    <div style="font-size:11px;color:#999;text-align:right">${date}</div>
  </div>

  <div class="disclaimer">${lang === "en"
    ? "* Savings estimates are based on industry averages and provided operational data. Actual results may vary based on material thickness, operator skill level, and specific operational conditions. Projections are based on 12mm (1/2\") mild steel thickness unless otherwise specified. This report is intended as a decision-support tool and should be validated with on-site data collection."
    : lang === "es"
    ? "* Las estimaciones de ahorro se basan en promedios de la industria y datos operativos proporcionados. Los resultados reales pueden variar. Este informe esta destinado a ser una herramienta de apoyo a la decision."
    : "* As estimativas de economia sao baseadas nas medias do setor e dados operacionais fornecidos. Os resultados reais podem variar. Este relatorio destina-se a ser uma ferramenta de apoio a decisao."}</div>

</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);s
    setTimeout(() => win.print(), 800);
  } else {
    alert(lang === "en" ? "Please allow popups for this site to generate your PDF report." : lang === "es" ? "Por favor permite las ventanas emergentes para generar tu informe PDF." : "Por favor permita popups para gerar seu relatorio PDF.");
  }
}