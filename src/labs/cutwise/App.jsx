import { useState } from 'react'
import './index.css'
import Hero from './components/Hero'
import Wizard from './components/Wizard'
import CutReport from './components/CutReport'

export default function CutwiseApp() {
  const [screen, setScreen] = useState('hero')
  const [answers, setAnswers] = useState({})
  const [units, setUnits] = useState('metric')
  const [lang, setLang] = useState('en')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '52px',
        borderBottom: '1px solid #e8e8e8', background: '#fff',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#aaa', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.color = '#378ADD'}
            onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            ICL
          </a>
          <div style={{ width: 1, height: 14, background: '#e0e0e0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px' }}>cut<span style={{ color: '#378ADD' }}>wise</span></span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: '#FEF3C7', color: '#92400E', padding: '2px 7px', borderRadius: 20, border: '1px solid #FCD34D' }}>Beta</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Units toggle */}
          <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: 20, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            {['imperial', 'metric'].map(u => (
              <button key={u} onClick={() => setUnits(u)} style={{
                padding: '4px 12px', fontSize: 11, fontWeight: 500,
                background: units === u ? '#fff' : 'transparent',
                color: units === u ? '#1a1a1a' : '#888',
                borderRadius: 20, border: 'none',
                boxShadow: units === u ? '0 0 0 1px #e0e0e0' : 'none'
              }}>
                {u === 'imperial' ? 'in / lb' : 'mm / kg'}
              </button>
            ))}
          </div>
          {/* Language toggle */}
          <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: 20, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            {['en', 'pt', 'es'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '4px 10px', fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase',
                background: lang === l ? '#fff' : 'transparent',
                color: lang === l ? '#1a1a1a' : '#aaa',
                borderRadius: 20, border: 'none',
                boxShadow: lang === l ? '0 0 0 1px #e0e0e0' : 'none'
              }}>{l}</button>
            ))}
          </div>
          {/* Start button */}
          <button onClick={() => setScreen('wizard')} style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
            background: '#E6F1FB', border: '1px solid #85B7EB', color: '#0C447C'
          }}>
            {lang === 'pt' ? 'Iniciar análise' : lang === 'es' ? 'Iniciar análisis' : 'Start analysis'}
          </button>
        </div>
      </nav>

      {screen === 'hero'   && <Hero    lang={lang} onStart={() => setScreen('wizard')} onSample={() => setScreen('report')} />}
      {screen === 'wizard' && <Wizard  key={units} lang={lang} units={units} onComplete={(a) => { setAnswers(a); setScreen('report') }} />}
      {screen === 'report' && <CutReport key={units} lang={lang} answers={answers} units={units} onRestart={() => { setAnswers({}); setScreen('wizard') }} />}
    </div>
  )
}
