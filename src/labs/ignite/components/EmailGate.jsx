import { useState } from "react";
import { useLanguage, useUnit } from "../lib/contexts";
import t from "../lib/translations";

export default function EmailGate({ onSubmit, onBack }) {
  const { lang, setLang } = useLanguage();
  const { unit, setUnit } = useUnit();
  const tr = t[lang];
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email || !email.includes("@")) {
      setError(
        lang === "en"
          ? "Please enter a valid email address."
          : lang === "es"
          ? "Por favor ingresa un correo válido."
          : "Por favor insira um e-mail válido."
      );
      return;
    }
    onSubmit({ email, name, company });
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
              <button
                key={l}
                className={`lang-btn ${lang === l ? "active" : ""}`}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="page-content email-page">
        <div className="email-card">
          <div className="step-indicator" style={{ justifyContent: "center", marginBottom: "28px" }}>
            <div className="step done">✓</div>
            <div className="step-line done"></div>
            <div className="step done">✓</div>
            <div className="step-line done"></div>
            <div className="step active">3</div>
            <div className="step-line"></div>
            <div className="step">4</div>
          </div>

          <div className="email-icon">📊</div>
          <h2>{tr.emailTitle}</h2>
          <p>{tr.emailSub}</p>

          <div className="email-form">
            <div className="form-field">
              <label>
                {lang === "en" ? "Full Name" : lang === "es" ? "Nombre Completo" : "Nome Completo"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  lang === "en" ? "John Smith" : lang === "es" ? "Juan García" : "João Silva"
                }
              />
            </div>

            <div className="form-field">
              <label>
                {lang === "en" ? "Company / Shipyard" : lang === "es" ? "Empresa / Astillero" : "Empresa / Estaleiro"}
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={
                  lang === "en" ? "Shipyard name" : lang === "es" ? "Nombre del astillero" : "Nome do estaleiro"
                }
              />
            </div>

            <div className="form-field">
              <label>
                {lang === "en" ? "Email Address *" : lang === "es" ? "Correo Electrónico *" : "Endereço de E-mail *"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder={tr.emailPlaceholder}
              />
              {error && <span className="field-error">{error}</span>}
            </div>
          </div>

          <p className="privacy">
            {lang === "en"
              ? "🔒 Your information is secure and will not be shared with third parties."
              : lang === "es"
              ? "🔒 Tu información está segura y no será compartida con terceros."
              : "🔒 Suas informações são seguras e não serão compartilhadas com terceiros."}
          </p>

          <div className="nav-buttons" style={{ justifyContent: "center", gap: "12px" }}>
            <button className="btn-secondary" onClick={onBack}>{tr.backBtn}</button>
            <button className="btn-primary" onClick={handleSubmit}>{tr.emailBtn} →</button>
          </div>
        </div>
      </div>
    </div>
  );
}