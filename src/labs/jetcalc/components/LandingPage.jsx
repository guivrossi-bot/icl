import { useLanguage, useUnit } from '../lib/contexts'
import { t } from '../lib/translations'

export default function LandingPage({ onStart, lang, setLang, unit, setUnit }) {
  const tr = t[lang]

  return (
    <div className="landing">
      <nav className="nav">
        <div className="nav-brand">
          <a href="/" className="nav-back">← ICL</a>
          <span className="nav-logo">JetCalc</span>
        </div>
        <div className="nav-controls">
          <div className="lang-select">
            {['en', 'pt', 'es'].map(l => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? 'active' : ''}`}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="unit-toggle">
            <button
              className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
              onClick={() => setUnit('metric')}
            >
              {tr.metric}
            </button>
            <button
              className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
              onClick={() => setUnit('imperial')}
            >
              {tr.imperial}
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">Industrial Cutting Labs</div>
        <h1 className="hero-title">{tr.tagline}</h1>
        <p className="hero-sub">{tr.subtitle}</p>
        <button className="hero-cta" onClick={onStart}>{tr.startCta}</button>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>{tr.featSpeed}</h3>
          <p>{tr.featSpeedDesc}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">$</div>
          <h3>{tr.featCost}</h3>
          <p>{tr.featCostDesc}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⏱</div>
          <h3>{tr.featPierce}</h3>
          <p>{tr.featPierceDesc}</p>
        </div>
      </section>
    </div>
  )
}
