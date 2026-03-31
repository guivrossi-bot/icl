import { useState } from "react";
import { useLanguage, useUnit } from "../lib/contexts";
import t from "../lib/translations";
import { INDUSTRY_DEFAULTS } from "../lib/calculators";

const APP_FIELDS = {
  burnRate: (tr, unit) => [
    { key: "employees", label: tr.numEmployees },
    { key: "opDays", label: tr.opDays },
    { key: "laborRate", label: tr.laborRate },
    { key: "torchUse", label: tr.torchUse },
    { key: "plasmaSpeed", label: tr.plasmaSpeed + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "torchSpeed", label: tr.torchSpeed + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "dailyCut", label: tr.dailyCut + (unit === "imperial" ? " (in/day)" : " (m/day)") },
  ],
  noPreheat: (tr) => [
    { key: "employees", label: tr.numEmployees },
    { key: "opDays", label: tr.opDays },
    { key: "laborRate", label: tr.laborRate },
    { key: "torchUse", label: tr.torchUse },
    { key: "preheatTime", label: tr.preheatTime },
    { key: "plasmaStarts", label: tr.plasmaStarts },
  ],
  training: (tr) => [
    { key: "laborRate", label: tr.laborRate },
    { key: "oxyTraining", label: tr.oxyTraining },
    { key: "plasmaTraining", label: tr.plasmaTraining },
    { key: "trainEmployees", label: tr.trainEmployees },
    { key: "trainWeeks", label: tr.trainWeeks },
  ],
  setup: (tr) => [
    { key: "employees", label: tr.numEmployees },
    { key: "opDays", label: tr.opDays },
    { key: "numShifts", label: tr.numShifts },
    { key: "laborRate", label: tr.laborRate },
    { key: "oxySetup", label: tr.oxySetup },
    { key: "plasmaSetup", label: tr.plasmaSetup },
    { key: "torchSetups", label: tr.torchSetups },
    { key: "plasmaSetups", label: tr.plasmaSetups },
  ],
  grinding: (tr) => [
    { key: "grindEmployees", label: tr.grindEmployees },
    { key: "opDays", label: tr.opDays },
    { key: "laborRate", label: tr.laborRate },
    { key: "dailyGrind", label: tr.dailyGrind },
    { key: "plasmaGrindPct", label: tr.plasmaGrindPct },
  ],
  skeleton: (tr) => [
    { key: "skelHours", label: tr.skelHours },
    { key: "skelShifts", label: tr.skelShifts },
    { key: "skelEmployees", label: tr.skelEmployees },
    { key: "opDays", label: tr.opDays },
    { key: "laborRate", label: tr.laborRate },
  ],
  beveling: (tr, unit) => [
    { key: "bevelEmployees", label: tr.bevelEmployees },
    { key: "bevelStations", label: tr.bevelStations },
    { key: "bevelHours", label: tr.bevelHours },
    { key: "opDays", label: tr.opDays },
    { key: "laborRate", label: tr.laborRate },
    { key: "bevelPlasmaSpeed", label: tr.bevelPlasmaSpeed + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "bevelOxySpeed", label: tr.bevelOxySpeed + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "elecCost", label: tr.elecCost },
    { key: "gasCost", label: tr.gasCost },
    { key: "plasmaConsumables", label: tr.plasmaConsumables },
    { key: "oxyConsumables", label: tr.oxyConsumables },
  ],
  marking: (tr, unit) => [
    { key: "markEmployees", label: tr.markEmployees },
    { key: "opDays", label: tr.opDays },
    { key: "laborRate", label: tr.laborRate },
    { key: "dailyMark", label: tr.dailyMark + (unit === "imperial" ? " (in/day)" : " (m/day)") },
    { key: "plasmaMarkSpeed", label: tr.plasmaMarkSpeed + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "punchSpeed", label: tr.punchSpeed + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
  ],
  gouging: (tr, unit) => [
    { key: "gougEmployees", label: tr.gougEmployees },
    { key: "opDays", label: tr.opDays },
    { key: "laborRate", label: tr.laborRate },
    { key: "gougLength", label: tr.gougLength + (unit === "imperial" ? " (ft/day)" : " (m/day)") },
    { key: "carbonRodCost", label: tr.carbonRodCost },
    { key: "plasmaStackCost", label: tr.plasmaStackCost },
    { key: "rodLife", label: tr.rodLife },
    { key: "consumLife", label: tr.consumLife },
    { key: "plasmaGougSpeed", label: tr.plasmaGougSpeed + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "cagSpeed", label: tr.cagSpeed + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "grindAfterPlasma", label: tr.grindAfterPlasma },
    { key: "grindAfterCAG", label: tr.grindAfterCAG },
  ],
  tempAttach: (tr, unit) => [
    { key: "employees", label: tr.numEmployees },
    { key: "opDays", label: tr.opDays },
    { key: "laborRate", label: tr.laborRate },
    { key: "dailyCutLength", label: tr.dailyCutLength + (unit === "imperial" ? " (in/day)" : " (m/day)") },
    { key: "flushCutRate", label: tr.flushCutRate + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "grindPctPlasma", label: tr.grindPctPlasma },
    { key: "altRate", label: tr.altRate + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "grindRate", label: tr.grindRate + (unit === "imperial" ? " (ipm)" : " (mm/min)") },
    { key: "torchSetupTime", label: tr.torchSetupTime },
    { key: "torchCAGUse", label: tr.torchCAGUse },
    { key: "flushUse", label: tr.flushUse },
  ],
};

const APP_ICONS = {
  burnRate: "🔥", noPreheat: "🌡️", training: "🎓", setup: "⚙️",
  grinding: "🔩", skeleton: "🏗️", beveling: "📐", marking: "✏️",
  gouging: "⚡", tempAttach: "🔗",
};

export default function CalculatorForms({ apps, calcData, setCalcData, onNext, onBack }) {
  const { lang, setLang } = useLanguage();
  const { unit, setUnit } = useUnit();
  const tr = t[lang];
  const [activeTab, setActiveTab] = useState(apps[0]);
  const defaults = INDUSTRY_DEFAULTS[unit];

  const getVal = (appId, key) => {
    if (calcData[appId]?.[key] !== undefined) return calcData[appId][key];
    return defaults[appId]?.[key] ?? "";
  };

  const setVal = (appId, key, val) => {
    setCalcData((prev) => ({
      ...prev,
      [appId]: { ...(prev[appId] || {}), [key]: val === "" ? "" : Number(val) },
    }));
  };

  const useAvg = (appId) => {
    setCalcData((prev) => ({ ...prev, [appId]: { ...defaults[appId] } }));
  };

  const fields = APP_FIELDS[activeTab]?.(tr, unit) || [];

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
              <button key={l} className={`lang-btn ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="unit-toggle">
            <button className={`unit-btn ${unit === "metric" ? "active" : ""}`} onClick={() => setUnit("metric")}>{tr.metric}</button>
            <button className={`unit-btn ${unit === "imperial" ? "active" : ""}`} onClick={() => setUnit("imperial")}>{tr.imperial}</button>
          </div>
        </div>
      </nav>

      <div className="page-content">
        <div className="step-indicator">
  <div className="step done">✓</div>
  <div className="step-line done"></div>
  <div className="step active">2</div>
  <div className="step-line"></div>
  <div className="step">3</div>
</div>

        <h2 className="page-title">{tr.calcTitle}</h2>
        <p className="page-sub">{tr.calcSub}</p>

        <div className="calc-layout">
          <div className="app-tabs">
            {apps.map((appId) => (
              <button
                key={appId}
                className={`app-tab ${activeTab === appId ? "active" : ""}`}
                onClick={() => setActiveTab(appId)}
              >
                <span className="tab-icon">{APP_ICONS[appId]}</span>
                <span className="tab-label">{tr[appId]}</span>
              </button>
            ))}
          </div>

          <div className="calc-form-panel">
            <div className="form-header">
              <div className="form-title">
                <span className="form-icon">{APP_ICONS[activeTab]}</span>
                <h3>{tr[activeTab]}</h3>
              </div>
              <button className="avg-btn" onClick={() => useAvg(activeTab)}>
                📊 {tr.industryAvg}
              </button>
            </div>

            <div className="form-grid">
              {fields.map((field) => (
                <div key={field.key} className="form-field">
                  <label>{field.label}</label>
                  <div>
                    <input
                      type="number"
                      value={getVal(activeTab, field.key)}
                      onChange={(e) => setVal(activeTab, field.key, e.target.value)}
                      placeholder={String(defaults[activeTab]?.[field.key] ?? "")}
                    />
                    <span className="field-hint">
                      {tr.industryAvg}: {defaults[activeTab]?.[field.key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-buttons">
          <button className="btn-secondary" onClick={onBack}>{tr.backBtn}</button>
          <button className="btn-primary" onClick={onNext}>{tr.nextBtn} →</button>
        </div>
      </div>
    </div>
  );
}