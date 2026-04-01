import { useState } from 'react'
import { saveFeedback } from '../../../lib/supabase'
import t from '../i18n/translations'

const TECH_COLORS = {
  plasma_conv:  '#EF9F27',
  plasma_hidef: '#BA7517',
  laser_low:    '#85B7EB',
  laser_high:   '#185FA5',
  waterjet:     '#1D9E75',
  oxyfuel:      '#D85A30',
}

const SPECIALTY_MATERIALS = ['Copper', 'Titanium', 'Other']
const THICKNESS_CAPS = {
  plasma_conv: 50, plasma_hidef: 80,
  laser_low: 25,   laser_high: 40,
  waterjet: 300,   oxyfuel: 400,
}

function isTechAvailable(key, answers, tr) {
  const mat = answers.material || ''
  const thick = parseFloat(answers.thickness) || 0
  if (key === 'oxyfuel' && !mat.includes('Mild steel')) return { available: false, reason: tr.mildSteelOnly }
  if (thick > 0 && thick > THICKNESS_CAPS[key]) return { available: false, reason: tr.maxThick(THICKNESS_CAPS[key]) }
  return { available: true }
}

function scoreReport(answers) {
  const thick = parseFloat(answers.thickness) || 8
  const lr = parseFloat(answers.labor_rate) || 35
  const mult = (thick > 50 ? 3.5 : thick > 30 ? 2.2 : thick > 15 ? 1.5 : 1) * (lr > 50 ? 1.3 : lr < 20 ? 0.8 : 1)
  const mat = answers.material || ''
  const isSpecialty = SPECIALTY_MATERIALS.some(m => mat.includes(m))
  const fin = answers.finish || '', tol = answers.tolerance || ''
  const haz = answers.haz || '', pri = answers.priority || ''

  let sc = {
    plasma_conv:  { q: 45, s: 92, c: 95, sc: 65 },
    plasma_hidef: { q: 72, s: 88, c: 75, sc: 72 },
    laser_low:    { q: 82, s: 72, c: 68, sc: 74 },
    laser_high:   { q: 92, s: 85, c: 55, sc: 80 },
    waterjet:     { q: 88, s: 42, c: 52, sc: 62 },
    oxyfuel:      { q: 30, s: 28, c: 98, sc: 48 },
  }

  if (isSpecialty) { sc.waterjet.sc += 25; sc.plasma_conv.sc -= 15; sc.plasma_hidef.sc -= 10 }
  if (fin.includes('Fine'))                         { sc.laser_high.sc += 10; sc.waterjet.sc += 8; sc.plasma_conv.sc -= 20; sc.plasma_hidef.sc -= 10; sc.oxyfuel.sc -= 35 }
  if (tol.includes('0.1') || tol.includes('0.05')) { sc.laser_high.sc += 12; sc.waterjet.sc += 10; sc.plasma_conv.sc -= 18; sc.oxyfuel.sc -= 30 }
  if (haz?.includes('Very'))   { sc.waterjet.sc += 22; sc.laser_high.sc -= 12; sc.plasma_conv.sc -= 22; sc.oxyfuel.sc -= 25 }
  if (pri?.includes('Lowest')) { sc.oxyfuel.sc += 22; sc.plasma_conv.sc += 18; sc.laser_high.sc -= 8 }
  if (pri?.includes('quality')){ sc.laser_high.sc += 15; sc.waterjet.sc += 10; sc.plasma_conv.sc -= 15 }
  if (thick > 20) { sc.plasma_hidef.sc += 12; sc.laser_low.sc -= 15; sc.oxyfuel.sc += 15 }
  if (thick > 50) { sc.oxyfuel.sc += 20; sc.waterjet.sc += 10; sc.laser_high.sc -= 10 }

  const dummyTr = { mildSteelOnly: '', maxThick: () => '' }
  Object.keys(sc).forEach(key => {
    if (!isTechAvailable(key, answers, dummyTr).available) {
      sc[key] = { q: 0, s: 0, c: 0, sc: 0 }
    }
  })

  const cl = v => Math.min(99, Math.max(0, Math.round(v)))
  Object.keys(sc).forEach(k => { sc[k] = { q: cl(sc[k].q), s: cl(sc[k].s), c: cl(sc[k].c), sc: cl(sc[k].sc) } })

  const sorted = Object.entries(sc).filter(([, v]) => v.sc > 0).sort((a, b) => b[1].sc - a[1].sc)
  return { sc, sorted }
}

export default function CutReport({ lang = 'en', answers, units, onRestart }) {
  const tr = t[lang]
  const [fbOpen, setFbOpen] = useState(false)
  const [fbScore, setFbScore] = useState(0)
  const [fbComment, setFbComment] = useState('')
  const [fbDone, setFbDone] = useState(false)

  const thick = parseFloat(answers.thickness) || 8
  const thickStr = units === 'imperial' ? `${(thick / 25.4).toFixed(2)} in` : `${thick}mm`
  const { sc, sorted } = scoreReport(answers)
  const winner = sorted[0]
  const winnerName = tr.techs[winner[0]].label
  const matDisplay = answers.material ? (tr.options[answers.material] || answers.material) : ''

  async function submitFeedback() {
    await saveFeedback({ source: 'cutwise', score: fbScore, comment: fbComment, recommended_process: winner[0], payload: answers })
    setFbDone(true)
  }

  const unavailableKeys = Object.keys(TECH_COLORS).filter(k => !sorted.map(([k]) => k).includes(k))

  // Attribute pills per tech (quality, speed, heat, thickness)
  const scorecardRows = [
    { label: tr.scorecardRows[0], vals: tr.scorecardQuality },
    { label: tr.scorecardRows[2], vals: tr.scorecardSpeed },
    { label: tr.scorecardRows[3], vals: tr.scorecardHeat },
    { label: tr.scorecardRows[5], vals: tr.scorecardThick },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F5F8FC' }}>

      {/* Sub-nav */}
      <div style={{ padding: '10px 24px', borderBottom: '1px solid #E8ECF2', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>{tr.reportLabel} · {matDisplay || 'Mild steel'} · {thickStr}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onRestart} style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid #E8ECF2', background: '#fff', fontSize: 12, color: '#5A6172', cursor: 'pointer' }}>{tr.newAnalysis}</button>
          <button onClick={() => window.print()} style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid #85B7EB', background: '#EEF5FD', fontSize: 12, color: '#0C447C', fontWeight: 500, cursor: 'pointer' }}>{tr.exportPdf}</button>
        </div>
      </div>

      <div style={{ maxWidth: 780, width: '100%', margin: '0 auto', padding: '28px 20px 56px' }}>

        {/* Recommendation banner */}
        <div style={{ padding: '20px 24px', borderRadius: 16, border: '1.5px solid #85B7EB', background: '#EEF5FD', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28, boxShadow: '0 2px 8px rgba(55,138,221,0.10)' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#378ADD', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 4 }}>{tr.recommendedTech}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0C447C', marginBottom: 6, letterSpacing: '-0.3px' }}>{winnerName}</div>
            <div style={{ fontSize: 13, color: '#185FA5', lineHeight: 1.6, maxWidth: 460 }}>
              {tr.recDesc(matDisplay, thickStr, winnerName)}
            </div>
          </div>
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 12, padding: '14px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexShrink: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#0C447C', lineHeight: 1 }}>{winner[1].sc}</div>
            <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4 }}>match score</div>
          </div>
        </div>

        {/* Not applicable */}
        {unavailableKeys.length > 0 && (
          <div style={{ marginBottom: 20, padding: '9px 14px', borderRadius: 10, background: '#fff', border: '1px solid #E8ECF2', fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <span style={{ color: '#CBD5E1', fontSize: 14 }}>⊘</span>
            <span>
              <strong style={{ color: '#5A6172' }}>{tr.notApplicableJob}</strong>{' '}
              {unavailableKeys.map(k => tr.techs[k].label).join(', ')} —{' '}
              {unavailableKeys.map(k => isTechAvailable(k, answers, tr).reason).filter((v,i,a) => a.indexOf(v) === i).join('; ')}
            </span>
          </div>
        )}

        {/* Ranked tech cards */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
            {tr.sideBySide}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sorted.map(([key, scores], i) => {
              const isWin = i === 0
              return (
                <div key={key} style={{
                  background: isWin ? '#EEF5FD' : '#fff',
                  borderRadius: 14,
                  border: isWin ? '1.5px solid #85B7EB' : '1px solid #E8ECF2',
                  borderLeft: `4px solid ${TECH_COLORS[key]}`,
                  padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.15s',
                }}>
                  {/* Rank badge */}
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: isWin ? '#378ADD' : '#F0F4F8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isWin ? '#fff' : '#94A3B8' }}>#{i + 1}</span>
                  </div>

                  {/* Name + pills */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1E2A3A' }}>{tr.techs[key].label}</span>
                      {isWin && (
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', background: '#378ADD', color: '#fff', padding: '2px 8px', borderRadius: 20 }}>
                          {lang === 'pt' ? 'Recomendado' : lang === 'es' ? 'Recomendado' : 'Recommended'}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {scorecardRows.map(row => {
                        const val = row.vals[key] || '—'
                        const isGood = val.startsWith('★') || val.startsWith('✓')
                        const isBad = val.startsWith('✗')
                        return (
                          <span key={row.label} style={{
                            fontSize: 11, padding: '3px 9px', borderRadius: 20,
                            background: isGood ? '#E1F5EE' : isBad ? '#FEF0EE' : '#F0F4F8',
                            color: isGood ? '#085041' : isBad ? '#B04A2F' : '#5A6172',
                            fontWeight: 500, whiteSpace: 'nowrap',
                          }}>
                            {row.label}: {val}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 44 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: TECH_COLORS[key], lineHeight: 1 }}>{scores.sc}</div>
                    <div style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>score</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Feedback */}
        <div style={{ border: '1px solid #E8ECF2', borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div onClick={() => setFbOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1E2A3A' }}>{tr.wereEstimatesAccurate}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{tr.helpImprove}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#378ADD', fontWeight: 500 }}>{fbOpen ? tr.closeX : tr.leaveFeedback}</div>
          </div>

          {fbOpen && !fbDone && (
            <div style={{ borderTop: '1px solid #E8ECF2' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8ECF2' }}>
                <div style={{ fontSize: 12, color: '#5A6172', marginBottom: 10 }}>{tr.howAccurate}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {tr.feedbackRatings.map((label, idx) => {
                    const n = idx + 1
                    return (
                      <button key={n} onClick={() => setFbScore(n)} style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        border: fbScore === n ? (n <= 2 ? '1px solid #F09595' : n === 3 ? '1px solid #FAC775' : '1px solid #9FE1CB') : '1px solid #E8ECF2',
                        background: fbScore === n ? (n <= 2 ? '#FEF0EE' : n === 3 ? '#FAEEDA' : '#E1F5EE') : '#F5F8FC',
                        color: fbScore === n ? (n <= 2 ? '#B04A2F' : n === 3 ? '#633806' : '#085041') : '#5A6172'
                      }}>{n} — {label}</button>
                    )
                  })}
                </div>
              </div>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8ECF2' }}>
                <textarea value={fbComment} onChange={e => setFbComment(e.target.value)} rows={3}
                  placeholder={tr.feedbackPlaceholder}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E8ECF2', fontSize: 13, resize: 'vertical', fontFamily: 'inherit', background: '#F5F8FC', color: '#1E2A3A' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{tr.anonymous}</div>
                <button onClick={submitFeedback} disabled={fbScore === 0} style={{
                  padding: '7px 18px', borderRadius: 8, border: '1px solid #85B7EB',
                  background: '#EEF5FD', fontSize: 13, fontWeight: 500, color: '#0C447C', cursor: 'pointer',
                  opacity: fbScore === 0 ? 0.4 : 1
                }}>{tr.sendFeedback}</button>
              </div>
            </div>
          )}

          {fbOpen && fbDone && (
            <div style={{ borderTop: '1px solid #E8ECF2', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1E2A3A' }}>{tr.thankYou}</div>
              <div style={{ fontSize: 12, color: '#5A6172', maxWidth: 280, lineHeight: 1.5 }}>{tr.thankYouNote}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
