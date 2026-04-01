import t from '../i18n/translations'

export default function Hero({ lang = 'en', onStart, onSample }) {
  const tr = t[lang]

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '56px 24px', textAlign: 'center', gap: 22,
      background: '#F5F8FC',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
          {tr.tagline}
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 20, border: '1px solid #FCD34D' }}>
          Beta
        </span>
      </div>

      <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px', maxWidth: 520, color: '#1E2A3A' }}>
        {tr.heroTitle1}{' '}
        <span style={{ color: '#378ADD' }}>{tr.heroTitle2}</span>
        {' '}{tr.heroTitle3}
      </h1>

      <p style={{ fontSize: 15, color: '#5A6172', lineHeight: 1.7, maxWidth: 420 }}>
        {tr.heroSubtitle}
      </p>

      {/* Tech pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Fiber laser', color: '#85B7EB' },
          { label: 'Plasma',      color: '#EF9F27' },
          { label: 'Waterjet',    color: '#1D9E75' },
          { label: lang === 'pt' ? 'Oxicorte' : lang === 'es' ? 'Oxicorte' : 'Oxyfuel', color: '#D85A30' },
        ].map(({ label, color }) => (
          <div key={label} style={{
            padding: '5px 14px', borderRadius: 20,
            border: `1px solid ${color}30`,
            background: `${color}10`,
            fontSize: 12, color: color, fontWeight: 500,
          }}>{label}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onStart} style={{
          padding: '11px 28px', borderRadius: 24, background: '#378ADD',
          color: '#fff', fontSize: 14, fontWeight: 600, border: 'none',
          boxShadow: '0 2px 8px rgba(55,138,221,0.25)',
          cursor: 'pointer',
        }}>
          {tr.startFree}
        </button>
        <button onClick={onSample} style={{
          padding: '11px 22px', borderRadius: 24, border: '1px solid #E8ECF2',
          background: '#fff', color: '#5A6172', fontSize: 14, cursor: 'pointer',
        }}>
          {tr.seeSample}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[tr.feature1, tr.feature2, tr.feature3].map(feat => (
          <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94A3B8' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1D9E75' }} />
            {feat}
          </div>
        ))}
      </div>

      {/* Beta notice */}
      <div style={{ maxWidth: 460, padding: '12px 16px', borderRadius: 12, background: '#FFFBEB', border: '1px solid #FCD34D', display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left' }}>
        <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6, margin: 0 }}>
          <strong>{tr.betaTitle}</strong> {tr.betaBody}
        </p>
      </div>
    </div>
  )
}
