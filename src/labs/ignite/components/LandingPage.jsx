import { useLanguage, useUnit } from "../lib/contexts";
import t from "../lib/translations";

export default function LandingPage({ onStart }) {
  const { lang, setLang } = useLanguage();
  const { unit, setUnit } = useUnit();
  const tr = t[lang];

  return (
    <div className="landing">
      <nav className="nav">
        <div className="nav-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">Ignite</span>
          <span className="brand-tag">Cut costs. Not corners.</span>
        </div>
        <div className="nav-controls">
          <div className="lang-select">
            {["en", "es", "pt"].map((l) => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? "active" : ""}`}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="unit-toggle">
            <button
              className={`unit-btn ${unit === "metric" ? "active" : ""}`}
              onClick={() => setUnit("metric")}
            >
              {tr.metric}
            </button>
            <button
              className={`unit-btn ${unit === "imperial" ? "active" : ""}`}
              onClick={() => setUnit("imperial")}
            >
              {tr.imperial}
            </button>
          </div>
          <a href="/" style={{ fontSize: 10, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, marginLeft: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
            ← ICL
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg">
          <div className="hero-glow glow1"></div>
          <div className="hero-glow glow2"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            {tr.tagline}
          </div>
          <h1 className="hero-title">
            {lang === "en" && (<>Unlock Your<br /><span className="accent">Shipyard's</span><br />Full Potential</>)}
            {lang === "es" && (<>Desbloquea el<br /><span className="accent">Potencial</span><br />de Tu Astillero</>)}
            {lang === "pt" && (<>Desbloqueie o<br /><span className="accent">Potencial</span><br />do Seu Estaleiro</>)}
          </h1>
          <p className="hero-sub">{tr.heroSub}</p>
          <button className="hero-btn" onClick={onStart}>
            <span>{tr.startBtn}</span>
            <div className="btn-spark">→</div>
          </button>
        </div>

        <div className="hero-visual">
          <svg viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 200 L70 130 L430 130 L480 200 L250 235 Z" fill="#1a3a5c" stroke="#00bcd4" strokeWidth="1.5"/>
            <rect x="150" y="80" width="140" height="55" rx="4" fill="#1e4976" stroke="#00bcd4" strokeWidth="1"/>
            <rect x="185" y="45" width="70" height="40" rx="4" fill="#1e4976" stroke="#00bcd4" strokeWidth="1"/>
            <rect x="160" y="90" width="16" height="12" rx="2" fill="#64b5f6" opacity="0.8"/>
            <rect x="182" y="90" width="16" height="12" rx="2" fill="#64b5f6" opacity="0.8"/>
            <rect x="204" y="90" width="16" height="12" rx="2" fill="#64b5f6" opacity="0.8"/>
            <rect x="226" y="90" width="16" height="12" rx="2" fill="#64b5f6" opacity="0.8"/>
            <rect x="248" y="90" width="16" height="12" rx="2" fill="#64b5f6" opacity="0.8"/>
            <rect x="196" y="18" width="22" height="30" rx="2" fill="#1a3a5c" stroke="#00bcd4" strokeWidth="1"/>
            <circle cx="340" cy="148" r="10" fill="#ff9800" opacity="0.9"/>
            <path d="M340 136 L346 152 L334 152 Z" fill="#ffeb3b"/>
            <path d="M328 136 L335 148 L322 150 Z" fill="#ff9800" opacity="0.6"/>
            <path d="M352 136 L345 148 L358 150 Z" fill="#ff9800" opacity="0.6"/>
            <path d="M0 220 Q60 208 120 220 Q180 232 240 220 Q300 208 360 220 Q420 232 500 220 L500 280 L0 280 Z" fill="#0d2137" opacity="0.9"/>
            <path d="M0 238 Q50 228 100 238 Q150 248 200 238 Q250 228 300 238 Q350 248 400 238 Q450 228 500 238 L500 280 L0 280 Z" fill="#0a1929" opacity="0.7"/>
          </svg>
        </div>
      </section>

      <section className="stats-bar">
        <div className="stats-inner">
          {[
            { val: "2×", label: lang === "en" ? "Faster than oxyfuel" : lang === "es" ? "Más rápido" : "Mais rápido" },
            { val: "80%", label: lang === "en" ? "Less grinding" : lang === "es" ? "Menos esmerilado" : "Menos esmerilamento" },
            { val: "7×", label: lang === "en" ? "Faster training" : lang === "es" ? "Entrenamiento más rápido" : "Treinamento mais rápido" },
            { val: "10×", label: lang === "en" ? "Faster marking" : lang === "es" ? "Marcado más rápido" : "Marcação mais rápida" },
          ].map((s, i) => (
            <div key={i}>
              <span className="stat-val">{s.val}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="app-preview">
        <h2 className="section-title">
          {lang === "en" ? "10 Savings Opportunities" : lang === "es" ? "10 Oportunidades de Ahorro" : "10 Oportunidades de Economia"}
        </h2>
        <p className="section-sub">
          {lang === "en" ? "Select only the processes relevant to your yard." : lang === "es" ? "Selecciona solo los procesos relevantes para tu astillero." : "Selecione apenas os processos relevantes para seu estaleiro."}
        </p>
        <div className="preview-grid">
          {[
            { icon: "🔥", label: lang === "en" ? "Burn Rate" : lang === "es" ? "Velocidad Corte" : "Taxa de Corte" },
            { icon: "✏️", label: lang === "en" ? "Marking" : lang === "es" ? "Marcado" : "Marcação" },
            { icon: "🌡️", label: lang === "en" ? "No Preheat" : lang === "es" ? "Sin Precalentamiento" : "Sem Pré-aquecimento" },
            { icon: "⚡", label: lang === "en" ? "Gouging" : lang === "es" ? "Gouging" : "Goivagem" },
            { icon: "📐", label: lang === "en" ? "Beveling" : lang === "es" ? "Biselado" : "Chanframento" },
            { icon: "⚙️", label: lang === "en" ? "Setup Time" : lang === "es" ? "Configuración" : "Configuração" },
            { icon: "🎓", label: lang === "en" ? "Training" : lang === "es" ? "Entrenamiento" : "Treinamento" },
            { icon: "🔩", label: lang === "en" ? "Grinding" : lang === "es" ? "Esmerilado" : "Esmerilamento" },
            { icon: "🏗️", label: lang === "en" ? "Skeleton" : lang === "es" ? "Esqueleto" : "Esqueleto" },
            { icon: "🔗", label: lang === "en" ? "Temp. Attach." : lang === "es" ? "Fijaciones" : "Fixações" },
          ].map((a, i) => (
            <div key={i} className="preview-card">
              <span className="preview-icon">{a.icon}</span>
              <span className="preview-label">{a.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}