import { useLanguage, useUnit } from "../lib/contexts";
import t from "../lib/translations";
import Footer from "./Footer";

const getApps = (lang) => [
  {
    id: "burnRate", icon: "🔥",
    who: lang === "en" ? "Operators · Supervisors" : lang === "es" ? "Operadores · Supervisores" : "Operadores · Supervisores",
    tip: lang === "en"
      ? "Do your workers use oxyfuel torches to cut steel plates? Plasma cuts the same material in roughly half the time — no preheating needed. If you have burners cutting steel daily, this applies to you."
      : lang === "es"
      ? "Sus trabajadores usan antorchas de oxicombustible para cortar planchas de acero? El plasma corta el mismo material en aproximadamente la mitad del tiempo, sin necesidad de precalentamiento."
      : "Seus trabalhadores usam macaricos de oxicombustivel para cortar chapas de aco? O plasma corta o mesmo material em aproximadamente metade do tempo, sem necessidade de pre-aquecimento.",
  },
  {
    id: "marking", icon: "✏️",
    who: lang === "en" ? "Operators · QC" : lang === "es" ? "Operadores · Control de Calidad" : "Operadores · Controle de Qualidade",
    tip: lang === "en"
      ? "Do workers manually punch cut lines, part numbers, or weld guides onto steel? Plasma marking replaces hand punching — it is 10x faster and leaves a permanent mark that survives shot blasting and painting."
      : lang === "es"
      ? "Los trabajadores punzonan manualmente lineas de corte o guias de soldadura en el acero? El marcado plasma reemplaza el punzonado manual, es 10 veces mas rapido y deja una marca permanente."
      : "Os trabalhadores puncionam manualmente linhas de corte ou guias de solda no aco? A marcacao a plasma substitui o puncionamento manual, e 10 vezes mais rapida e deixa uma marca permanente.",
  },
  {
    id: "noPreheat", icon: "🌡️",
    who: lang === "en" ? "Operators · Supervisors" : lang === "es" ? "Operadores · Supervisores" : "Operadores · Supervisores",
    tip: lang === "en"
      ? "Oxyfuel torches must preheat the steel for 10-30 seconds before every cut. Plasma starts instantly. If your operators light up torches many times a day, those warm-up seconds add up to real hours."
      : lang === "es"
      ? "Las antorchas de oxicombustible deben precalentar el acero durante 10-30 segundos antes de cada corte. El plasma arranca instantaneamente. Esos segundos de calentamiento suman horas reales al ano."
      : "Os macaricos de oxicombustivel precisam pre-aquecer o aco por 10-30 segundos antes de cada corte. O plasma inicia instantaneamente. Esses segundos de aquecimento somam horas reais por ano.",
  },
  {
    id: "gouging", icon: "⚡",
    who: lang === "en" ? "Welders · Supervisors" : lang === "es" ? "Soldadores · Supervisores" : "Soldadores · Supervisores",
    tip: lang === "en"
      ? "Do your welders use carbon arc gouging rods to remove bad welds or prepare joints? Plasma gouging does the same job with less noise, less grinding, and no fine carbon dust in the air."
      : lang === "es"
      ? "Sus soldadores usan varillas de gouging con arco de carbon para remover soldaduras o preparar juntas? El plasma gouging hace el mismo trabajo con menos ruido y menos esmerilado."
      : "Seus soldadores usam varetas de goivagem com arco de carbono para remover soldas ou preparar juntas? A goivagem a plasma faz o mesmo trabalho com menos ruido e menos esmerilamento.",
  },
  {
    id: "beveling", icon: "📐",
    who: lang === "en" ? "Operators · Planners" : lang === "es" ? "Operadores · Planificadores" : "Operadores · Planejadores",
    tip: lang === "en"
      ? "After parts are cut on the CNC table, do workers add a bevel edge with an oxyfuel carriage before welding? Plasma is up to 4x faster for that bevel pass and needs far less grinding to clean up the edge."
      : lang === "es"
      ? "Despues de cortar piezas en la mesa CNC, los trabajadores agregan un bisel con un carro de oxicombustible antes de soldar? El plasma es hasta 4 veces mas rapido para ese pase de biselado."
      : "Apos cortar pecas na mesa CNC, os trabalhadores adicionam um chanfro com um carro de oxicombustivel antes de soldar? O plasma e ate 4 vezes mais rapido para esse passe de chanframento.",
  },
  {
    id: "setup", icon: "⚙️",
    who: lang === "en" ? "Operators · Supervisors" : lang === "es" ? "Operadores · Supervisores" : "Operadores · Supervisores",
    tip: lang === "en"
      ? "Every time an oxyfuel torch sits idle for more than 15 minutes it must be re-setup. Plasma setups are quicker. If your team does multiple setups per shift, the time savings compound fast."
      : lang === "es"
      ? "Cada vez que una antorcha de oxicombustible esta inactiva mas de 15 minutos, debe reconfigurarse. Las configuraciones de plasma son mas rapidas y los ahorros se acumulan rapidamente."
      : "Cada vez que um macario de oxicombustivel fica inativo por mais de 15 minutos, precisa ser reconfigurado. As configuracoes de plasma sao mais rapidas e as economias se acumulam rapidamente.",
  },
  {
    id: "training", icon: "🎓",
    who: lang === "en" ? "HR · Safety · Managers" : lang === "es" ? "RR.HH. · Seguridad · Gerentes" : "RH · Seguranca · Gerentes",
    tip: lang === "en"
      ? "Training a new oxyfuel operator takes about 40 hours. Plasma takes roughly 6 hours. If you hire and train operators regularly or have high turnover, this directly reduces your training cost."
      : lang === "es"
      ? "Capacitar a un nuevo operador de oxicombustible toma unas 40 horas. El plasma toma aproximadamente 6 horas. Si contrata operadores regularmente, esto reduce directamente su costo de capacitacion."
      : "Treinar um novo operador de oxicombustivel leva cerca de 40 horas. O plasma leva aproximadamente 6 horas. Se voce contrata operadores regularmente, isso reduz diretamente seu custo de treinamento.",
  },
  {
    id: "grinding", icon: "🔩",
    who: lang === "en" ? "Operators · Welders" : lang === "es" ? "Operadores · Soldadores" : "Operadores · Soldadores",
    tip: lang === "en"
      ? "Oxyfuel cuts leave rough edges that need significant grinding before welding. Plasma cuts are cleaner — workers typically grind only 20% of what they would after oxyfuel. Count your grinders to see if this applies."
      : lang === "es"
      ? "Los cortes de oxicombustible dejan bordes rugosos que necesitan esmerilado significativo antes de soldar. Los cortes de plasma son mas limpios, los trabajadores esmerilan solo el 20% de lo que harian con oxicombustible."
      : "Os cortes de oxicombustivel deixam bordas asperas que precisam de esmerilamento significativo antes de soldar. Os cortes de plasma sao mais limpos, os trabalhadores esmerilam apenas 20% do que fariam com oxicombustivel.",
  },
  {
    id: "skeleton", icon: "🏗️",
    who: lang === "en" ? "Operators · Production" : lang === "es" ? "Operadores · Produccion" : "Operadores · Producao",
    tip: lang === "en"
      ? "After your CNC table finishes cutting parts, the leftover steel frame must be cut apart and removed before the next sheet loads. A long plasma torch makes this faster and keeps the table running."
      : lang === "es"
      ? "Despues de que la mesa CNC termina de cortar piezas, el marco de acero sobrante debe cortarse y retirarse antes de cargar la siguiente plancha. Una antorcha larga de plasma hace esto mas rapido."
      : "Apos a mesa CNC terminar de cortar pecas, a estrutura de aco restante deve ser cortada e removida antes de carregar a proxima chapa. Uma tocha longa de plasma torna isso mais rapido.",
  },
  {
    id: "tempAttach", icon: "🔗",
    who: lang === "en" ? "Welders · Operators" : lang === "es" ? "Soldadores · Operadores" : "Soldadores · Operadores",
    tip: lang === "en"
      ? "Do workers weld temporary lifting eyes, lugs, or brackets onto hull sections then cut them off later? Plasma with a flush-cut tip removes them cleanly with far less grinding — and the lug can often be reused."
      : lang === "es"
      ? "Los trabajadores sueldan ojos de izaje temporales o soportes en secciones del casco y luego los cortan? El plasma con punta de corte al ras los retira limpiamente con mucho menos esmerilado."
      : "Os trabalhadores soldam olhais de elevacao temporarios ou suportes em secoes do casco e depois os cortam? O plasma com ponta de corte rente os remove de forma limpa com muito menos esmerilamento.",
  },
];

export default function ApplicationSelector({ selected, setSelected, onNext, onBack }) {
  const { lang, setLang } = useLanguage();
  const { unit, setUnit } = useUnit();
  const tr = t[lang];
  const apps = getApps(lang);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="page-wrapper">
      <nav className="nav">
        <div className="nav-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">Ignite</span>
        </div>
        <div className="nav-controls">
          <div className="lang-select">
            {["en", "es", "pt"].map((l) => (
              <button key={l} className={"lang-btn " + (lang === l ? "active" : "")} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="unit-toggle">
            <button className={"unit-btn " + (unit === "metric" ? "active" : "")} onClick={() => setUnit("metric")}>{tr.metric}</button>
            <button className={"unit-btn " + (unit === "imperial" ? "active" : "")} onClick={() => setUnit("imperial")}>{tr.imperial}</button>
          </div>
          <a href="/" style={{ fontSize: 10, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, marginLeft: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
            ← ICL
          </a>
        </div>
      </nav>

      <div className="page-content">
        <div className="step-indicator">
          <div className="step active">1</div>
          <div className="step-line"></div>
          <div className="step">2</div>
          <div className="step-line"></div>
          <div className="step">3</div>
        </div>

        <h2 className="page-title">{tr.selectTitle}</h2>
        <p className="page-sub">{tr.selectSub}</p>

        <div className="select-actions">
          <button className="text-btn" onClick={() => setSelected(apps.map((a) => a.id))}>
            {lang === "en" ? "Select all" : lang === "es" ? "Seleccionar todo" : "Selecionar tudo"}
          </button>
          <button className="text-btn" onClick={() => setSelected([])}>
            {lang === "en" ? "Clear all" : lang === "es" ? "Limpiar todo" : "Limpar tudo"}
          </button>
          <span className="selected-count">
            {selected.length} {lang === "en" ? "selected" : lang === "es" ? "seleccionadas" : "selecionadas"}
          </span>
        </div>

        <div className="app-grid">
          {apps.map((app) => {
            const isSelected = selected.includes(app.id);
            return (
              <div
                key={app.id}
                className={"app-card " + (isSelected ? "selected" : "")}
                onClick={() => toggle(app.id)}
              >
                <div className="tooltip">
                  <div className="tooltip-who">{app.who}</div>
                  <div className="tooltip-title">{tr[app.id]}</div>
                  <div className="tooltip-body">{app.tip}</div>
                </div>
                <div className="app-card-check">✓</div>
                <span className="app-card-icon">{app.icon}</span>
                <div className="app-card-title">{tr[app.id]}</div>
                <div className="app-card-desc">{tr[app.id + "Desc"]}</div>
              </div>
            );
          })}
        </div>

        <div className="nav-buttons">
          <button className="btn-secondary" onClick={onBack}>{tr.backBtn}</button>
          <button
            className="btn-primary"
            onClick={onNext}
            disabled={selected.length === 0}
          >
            {tr.nextBtn} →
          </button>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}