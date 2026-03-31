import t from '../i18n/translations'

export default function Hero({ lang = 'en', onStart, onSample }) {
  const tr = t[lang]

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', textAlign: 'center', gap: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          {tr.tagline}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 20, border: '1px solid #FCD34D' }}>
          Beta
        </span>
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.5px', maxWidth: 520, color: '#1a1a1a' }}>
        {tr.heroTitle1}{' '}
        <span style={{ color: '#378ADD' }}>{tr.heroTitle2}</span>
        {' '}{tr.heroTitle3}
      </h1>

      <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, maxWidth: 440 }}>
        {tr.heroSubtitle}
      </p>

      <div style={{ maxWidth: 480, padding: '12px 16px', borderRadius: 10, background: '#FFFBEB', border: '1px solid #FCD34D', display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left' }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6, margin: 0 }}>
          <strong>{tr.betaTitle}</strong> {tr.betaBody}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Fiber laser', 'Plasma', 'Waterjet', lang === 'pt' ? 'Oxicorte' : lang === 'es' ? 'Oxicorte' : 'Oxyfuel'].map(t => (
          <div key={t} style={{
            padding: '5px 14px', borderRadius: 20, border: '1px solid #e0e0e0',
            background: '#f5f5f5', fontSize: 12, color: '#666'
          }}>{t}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        <button onClick={onStart} style={{
          padding: '10px 24px', borderRadius: 24, background: '#378ADD',
          color: '#fff', fontSize: 14, fontWeight: 500, border: 'none'
        }}>
          {tr.startFree}
        </button>
        <button onClick={onSample} style={{
          padding: '10px 20px', borderRadius: 24, border: '1px solid #e0e0e0',
          background: 'transparent', color: '#666', fontSize: 14
        }}>
          {tr.seeSample}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        {[tr.feature1, tr.feature2, tr.feature3].map(feat => (
          <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#999' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#1D9E75' }} />
            {feat}
          </div>
        ))}
      </div>
    </div>
  )
}
