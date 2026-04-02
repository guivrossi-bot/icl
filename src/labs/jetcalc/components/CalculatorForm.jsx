import { useState, useEffect } from 'react'
import { t } from '../lib/translations'
import {
  MATERIALS, PUMPS, ORIFICE_NOZZLES, QUALITY_LEVELS,
  DEFAULT_COSTS, DEFAULT_COSTS_METRIC,
  MACHINE_TIERS, MATERIAL_CATEGORIES, getMaterialCat,
} from '../lib/constants'
import { translateMaterial } from '../lib/materialTranslations'

// Category icons (SVG-free, emoji-based for portability)
const CAT_ICONS = { all: '⊞', metal: '⚙', stone: '◈', plastic: '⬡', glass: '◇', other: '◦' }
const QUALITY_ICONS = ['◌', '◔', '◑', '◕', '●']

export default function CalculatorForm({ lang, unit, onSubmit }) {
  const tr = t[lang]
  const isMetric = unit === 'metric'
  const defaultCosts = isMetric ? DEFAULT_COSTS_METRIC : DEFAULT_COSTS

  // ── Visible state (user choices) ──
  const [category, setCategory] = useState('all')
  const [materialIdx, setMaterialIdx] = useState(0)
  const [thickness, setThickness] = useState(isMetric ? 10 : 0.394)
  const [quality, setQuality] = useState(3)
  const [tierIdx, setTierIdx] = useState(1)          // default: Standard
  const [headCount, setHeadCount] = useState(1)
  const [showPressureEdit, setShowPressureEdit] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [cuttingPressure, setCuttingPressure] = useState(null)   // null = auto
  const [piercingPressure, setPiercingPressure] = useState(null) // null = auto
  const [costs, setCosts] = useState(defaultCosts)

  const mat = MATERIALS[materialIdx]
  const tier = MACHINE_TIERS[tierIdx]
  const pump = PUMPS[tier.pumpIdx]
  const on = ORIFICE_NOZZLES[tier.onIdx]

  const autoCutP = isMetric ? mat.cutBar : mat.cutPsi
  const autoPierceP = isMetric ? mat.piercePbar : mat.piercePsi
  const effectiveCutP = cuttingPressure ?? autoCutP
  const effectivePierceP = piercingPressure ?? autoPierceP
  const pressureUnit = isMetric ? 'bar' : 'PSI'

  // Reset pressures when material changes
  useEffect(() => {
    setCuttingPressure(null)
    setPiercingPressure(null)
  }, [materialIdx])

  // Reset when unit switches
  useEffect(() => {
    setThickness(isMetric ? 10 : 0.394)
    setCuttingPressure(null)
    setPiercingPressure(null)
    setCosts(isMetric ? DEFAULT_COSTS_METRIC : DEFAULT_COSTS)
  }, [unit])

  // Filtered material list
  const filteredMaterials = MATERIALS.map((m, i) => ({ ...m, i })).filter(m =>
    category === 'all' || getMaterialCat(m.name) === category
  )

  // If current material is not in the new category, reset to first in category
  function handleCategoryChange(cat) {
    setCategory(cat)
    const first = MATERIALS.findIndex((m, i) => cat === 'all' || getMaterialCat(m.name) === cat)
    if (first !== -1) setMaterialIdx(first)
    setCuttingPressure(null)
    setPiercingPressure(null)
  }

  function handleMaterialChange(idx) {
    setMaterialIdx(idx)
    setCuttingPressure(null)
    setPiercingPressure(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const onVals = isMetric ? on.met : on.usc

    onSubmit({
      // Material
      machinabilityIndex: mat.mi,
      thickness,
      cutQuality: quality,
      // Pressures
      cuttingPressure: effectiveCutP,
      piercingPressure: effectivePierceP,
      // Machine (hidden from user)
      orificeNumber: headCount,
      orificeDiameter: onVals.od,
      nozzleDiameter: onVals.nd,
      abrasiveFlow: onVals.af,
      kiloWatt: pump.kw,
      pumpReplacementParts: pump.pumpReplCost,
      pumpCoolingGPM: isMetric ? pump.coolingLpm : pump.coolingGpm,
      maxPumpGPM: isMetric ? pump.maxLpm : pump.maxGpm,
      // Costs
      ...costs,
    })
  }

  return (
    <div className="calc-page">
      <nav className="nav nav--compact">
        <div className="nav-brand">
          <a href="/" className="nav-back">← ICL</a>
          <span className="nav-logo">JetCalc</span>
        </div>
      </nav>

      <form className="calc-form" onSubmit={handleSubmit}>

        {/* ═══ Step 1: Material ═══ */}
        <div className="form-step">
          <div className="step-header">
            <span className="step-number">1</span>
            <h2 className="step-title">{tr.stepMaterial}</h2>
          </div>

          {/* Category tiles */}
          <div className="cat-tiles">
            {MATERIAL_CATEGORIES.map(c => (
              <button
                key={c.id}
                type="button"
                className={`cat-tile ${category === c.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(c.id)}
              >
                <span className="cat-tile-icon">{CAT_ICONS[c.id]}</span>
                <span className="cat-tile-label">{tr[c.iconKey]}</span>
              </button>
            ))}
          </div>

          {/* Material dropdown */}
          <div className="field">
            <select
              className="material-select"
              value={materialIdx}
              onChange={e => handleMaterialChange(Number(e.target.value))}
            >
              {filteredMaterials.map(m => (
                <option key={m.i} value={m.i}>{translateMaterial(m.name, lang)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ═══ Step 2: Thickness ═══ */}
        <div className="form-step">
          <div className="step-header">
            <span className="step-number">2</span>
            <h2 className="step-title">{tr.stepThickness}</h2>
          </div>
          <div className="thickness-input-row">
            <input
              type="number"
              className="thickness-input"
              min="0.1"
              step="0.1"
              value={thickness}
              onChange={e => setThickness(parseFloat(e.target.value))}
            />
            <span className="thickness-unit">{isMetric ? tr.unitMm : tr.unitInch}</span>
          </div>
        </div>

        {/* ═══ Step 3: Cut Quality ═══ */}
        <div className="form-step">
          <div className="step-header">
            <span className="step-number">3</span>
            <h2 className="step-title">{tr.stepQuality}</h2>
          </div>
          <div className="quality-pills">
            {QUALITY_LEVELS.map((q, i) => (
              <button
                key={q.value}
                type="button"
                className={`quality-pill ${quality === q.value ? 'active' : ''}`}
                onClick={() => setQuality(q.value)}
              >
                <span className="quality-icon">{QUALITY_ICONS[i]}</span>
                <span className="quality-label">{tr[q.labelKey]}</span>
                <span className="quality-desc">{tr[q.labelKey + 'Desc']}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══ Step 4: Machine Tier ═══ */}
        <div className="form-step">
          <div className="step-header">
            <span className="step-number">4</span>
            <h2 className="step-title">{tr.stepMachine}</h2>
          </div>
          <div className="tier-cards">
            {MACHINE_TIERS.map((tier, i) => (
              <button
                key={tier.id}
                type="button"
                className={`tier-card ${tierIdx === i ? 'active' : ''}`}
                onClick={() => setTierIdx(i)}
              >
                <span className="tier-icon">{tier.icon}</span>
                <span className="tier-name">{tr[tier.nameKey]}</span>
                <span className="tier-hp">{tier.hpRange}</span>
                <span className="tier-desc">{tr[tier.nameKey + 'Desc']}</span>
              </button>
            ))}
          </div>
          <p className="pump-type-note">{tr.pumpTypeNote}</p>
        </div>

        {/* ═══ Step 5: Cutting Heads ═══ */}
        <div className="form-step form-step--inline">
          <div className="step-header">
            <span className="step-number">5</span>
            <h2 className="step-title">{tr.stepHeads}</h2>
          </div>
          <div className="head-count-row">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                type="button"
                className={`head-btn ${headCount === n ? 'active' : ''}`}
                onClick={() => setHeadCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ Pressure info bar (auto, collapsible edit) ═══ */}
        <div className="pressure-bar">
          <div className="pressure-item">
            <span className="pressure-label">{tr.pressureInfo}</span>
            <span className="pressure-value">{effectiveCutP.toLocaleString()} {pressureUnit}</span>
          </div>
          <div className="pressure-item">
            <span className="pressure-label">{tr.pressurePiercing}</span>
            <span className="pressure-value">{effectivePierceP.toLocaleString()} {pressureUnit}</span>
          </div>
          <button
            type="button"
            className="pressure-adjust-btn"
            onClick={() => setShowPressureEdit(v => !v)}
          >
            {tr.pressureAdjust} {showPressureEdit ? '▴' : '▾'}
          </button>
        </div>

        {showPressureEdit && (
          <div className="pressure-edit-panel">
            <p className="pressure-note">{tr.pressureNote}</p>
            <div className="form-grid">
              <div className="field">
                <label>{tr.labelCuttingPressure} ({pressureUnit})</label>
                <input
                  type="number"
                  value={effectiveCutP}
                  onChange={e => setCuttingPressure(parseFloat(e.target.value))}
                />
              </div>
              <div className="field">
                <label>{tr.labelPiercingPressure} ({pressureUnit})</label>
                <input
                  type="number"
                  value={effectivePierceP}
                  onChange={e => setPiercingPressure(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══ Advanced Costs (collapsed) ═══ */}
        <button
          type="button"
          className="accordion-toggle"
          onClick={() => setShowAdvanced(v => !v)}
        >
          {tr.stepCosts}
          <span className={`accordion-arrow ${showAdvanced ? 'open' : ''}`}>▾</span>
        </button>

        {showAdvanced && (
          <div className="form-grid costs-grid">
            <div className="field">
              <label>{tr.labelEnergyCost} ($/kWh)</label>
              <input type="number" min="0" step="0.01" value={costs.energyCost}
                onChange={e => setCosts(c => ({ ...c, energyCost: parseFloat(e.target.value) }))} />
            </div>
            <div className="field">
              <label>{tr.labelAbrasiveCost} ({isMetric ? '$/kg' : '$/lb'})</label>
              <input type="number" min="0" step="0.01" value={costs.abrasiveCost}
                onChange={e => setCosts(c => ({ ...c, abrasiveCost: parseFloat(e.target.value) }))} />
            </div>
            <div className="field">
              <label>{tr.labelLaborCost} ($/hr)</label>
              <input type="number" min="0" step="0.01" value={costs.laborCost}
                onChange={e => setCosts(c => ({ ...c, laborCost: parseFloat(e.target.value) }))} />
            </div>
            <div className="field">
              <label>{tr.labelWaterCost} ({isMetric ? '$/1000 L' : '$/1000 gal'})</label>
              <input type="number" min="0" step="0.01" value={costs.waterCost}
                onChange={e => setCosts(c => ({ ...c, waterCost: parseFloat(e.target.value) }))} />
            </div>
          </div>
        )}

        <button type="submit" className="calc-submit">{tr.calculateBtn}</button>
      </form>
    </div>
  )
}
