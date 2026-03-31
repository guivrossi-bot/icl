import { useState, useEffect, useRef } from 'react'
import { saveLead } from '../../../lib/supabase'
import t from '../i18n/translations'

// ── Step definitions (internal English values — used by scoring logic) ─────────
const STEPS = [
  { id: 'material', fields: [
      { id: 'material',   type: 'chips',  required: true,
        options: ['Mild steel', 'Stainless steel', 'Aluminum', 'Copper', 'Titanium', 'Other'] },
      { id: 'thickness',  type: 'number', required: true, placeholder: 'e.g. 6' },
      { id: 'size',       type: 'chips',  optional: true,
        options: ['< 100mm', '100–500mm', '500mm–1m', '> 1m'] }
    ]
  },
  { id: 'cut', fields: [
      { id: 'geometry',   type: 'chips',  required: true,
        options: ['Straight lines', 'Simple curves', 'Complex contours', 'Holes / piercing', 'Mixed'] },
      { id: 'finish',     type: 'chips',  required: true,
        options: ['Rough (structural)', 'Medium (functional)', 'Fine (visible / precise)'] },
      { id: 'haz',        type: 'chips',  optional: true,
        options: ['Not sensitive', 'Somewhat sensitive', 'Very sensitive'] }
    ]
  },
  { id: 'precision', fields: [
      { id: 'tolerance',  type: 'chips',  required: true,
        options: ['±0.5mm (loose)', '±0.2mm (standard)', '±0.1mm (tight)', '< ±0.05mm (precision)'] },
      { id: 'squareness', type: 'chips',  optional: true,
        options: ['Not critical', 'Important', 'Critical'] }
    ]
  },
  { id: 'volume', fields: [
      { id: 'quantity',   type: 'chips',  required: true,
        options: ['1–5 (prototype)', '6–50 (small batch)', '51–500 (medium)', '500+ (production)'] },
      { id: 'frequency',  type: 'chips',  optional: true,
        options: ['One-off', 'Occasionally', 'Monthly', 'Weekly / continuous'] }
    ]
  },
  { id: 'priority', fields: [
      { id: 'priority',   type: 'chips',  required: true,
        options: ['Lowest cost', 'Fastest turnaround', 'Best quality', 'No heat distortion'] },
      { id: 'budget',     type: 'chips',  optional: true,
        options: ['< $2', '$2–10', '$10–50', '$50+', 'Not sure yet'] }
    ]
  },
  { id: 'email', special: 'email' }
]

// ── Technology definitions ────────────────────────────────────────────────────
const TECH_COLORS = {
  plasma_conv:  '#EF9F27',
  plasma_hidef: '#BA7517',
  laser_low:    '#85B7EB',
  laser_high:   '#185FA5',
  waterjet:     '#1D9E75',
  oxyfuel:      '#D85A30',
}

// ── Thickness caps ────────────────────────────────────────────────────────────
const THICKNESS_CAPS = {
  plasma_conv: 50, plasma_hidef: 80,
  laser_low: 25,   laser_high: 40,
  waterjet: 300,   oxyfuel: 400,
}

const SPECIALTY_MATERIALS = ['Copper', 'Titanium', 'Other']

function isTechAvailable(techKey, answers, tr) {
  const mat = answers.material || ''
  const thick = parseFloat(answers.thickness) || 0
  if (techKey === 'oxyfuel' && !mat.includes('Mild steel'))
    return { available: false, reason: tr.oxyfuelOnly }
  if (thick > 0 && thick > THICKNESS_CAPS[techKey])
    return { available: false, reason: tr.maxThickLong(THICKNESS_CAPS[techKey]) }
  return { available: true, reason: null }
}

function score(answers) {
  const thick = parseFloat(answers.thickness) || 0
  const fin = answers.finish || '', tol = answers.tolerance || ''
  const haz = answers.haz || '', pri = answers.priority || ''
  const mat = answers.material || ''
  const isSpecialty = SPECIALTY_MATERIALS.some(m => mat.includes(m))
  const geo = answers.geometry || '', qty = answers.quantity || ''

  let sc = {
    plasma_conv:  { q: 45, s: 92, c: 95, sc: 65 },
    plasma_hidef: { q: 72, s: 88, c: 75, sc: 72 },
    laser_low:    { q: 82, s: 72, c: 68, sc: 74 },
    laser_high:   { q: 92, s: 85, c: 55, sc: 80 },
    waterjet:     { q: 88, s: 42, c: 52, sc: 62 },
    oxyfuel:      { q: 30, s: 28, c: 98, sc: 48 },
  }

  if (isSpecialty) { sc.waterjet.sc += 25; sc.waterjet.q += 10; sc.plasma_conv.sc -= 15; sc.plasma_hidef.sc -= 10; sc.oxyfuel.sc = 0 }
  if (mat.includes('Stainless')) { sc.laser_high.sc += 8; sc.laser_low.sc += 5; sc.plasma_conv.q -= 10 }
  if (mat.includes('Aluminum'))  { sc.laser_high.sc += 10; sc.laser_low.sc += 8; sc.plasma_conv.sc -= 5 }

  if (thick > 20) { sc.plasma_hidef.sc += 12; sc.plasma_conv.sc += 8; sc.laser_high.sc -= 5; sc.laser_low.sc -= 15; sc.oxyfuel.sc += 15 }
  if (thick > 40) { sc.plasma_hidef.sc += 10; sc.oxyfuel.sc += 20; sc.laser_high.sc -= 10; sc.laser_low.sc -= 20 }
  if (thick > 80) { sc.oxyfuel.sc += 15; sc.waterjet.sc += 10 }
  if (thick <= 6) { sc.laser_high.sc += 15; sc.laser_low.sc += 12; sc.plasma_conv.sc -= 10; sc.oxyfuel.sc -= 20 }

  if (fin.includes('Fine'))                         { sc.laser_high.q += 8; sc.laser_low.q += 5; sc.waterjet.q += 6; sc.plasma_conv.q -= 25; sc.plasma_hidef.q -= 12; sc.oxyfuel.q -= 35; sc.laser_high.sc += 10; sc.waterjet.sc += 8; sc.plasma_conv.sc -= 20 }
  if (tol.includes('0.1') || tol.includes('0.05')) { sc.laser_high.sc += 12; sc.waterjet.sc += 10; sc.laser_low.sc += 6; sc.plasma_conv.sc -= 18; sc.plasma_hidef.sc -= 8; sc.oxyfuel.sc -= 30 }
  if (haz.includes('Very'))    { sc.waterjet.sc += 22; sc.laser_high.sc -= 12; sc.laser_low.sc -= 10; sc.plasma_conv.sc -= 22; sc.plasma_hidef.sc -= 15; sc.oxyfuel.sc -= 25 }
  if (haz.includes('Somewhat')) { sc.waterjet.sc += 8; sc.plasma_conv.sc -= 8; sc.oxyfuel.sc -= 12 }
  if (pri.includes('Lowest'))   { sc.oxyfuel.sc += 22; sc.plasma_conv.sc += 18; sc.plasma_hidef.sc += 8; sc.laser_high.sc -= 8; sc.laser_low.sc += 5 }
  if (pri.includes('quality'))  { sc.laser_high.sc += 15; sc.waterjet.sc += 10; sc.laser_low.sc += 8; sc.plasma_conv.sc -= 15; sc.oxyfuel.sc -= 20 }
  if (pri.includes('heat'))     { sc.waterjet.sc += 25; sc.laser_high.sc -= 15; sc.laser_low.sc -= 12; sc.plasma_conv.sc -= 25; sc.plasma_hidef.sc -= 18; sc.oxyfuel.sc -= 28 }
  if (pri.includes('Fastest'))  { sc.plasma_conv.sc += 18; sc.plasma_hidef.sc += 15; sc.laser_high.sc += 10; sc.laser_low.sc += 8; sc.waterjet.sc -= 15; sc.oxyfuel.sc -= 10 }
  if (geo.includes('Complex') || geo.includes('Holes')) { sc.laser_high.sc += 10; sc.laser_low.sc += 8; sc.waterjet.sc += 8; sc.plasma_conv.sc -= 12; sc.oxyfuel.sc -= 25 }
  if (qty.includes('500+')) { sc.plasma_conv.sc += 10; sc.plasma_hidef.sc += 8; sc.laser_high.sc += 12 }
  if (qty.includes('1–5'))  { sc.waterjet.sc += 8; sc.oxyfuel.sc += 5 }

  // availability caps (language-agnostic — just zeroes scores)
  Object.keys(sc).forEach(key => {
    const avail = isTechAvailable(key, answers, { oxyfuelOnly: '', maxThickLong: () => '' })
    if (!avail.available) { sc[key].sc = 0; sc[key].q = 0; sc[key].s = 0; sc[key].c = 0 }
  })

  const cl = v => Math.min(99, Math.max(0, Math.round(v)))
  const result = {}
  Object.keys(sc).forEach(k => { result[k] = { q: cl(sc[k].q), s: cl(sc[k].s), c: cl(sc[k].c), sc: cl(sc[k].sc) } })
  return result
}

function costRange(key, answers) {
  const base = { plasma_conv: [0.8,4], plasma_hidef: [1.5,6], laser_low: [2,7], laser_high: [3,10], waterjet: [4,14], oxyfuel: [0.4,2.5] }
  const r = base[key]
  const thick = parseFloat(answers.thickness) || 5
  const isSpecialty = SPECIALTY_MATERIALS.some(m => (answers.material || '').includes(m))
  let mult = thick > 50 ? 3.5 : thick > 30 ? 2.2 : thick > 15 ? 1.5 : 1
  if (isSpecialty && key === 'waterjet') mult *= 1.6
  if (isSpecialty && key !== 'waterjet') mult *= 1.2
  return `$${(r[0] * mult).toFixed(1)}–$${(r[1] * mult).toFixed(1)}`
}

// ── Animated bar ──────────────────────────────────────────────────────────────
function AnimatedBar({ value, color, prevValue }) {
  const [width, setWidth] = useState(prevValue || 0)
  useEffect(() => { const id = setTimeout(() => setWidth(value), 50); return () => clearTimeout(id) }, [value])
  return (
    <div style={{ flex: 1, height: 4, background: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', borderRadius: 2, background: color, width: `${width}%`, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Wizard({ lang = 'en', units, onComplete }) {
  const tr = t[lang]
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const prevScores = useRef({})

  const step = STEPS[current]
  const stepMeta = tr.steps[current]
  const filled = Object.keys(answers).filter(k => answers[k]).length
  const sc = score(answers)

  const sorted = Object.entries(sc).sort((a, b) => {
    if (a[1].sc === 0 && b[1].sc === 0) return 0
    if (a[1].sc === 0) return 1
    if (b[1].sc === 0) return -1
    return b[1].sc - a[1].sc
  })

  function pick(id, val) { prevScores.current = { ...sc }; setAnswers(prev => ({ ...prev, [id]: val })) }

  async function handleSubmit() {
    if (!answers.email?.includes('@')) return
    await saveLead({
      email: answers.email,
      first_name: answers.first_name,
      company: answers.company,
      source: 'cutwise',
      recommended_process: sorted[0][0],
      payload: answers
    })
    setSubmitted(true)
    setTimeout(() => onComplete(answers), 1200)
  }

  if (submitted) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 500 }}>{tr.buildingReport}</div>
      </div>
    )
  }

  // field label helper
  function fieldLabel(fieldId) {
    if (fieldId === 'thickness') return units === 'imperial' ? tr.fields.thicknessIn : tr.fields.thickness
    return tr.fields[fieldId] || fieldId
  }

  return (
    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 52px)' }}>

      {/* ── LEFT: wizard ── */}
      <div style={{ borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column' }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 3, padding: '10px 20px', borderBottom: '1px solid #e8e8e8' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < current ? '#1D9E75' : i === current ? '#378ADD' : '#e0e0e0', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Step header */}
        <div style={{ padding: '16px 20px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#999', letterSpacing: '0.5px', marginBottom: 3 }}>
            {tr.stepOf(current + 1, STEPS.length)}
          </div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{stepMeta.title}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 3 }}>{stepMeta.sub}</div>
        </div>

        {/* Fields */}
        <div style={{ padding: '4px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>

          {step.special === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '10px 12px', borderRadius: 8, background: '#f5f5f5', borderLeft: '3px solid #378ADD' }}>
                <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{tr.reportIncludes}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>{tr.fields.firstName} <span style={{ fontSize: 10, color: '#aaa' }}>{tr.optional}</span></div>
                  <input type="text" placeholder={tr.phFirstName} value={answers.first_name || ''} onChange={e => pick('first_name', e.target.value)} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>{tr.fields.company} <span style={{ fontSize: 10, color: '#aaa' }}>{tr.optional}</span></div>
                  <input type="text" placeholder={tr.phCompany} value={answers.company || ''} onChange={e => pick('company', e.target.value)} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>{tr.fields.email}</div>
                <input type="email" placeholder={tr.phEmail} value={answers.email || ''} onChange={e => pick('email', e.target.value)} />
              </div>
              <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>{tr.noSpam}</div>
            </div>
          )}

          {!step.special && step.fields?.map(f => (
            <div key={f.id}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                {fieldLabel(f.id)}
                {f.optional && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: '#f0f0f0', color: '#aaa' }}>{tr.optional}</span>}
              </div>
              {f.type === 'chips' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {f.options.map(o => (
                    <button key={o} onClick={() => pick(f.id, o)} style={{
                      padding: '5px 11px', borderRadius: 20, fontSize: 12, transition: 'all 0.15s',
                      border: answers[f.id] === o ? '1px solid #85B7EB' : '1px solid #e0e0e0',
                      background: answers[f.id] === o ? '#E6F1FB' : '#fff',
                      color: answers[f.id] === o ? '#0C447C' : '#1a1a1a'
                    }}>{tr.options[o] || o}</button>
                  ))}
                </div>
              )}
              {f.type === 'number' && (
                <input type="number" placeholder={f.placeholder} value={answers[f.id] || ''} onChange={e => pick(f.id, e.target.value)} />
              )}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderTop: '1px solid #e8e8e8' }}>
          <button onClick={() => setCurrent(c => Math.max(0, c - 1))} style={{
            padding: '6px 12px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 12, color: '#666',
            visibility: current === 0 ? 'hidden' : 'visible'
          }}>{tr.back}</button>
          {step.special === 'email'
            ? <button onClick={handleSubmit} disabled={!answers.email?.includes('@')} style={{
                padding: '7px 20px', borderRadius: 8, border: '1px solid #5DCAA5', background: '#E1F5EE',
                fontSize: 13, fontWeight: 500, color: '#085041',
                opacity: answers.email?.includes('@') ? 1 : 0.4
              }}>{tr.getReport}</button>
            : <button onClick={() => setCurrent(c => Math.min(STEPS.length - 1, c + 1))} style={{
                padding: '7px 20px', borderRadius: 8, border: '1px solid #85B7EB', background: '#E6F1FB',
                fontSize: 13, fontWeight: 500, color: '#0C447C'
              }}>{tr.continue}</button>
          }
        </div>
      </div>

      {/* ── RIGHT: live comparison ── */}
      <div style={{ background: '#f9f9f9', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#f9f9f9', zIndex: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{tr.liveComparison}</div>
          <div style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 10,
            background: filled < 2 ? '#FAEEDA' : filled < 5 ? '#E6F1FB' : '#E1F5EE',
            color: filled < 2 ? '#633806' : filled < 5 ? '#0C447C' : '#085041'
          }}>
            {filled < 2 ? tr.waitingInput : filled < 5 ? tr.partialEstimate : tr.goodEstimate}
          </div>
        </div>

        {sorted.map(([key, s], i) => {
          const avail = isTechAvailable(key, answers, tr)
          const isLeading = i === 0 && avail.available && filled > 1
          const prev = prevScores.current[key] || {}

          return (
            <div key={key} style={{
              padding: '11px 18px', borderBottom: '1px solid #e8e8e8',
              background: isLeading ? '#fff' : 'transparent',
              opacity: avail.available ? 1 : 0.35,
              transition: 'opacity 0.4s, background 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: avail.available ? TECH_COLORS[key] : '#ccc', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: avail.available ? '#1a1a1a' : '#aaa' }}>{tr.techs[key].label}</span>
                  {isLeading && <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: '#E6F1FB', color: '#0C447C' }}>{tr.leading}</span>}
                  {!avail.available && <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: '#f0f0f0', color: '#aaa' }}>{tr.notApplicable}</span>}
                </div>
                <span style={{ fontSize: 11, color: avail.available && filled > 0 ? '#666' : '#ccc' }}>
                  {avail.available && filled > 0 ? costRange(key, answers) + ' ' + tr.perPart : avail.available ? '—' : avail.reason}
                </span>
              </div>

              {avail.available ? (
                [[tr.quality, s.q, prev.q], [tr.speed, s.s, prev.s], [tr.costFit, s.c, prev.c]].map(([label, val, pval]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: '#aaa', width: 56, flexShrink: 0 }}>{label}</span>
                    <AnimatedBar value={val} color={TECH_COLORS[key]} prevValue={pval} />
                    <span style={{ fontSize: 10, color: '#aaa', width: 28, textAlign: 'right' }}>{val}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 11, color: '#bbb', fontStyle: 'italic', marginTop: 2 }}>{avail.reason}</div>
              )}
            </div>
          )
        })}

        {filled >= 2 && sorted[0] && isTechAvailable(sorted[0][0], answers, tr).available && (
          <div style={{ margin: '10px 14px', padding: '10px 12px', borderRadius: 8, background: '#fff', border: '1px solid #e0e0e0', borderLeft: '3px solid #378ADD' }}>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
              <strong style={{ color: '#1a1a1a' }}>{tr.signal}:</strong>{' '}
              {tr.signalFor(
                answers.material ? tr.options[answers.material] || answers.material : null,
                answers.thickness,
                tr.techs[sorted[0][0]].label,
                units === 'imperial' ? 'in' : 'mm'
              )}
              {answers.haz?.includes('Very') ? tr.signalWaterjet : ''}
              {answers.material && SPECIALTY_MATERIALS.some(m => answers.material.includes(m)) ? tr.signalSpecialty : ''}
              {answers.material?.includes('Mild steel') && parseFloat(answers.thickness) > 50 ? tr.signalOxyfuel : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
