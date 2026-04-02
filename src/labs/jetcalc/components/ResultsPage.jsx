import { t } from '../lib/translations'
import { QUALITY_LEVELS } from '../lib/constants'

function fmt(n, d = 2) {
  if (!isFinite(n) || isNaN(n)) return '—'
  return Number(n).toFixed(d)
}

function KpiCard({ label, value, unit, highlight }) {
  return (
    <div className={`kpi-card ${highlight ? 'kpi-card--highlight' : ''}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-unit">{unit}</div>
    </div>
  )
}

export default function ResultsPage({ lang, results, formInputs, unit, onReset }) {
  const tr = t[lang]
  const isMetric = unit === 'metric'

  const {
    cutSpeedMmMin,
    costPerMeter,
    pierceTimeSec,
    dynamicPierceTimeSec,
    costPerHour,
    energyCostHr,
    waterCostHr,
    abrasiveCostHr,
    replacementCostHr,
    laborCostHr,
    qualitySpeeds,
  } = results

  const costRows = [
    { label: tr.resultEnergyHr,      value: energyCostHr },
    { label: tr.resultWaterHr,       value: waterCostHr },
    { label: tr.resultAbrasiveHr,    value: abrasiveCostHr },
    { label: tr.resultReplacementHr, value: replacementCostHr },
    { label: tr.resultLaborHr,       value: laborCostHr },
  ]

  return (
    <div className="results-page">
      <nav className="nav nav--compact">
        <span className="nav-logo">JetCalc</span>
        <button className="nav-reset" onClick={onReset}>{tr.newCalc}</button>
      </nav>

      <div className="results-inner">
        <h2 className="results-title">{tr.resultsTitle}</h2>

        {/* ── 3 KPI cards ── */}
        <div className="kpi-grid">
          <KpiCard
            label={tr.resultCutSpeed}
            value={fmt(cutSpeedMmMin, 1)}
            unit={tr.unitMmMin}
            highlight
          />
          <KpiCard
            label={tr.resultCostPerMeter}
            value={`$${fmt(costPerMeter, 3)}`}
            unit={tr.unitDollarM}
            highlight
          />
          <KpiCard
            label={tr.resultPierceTime}
            value={fmt(pierceTimeSec, 2)}
            unit={tr.unitSec}
            highlight
          />
        </div>

        {/* ── Secondary pierce ── */}
        <div className="results-secondary">
          <div className="secondary-item">
            <span className="secondary-label">{tr.resultDynamicPierce}</span>
            <span className="secondary-value">{fmt(dynamicPierceTimeSec, 2)} {tr.unitSec}</span>
          </div>
        </div>

        {/* ── Cost breakdown ── */}
        <section className="breakdown-section">
          <h3 className="breakdown-title">{tr.resultCostBreakdown}</h3>
          <table className="breakdown-table">
            <tbody>
              {costRows.map(row => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td className="breakdown-val">${fmt(row.value, 2)} / hr</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="breakdown-total">
                <td>{tr.resultTotalHr}</td>
                <td className="breakdown-val">${fmt(costPerHour, 2)}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* ── Quality comparison ── */}
        <section className="quality-section">
          <h3 className="breakdown-title">{tr.resultQualityTable}</h3>
          <table className="quality-table">
            <thead>
              <tr>
                <th>Quality</th>
                <th>{tr.unitMmMin}</th>
              </tr>
            </thead>
            <tbody>
              {QUALITY_LEVELS.map((q, i) => (
                <tr key={q.value} className={formInputs?.cutQuality === q.value ? 'quality-active' : ''}>
                  <td>{tr[q.labelKey]}</td>
                  <td>{fmt(qualitySpeeds?.[i], 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <button className="calc-submit results-reset" onClick={onReset}>{tr.newCalc}</button>
      </div>
    </div>
  )
}
