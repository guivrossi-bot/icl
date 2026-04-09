import { useState } from 'react'
import { translations, detectLang } from './i18n/translations'
import { saveLead, saveMessage } from './lib/supabase'
import './hub.css'

const NL_URL = 'https://www.linkedin.com/newsletters/7419724116267520000/?displayConfirmation=true'
const LI_URL = 'https://www.linkedin.com/in/guivrossi/'
const IGNITE_URL = 'https://ignite.industrialcuttinglabs.com'

// ── Color palettes ────────────────────────────────────────────────────────────
const C_DARK = {
  bg: '#0a0c0f', bg2: '#0e1015', bg3: '#13161c',
  text: '#e8e3d8', muted: 'rgba(232,227,216,0.45)',
  accent: '#d4541a', border: 'rgba(255,255,255,0.08)',
  borderHi: 'rgba(255,255,255,0.15)',
  featBg: 'linear-gradient(135deg, #12100d 0%, #0e1015 100%)',
  // opacity text helpers — map rgba(255,255,255,X)
  hi:  '#ffffff',
  t85: 'rgba(255,255,255,0.85)', t78: 'rgba(255,255,255,0.78)',
  t75: 'rgba(255,255,255,0.75)', t72: 'rgba(255,255,255,0.72)',
  t65: 'rgba(255,255,255,0.65)', t50: 'rgba(255,255,255,0.50)',
  t45: 'rgba(255,255,255,0.45)', t40: 'rgba(255,255,255,0.40)',
  t38: 'rgba(255,255,255,0.38)', t36: 'rgba(255,255,255,0.36)',
  t32: 'rgba(255,255,255,0.32)', t28: 'rgba(255,255,255,0.28)',
  t25: 'rgba(255,255,255,0.25)', t22: 'rgba(255,255,255,0.22)',
  t18: 'rgba(255,255,255,0.18)', t12: 'rgba(255,255,255,0.12)',
  t10: 'rgba(255,255,255,0.10)', t07: 'rgba(255,255,255,0.07)',
  t06: 'rgba(255,255,255,0.06)', t05: 'rgba(255,255,255,0.05)',
  t04: 'rgba(255,255,255,0.04)', t03: 'rgba(255,255,255,0.03)',
}

const C_LIGHT = {
  bg: '#f5f7f9', bg2: '#ffffff', bg3: '#edf0f3',
  text: '#1a1e27', muted: 'rgba(26,30,39,0.55)',
  accent: '#d4541a', border: 'rgba(0,0,0,0.09)',
  borderHi: 'rgba(0,0,0,0.16)',
  featBg: 'linear-gradient(135deg, #fff8f5 0%, #fff2ec 100%)',
  // opacity text helpers — map rgba(0,0,0,X)
  hi:  '#0d1017',
  t85: 'rgba(0,0,0,0.80)', t78: 'rgba(0,0,0,0.74)',
  t75: 'rgba(0,0,0,0.70)', t72: 'rgba(0,0,0,0.68)',
  t65: 'rgba(0,0,0,0.62)', t50: 'rgba(0,0,0,0.50)',
  t45: 'rgba(0,0,0,0.45)', t40: 'rgba(0,0,0,0.40)',
  t38: 'rgba(0,0,0,0.38)', t36: 'rgba(0,0,0,0.36)',
  t32: 'rgba(0,0,0,0.32)', t28: 'rgba(0,0,0,0.28)',
  t25: 'rgba(0,0,0,0.25)', t22: 'rgba(0,0,0,0.22)',
  t18: 'rgba(0,0,0,0.18)', t12: 'rgba(0,0,0,0.12)',
  t10: 'rgba(0,0,0,0.10)', t07: 'rgba(0,0,0,0.07)',
  t06: 'rgba(0,0,0,0.06)', t05: 'rgba(0,0,0,0.05)',
  t04: 'rgba(0,0,0,0.04)', t03: 'rgba(0,0,0,0.03)',
}

// ── Style factory ─────────────────────────────────────────────────────────────
function buildStyles(C) {
  return {
    root: { background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' },
    accentLine: { height: 2, background: `linear-gradient(90deg, transparent, ${C.accent}, #f5a623, transparent)` },

    // NAV
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: `0.5px solid ${C.border}` },
    navLeft: { display: 'flex', alignItems: 'baseline', gap: 8, cursor: 'pointer' },
    navLogo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: C.hi },
    navAccent: { color: C.accent },
    navLinks: { display: 'flex', alignItems: 'center', gap: 2 },
    navBtn: (active) => ({ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase', color: active ? C.hi : C.t65, background: active ? C.t10 : 'none', border: 'none', cursor: 'pointer', padding: '5px 11px', borderRadius: 3 }),
    soonBadge: { fontSize: 7, background: C.border, color: C.t36, padding: '2px 4px', borderRadius: 2, marginLeft: 4, verticalAlign: 'middle' },
    langSw: { display: 'flex', gap: 2, marginLeft: 8, borderLeft: `0.5px solid ${C.border}`, paddingLeft: 10 },
    langBtn: (active) => ({ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '1px', color: active ? C.hi : C.t40, background: active ? C.t12 : 'none', border: 'none', cursor: 'pointer', padding: '3px 6px', borderRadius: 2 }),
    talkBtn: { fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase', background: C.accent, color: '#fff', border: 'none', padding: '7px 18px', borderRadius: 3, cursor: 'pointer', marginLeft: 10 },
    themeBtn: { fontFamily: "'DM Sans', sans-serif", fontSize: 13, background: 'none', border: `0.5px solid ${C.border}`, color: C.t65, cursor: 'pointer', padding: '3px 8px', borderRadius: 3, marginLeft: 6, lineHeight: 1 },

    // HOME
    homeHero: { padding: '52px 48px 0', display: 'grid', gridTemplateColumns: '1fr 390px', gap: 52, alignItems: 'start' },
    eyebrow: { fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: C.accent, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
    eyebrowLine: { display: 'inline-block', width: 20, height: 1, background: C.accent },
    heroH1: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.9, letterSpacing: 2, marginBottom: 20 },
    heroL1: { display: 'block', color: C.hi },
    heroL2: { display: 'block', color: C.t18 },
    heroL3: { display: 'block', color: C.t07 },
    heroBody: { fontSize: 14, lineHeight: 1.8, color: C.muted, fontWeight: 300, maxWidth: 390, marginBottom: 28 },
    heroActions: { display: 'flex', gap: 10, alignItems: 'center' },
    btnPrimary: { fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', background: C.accent, color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 3, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
    btnGhost: { fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', background: 'none', color: C.t50, border: `0.5px solid ${C.t18}`, padding: '11px 20px', borderRadius: 3, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
    heroSections: { display: 'flex', flexDirection: 'column', gap: 1, background: C.t05, border: `0.5px solid ${C.border}`, borderRadius: 4, overflow: 'hidden', marginTop: 6 },
    hsec: (feat) => ({ background: feat ? 'rgba(212,84,26,0.06)' : C.bg2, padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }),
    hsecIcon: (feat) => ({ width: 28, height: 28, borderRadius: 3, background: feat ? 'rgba(212,84,26,0.15)' : C.t05, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }),
    hsecLabel: (feat) => ({ fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: feat ? C.accent : C.t32, marginBottom: 2 }),
    hsecTitle: { fontSize: 13, fontWeight: 500, color: C.t85 },
    soonPill: { fontSize: 7, letterSpacing: '1px', textTransform: 'uppercase', background: C.t06, color: C.t32, padding: '2px 6px', borderRadius: 2 },
    secArrow: { fontSize: 12, color: C.t25 },

    stats: { display: 'flex', padding: '36px 48px 0', borderTop: `0.5px solid ${C.border}`, marginTop: 40 },
    stat: (border) => ({ flex: 1, paddingBottom: 20, ...(border ? { borderRight: `0.5px solid ${C.border}`, paddingRight: 28, marginRight: 28 } : {}) }),
    statN: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 2, color: C.hi, lineHeight: 1, marginBottom: 3 },
    statL: { fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.t28 },

    // PAGE SHARED
    ph: { padding: '40px 48px 28px', borderBottom: `0.5px solid ${C.border}` },
    pl: { fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: C.accent, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 },
    plLine: { display: 'inline-block', width: 16, height: 1, background: C.accent },
    ph1: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 46, letterSpacing: 2, color: C.hi, lineHeight: 1, marginBottom: 10 },
    pd: { fontSize: 13, color: C.muted, fontWeight: 300, lineHeight: 1.8, maxWidth: 520 },

    // LABS
    disclaimer: { margin: '16px 48px 0', padding: '11px 16px', background: C.t03, border: `0.5px solid ${C.border}`, borderRadius: 3, display: 'flex', gap: 10, alignItems: 'flex-start' },
    discIcon: { fontSize: 11, color: C.t28, flexShrink: 0, marginTop: 1 },
    discText: { fontSize: 12, color: C.t32, lineHeight: 1.65, fontWeight: 300 },
    labsGrid: { padding: '20px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
    tc: (feat, building) => ({ border: `0.5px solid ${feat ? 'rgba(212,84,26,0.32)' : building ? 'rgba(212,84,26,0.15)' : C.border}`, borderRadius: 4, padding: '22px 20px', background: feat ? C.featBg : C.bg2, position: 'relative', gridColumn: feat ? 'span 2' : 'span 1' }),
    tcBar: (amber) => ({ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg, ${amber ? 'rgba(212,84,26,0.55)' : C.accent}, transparent)`, borderRadius: '4px 4px 0 0' }),
    ts: { fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 4, color: C.t40 },
    dotLive: { width: 4, height: 4, borderRadius: '50%', background: '#639922' },
    dotBuild: { width: 4, height: 4, borderRadius: '50%', background: C.accent, opacity: 0.7 },
    dotPlan: { width: 4, height: 4, borderRadius: '50%', background: C.t22 },
    tn: (feat) => ({ fontFamily: "'Bebas Neue', sans-serif", fontSize: feat ? 34 : 28, letterSpacing: 2, color: C.hi, marginBottom: 6, lineHeight: 1 }),
    tdesc: { fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 14, fontWeight: 300 },
    tags: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 },
    tag: { fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', background: C.t06, color: C.t32, padding: '2px 7px', borderRadius: 2 },
    tagAmber: { fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(212,84,26,0.1)', color: 'rgba(212,84,26,0.7)', padding: '2px 7px', borderRadius: 2 },
    tcta: { fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif" },
    progressBar: { height: 2, background: C.t06, borderRadius: 2, marginBottom: 14, overflow: 'hidden' },
    progressFill: { height: '100%', background: `linear-gradient(90deg, ${C.accent}, rgba(212,84,26,0.35))`, borderRadius: 2, width: '35%' },
    buildingSub: { fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(212,84,26,0.55)' },
    fbBanner: { margin: '0 48px 28px', padding: '14px 20px', background: 'rgba(212,84,26,0.04)', border: `0.5px solid rgba(212,84,26,0.14)`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
    fbMain: { flex: 1 },
    fbTitle: { fontSize: 12, fontWeight: 500, color: C.t72, marginBottom: 3 },
    fbSub: { fontSize: 12, color: C.t36, lineHeight: 1.55, fontWeight: 300 },
    fbCtaBtn: { fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', color: C.accent, background: 'none', border: `0.5px solid rgba(212,84,26,0.35)`, padding: '7px 16px', borderRadius: 3, cursor: 'pointer', flexShrink: 0, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },

    // MEDIA
    mediaPg: { padding: '60px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 380 },
    mediaRing: { width: 72, height: 72, border: `0.5px solid ${C.t10}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative' },
    mediaPlay: { width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: `15px solid ${C.t28}`, marginLeft: 3 },
    mediaSoon: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3, color: C.t25, marginBottom: 14 },
    mediaDesc: { fontSize: 13, color: C.muted, fontWeight: 300, lineHeight: 1.8, maxWidth: 420, marginBottom: 8 },
    notifyLbl: { fontSize: 10, letterSpacing: '1px', color: C.t28, marginBottom: 14, textTransform: 'uppercase' },
    notifyForm: { display: 'flex', gap: 7, width: '100%', maxWidth: 340 },
    notifyInput: { flex: 1, background: C.t05, border: `0.5px solid ${C.t10}`, color: C.hi, padding: '9px 12px', borderRadius: 3, fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: 'none' },
    notifyBtn: { background: C.t07, color: C.t65, border: `0.5px solid ${C.t10}`, padding: '9px 16px', borderRadius: 3, fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

    // NEWSLETTER
    nlPg: { padding: '56px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' },
    nlN: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 110, lineHeight: 0.85, color: C.t03, letterSpacing: 4, marginBottom: -18 },
    nlDesc: { fontSize: 13, color: C.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 28 },
    liBtn: { display: 'inline-flex', alignItems: 'center', gap: 9, background: '#0077b5', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 3, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
    liIcon: { width: 15, height: 15, background: '#fff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    liIn: { fontSize: 9, fontWeight: 700, color: '#0077b5', fontFamily: 'serif', lineHeight: 1 },
    nlIssues: { display: 'flex', flexDirection: 'column', gap: 1, background: C.t05, borderRadius: 4, overflow: 'hidden', marginTop: 10 },
    nlIssue: { background: C.bg2, padding: '16px 18px', cursor: 'pointer' },
    nlINum: { fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: C.accent, marginBottom: 3 },
    nlITitle: { fontSize: 13, fontWeight: 500, color: C.t78, marginBottom: 3 },
    nlIMeta: { fontSize: 10, color: C.t25 },

    // ABOUT
    valuesGrid: { padding: '24px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
    valCard: { border: `0.5px solid ${C.border}`, borderRadius: 4, padding: '24px 20px', background: C.bg2, position: 'relative', overflow: 'hidden' },
    valNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: C.t04, lineHeight: 1, position: 'absolute', top: 12, right: 16, letterSpacing: 2 },
    valTitle: { fontSize: 13, fontWeight: 500, color: C.hi, marginBottom: 8 },
    valDesc: { fontSize: 12, color: C.muted, lineHeight: 1.75, fontWeight: 300 },
    authorStrip: { margin: '0 48px 40px', borderTop: `0.5px solid ${C.border}`, paddingTop: 20, display: 'flex', alignItems: 'center', gap: 10 },
    authorDot: { width: 5, height: 5, borderRadius: '50%', background: C.accent, flexShrink: 0 },
    authorTxt: { fontSize: 11, color: C.t28 },

    // TALK
    talkPg: { padding: '56px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' },
    channels: { display: 'flex', flexDirection: 'column', gap: 9, marginTop: 24 },
    channel: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: `0.5px solid ${C.border}`, borderRadius: 4, background: C.bg2, cursor: 'pointer' },
    chDot: (color) => ({ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }),
    chInfo: { flex: 1 },
    chLabel: { fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: C.t28, marginBottom: 2 },
    chVal: { fontSize: 13, color: C.t75 },
    chArr: { fontSize: 12, color: C.t22 },
    talkForm: { display: 'flex', flexDirection: 'column', gap: 10 },
    ff: { display: 'flex', flexDirection: 'column', gap: 4 },
    fl: { fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: C.t32 },
    fi: { background: C.t04, border: `0.5px solid ${C.t10}`, color: C.hi, padding: '9px 12px', borderRadius: 3, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none' },
    fta: { resize: 'none', height: 90, lineHeight: 1.6 },
    fsub: { background: C.accent, color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 3, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", alignSelf: 'flex-start', marginTop: 3 },

    footer: { borderTop: `0.5px solid ${C.border}`, padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 },
    fc: { fontSize: 9, letterSpacing: '1px', color: C.t18 },
    fd: { width: 3, height: 3, borderRadius: '50%', background: C.accent },
  }
}

const REL_COLORS = { 1: 'rgba(255,255,255,0.22)', 2: '#7986cb', 3: '#d4541a', 4: '#4db6ac', 5: '#639922' }

function ReliabilityBadge({ level, l }) {
  const color = REL_COLORS[level] || REL_COLORS[1]
  const label = l[`relL${level}`]
  const desc = l[`relL${level}Desc`]
  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontFamily: "'DM Sans', sans-serif" }}>{l.relLabel}</span>
        <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: i <= level ? color : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color, fontFamily: "'DM Sans', sans-serif", marginLeft: 4 }}>{label}</span>
      </div>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontStyle: 'italic', lineHeight: 1.5, margin: 0, fontWeight: 300 }}>{desc} — {l.relDisclaimer}</p>
    </div>
  )
}

export default function HubApp() {
  const [lang, setLang] = useState(detectLang)
  const [page, setPage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const t = translations[lang]

  const C = theme === 'dark' ? C_DARK : C_LIGHT
  const s = buildStyles(C)

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const go = (p) => { setPage(p); setMobileMenuOpen(false) }
  const changeLang = (l) => setLang(l)

  return (
    <div style={s.root}>
      <div style={s.accentLine} />

      {/* NAV */}
      <nav style={s.nav} className="hub-nav">
        <div style={s.navLeft} onClick={() => go('home')}>
          <span style={s.navLogo}>Industrial Cutting Labs<span style={s.navAccent}>.</span></span>
        </div>
        {/* Mobile hamburger — visible only on mobile via CSS */}
        <button className="hub-menu-btn" onClick={() => setMobileMenuOpen(v => !v)} style={{
          display: 'none', background: 'none', border: `0.5px solid ${C.border}`,
          color: C.t65, padding: '5px 10px', borderRadius: 3, cursor: 'pointer',
          fontSize: 14, fontFamily: "'DM Sans', sans-serif",
        }}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
        <div style={s.navLinks} className="hub-nav-links">
          {['home','labs','media','newsletter','coolhub','about'].map(p => (
            <button key={p} style={s.navBtn(page === p)} onClick={() => go(p)}>
              {t.nav[p] || p}
              {(p === 'media' || p === 'coolhub') && <span style={s.soonBadge}>{t.nav.soon}</span>}
            </button>
          ))}
          <div style={s.langSw}>
            {['en','pt','es'].map(l => (
              <button key={l} style={s.langBtn(lang === l)} onClick={() => changeLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button style={s.themeBtn} onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
          <button style={s.talkBtn} onClick={() => go('talk')}>{t.nav.talk}</button>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="hub-mobile-menu" style={{
          display: 'none', flexDirection: 'column', background: C.bg2, borderBottom: `0.5px solid ${C.border}`,
        }}>
          {['home','labs','media','newsletter','coolhub','about','talk'].map(p => (
            <button key={p} onClick={() => go(p)} style={{
              ...s.navBtn(page === p), padding: '14px 20px', textAlign: 'left',
              borderBottom: `0.5px solid ${C.border}`, borderRadius: 0, width: '100%',
              fontSize: 12, letterSpacing: '0.5px',
            }}>
              {t.nav[p] || p}
            </button>
          ))}
          <div style={{ padding: '10px 16px', display: 'flex', gap: 6, borderTop: `0.5px solid ${C.border}` }}>
            {['en','pt','es'].map(l => (
              <button key={l} onClick={() => changeLang(l)} style={{
                ...s.langBtn(lang === l), padding: '5px 10px', fontSize: 10,
              }}>{l.toUpperCase()}</button>
            ))}
            <button style={{ ...s.themeBtn, marginLeft: 'auto' }} onClick={toggleTheme}>
              {theme === 'dark' ? '☀' : '🌙'}
            </button>
          </div>
        </div>
      )}

      {/* PAGES */}
      {page === 'home'       && <HomePage       t={t} go={go} s={s} C={C} />}
      {page === 'labs'       && <LabsPage        t={t} go={go} s={s} C={C} />}
      {page === 'media'      && <MediaPage       t={t} s={s} />}
      {page === 'newsletter' && <NewsletterPage  t={t} s={s} />}
      {page === 'coolhub'    && <CoolHubPage     t={t} s={s} C={C} />}
      {page === 'about'      && <AboutPage       t={t} s={s} />}
      {page === 'talk'       && <TalkPage        t={t} s={s} C={C} />}

      <footer style={s.footer} className="hub-footer">
        <span style={s.fc}>{t.footer.copy}</span>
        <div style={s.fd} />
        <span style={s.fc}>{t.footer.tag}</span>
      </footer>
    </div>
  )
}

function HomePage({ t, go, s, C }) {
  const h = t.home
  const sections = [
    { id: 'labs', label: h.hsl, title: h.hst, icon: '⚡', feat: true },
    { id: 'media', label: h.hml, title: h.hmt, icon: '▶', soon: true },
    { id: 'newsletter', label: h.hnl, title: h.hnt, icon: '✦' },
    { id: 'coolhub', label: 'Cool Hub', title: 'Unexpected finds from the field', icon: '◈', soon: true },
    { id: 'talk', label: h.htl, title: h.htt, icon: '◎' },
  ]
  return (
    <div>
      <div style={s.homeHero} className="hub-home-hero">
        <div>
          <div style={s.eyebrow}><span style={s.eyebrowLine} />Industrial Cutting Labs</div>
          <h1 style={s.heroH1} className="hub-home-h1">
            <span style={s.heroL1}>{h.l1}</span>
            <span style={s.heroL2}>{h.l2}</span>
            <span style={s.heroL3}>{h.l3}</span>
          </h1>
          <p style={s.heroBody}>{h.body}</p>
          <div style={s.heroActions}>
            <button style={s.btnPrimary} onClick={() => go('labs')}>{h.cta1}</button>
            <button style={s.btnGhost} onClick={() => go('about')}>{h.cta2}</button>
          </div>
        </div>
        <div className="hub-home-right">
          <div style={s.heroSections}>
            {sections.map(sec => (
              <div key={sec.id} style={s.hsec(sec.feat)} onClick={() => go(sec.id)}>
                <div style={s.hsecIcon(sec.feat)}>{sec.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.hsecLabel(sec.feat)}>{sec.label}</div>
                  <div style={s.hsecTitle}>{sec.title}</div>
                </div>
                {sec.soon ? <span style={s.soonPill}>{h.soon}</span> : <span style={s.secArrow}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={s.stats} className="hub-stats">
        {[
          { val: '3', label: h.st },
          { val: '12', label: h.sy },
          { val: '4', label: h.sc },
          { val: '∞', label: h.sv },
        ].map((st, i) => (
          <div key={i} style={s.stat(i < 3)} className="hub-stat">
            <div style={s.statN}>{st.val}</div>
            <div style={s.statL}>{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LabsPage({ t, go, s, C }) {
  const l = t.labs
  return (
    <div>
      <div style={s.ph} className="hub-ph">
        <div style={s.pl}><span style={s.plLine} />{l.label}</div>
        <h1 style={s.ph1}>{l.title}</h1>
        <p style={s.pd}>{l.desc}</p>
      </div>

      <div style={s.disclaimer} className="hub-disclaimer">
        <span style={s.discIcon}>⚠</span>
        <span style={s.discText}>{l.disclaimer}</span>
      </div>

      <div style={s.labsGrid} className="hub-labs-grid">
        {/* IGNITE — live */}
        <div style={{ ...s.tc(true, false), gridColumn: 'span 1' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #d4541a 0%, rgba(212,84,26,0.4) 60%, transparent 100%)', borderRadius: '4px 4px 0 0' }} />
          <div style={{ position: 'absolute', top: -10, right: -10, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,84,26,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 14, right: 20, fontSize: 54, lineHeight: 1, opacity: 0.22, pointerEvents: 'none', userSelect: 'none', filter: 'drop-shadow(0 0 12px rgba(212,84,26,0.5))' }}>⚡</div>
          <div style={s.ts}><span style={s.dotLive} />{l.live}</div>
          <div style={s.tn(false)}>{l.igniteName}</div>
          <p style={s.tdesc}>{l.igniteDesc}</p>
          <div style={s.tags}>
            {['Plasma', 'Shipbuilding', 'PDF Export', 'EN / ES / PT'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
          <ReliabilityBadge level={4} l={l} />
          <button style={{ ...s.tcta, marginTop: 12 }} onClick={() => window.open(IGNITE_URL, '_self')}>{l.igniteCta}</button>
        </div>

        {/* CUTWISE — live */}
        <div style={s.tc(false, false)}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #378ADD 0%, rgba(55,138,221,0.35) 60%, transparent 100%)', borderRadius: '4px 4px 0 0' }} />
          <div style={{ position: 'absolute', top: -10, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle, rgba(55,138,221,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 14, right: 16, opacity: 0.22, pointerEvents: 'none', filter: 'drop-shadow(0 0 8px rgba(55,138,221,0.45))' }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="1.1" strokeLinecap="round">
              <circle cx="12" cy="12" r="8"/>
              <circle cx="12" cy="12" r="2.5" fill="#378ADD" stroke="none"/>
              <line x1="12" y1="2" x2="12" y2="6.5"/>
              <line x1="12" y1="17.5" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="6.5" y2="12"/>
              <line x1="17.5" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
          <div style={s.ts}><span style={s.dotLive} />{l.live}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ ...s.tn(false), marginBottom: 0 }}>{l.cutwiseName}</span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(252,211,77,0.12)', color: '#FCD34D', padding: '2px 7px', borderRadius: 2, border: '0.5px solid rgba(252,211,77,0.3)' }}>Beta</span>
          </div>
          <p style={s.tdesc}>{l.cutwiseDesc}</p>
          <div style={s.tags}>
            <span style={s.tagAmber}>Experimental</span>
            {['Plasma', 'Waterjet', 'Laser', 'Oxyfuel'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
          <ReliabilityBadge level={2} l={l} />
          <button style={{ ...s.tcta, marginTop: 12 }} onClick={() => window.open('https://cutwise.industrialcuttinglabs.com', '_self')}>{l.igniteCta.replace('calculator', 'selector')}</button>
        </div>

        {/* JETCALC — live */}
        <div style={s.tc(false, false)}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #1e6ab5 0%, rgba(30,106,181,0.35) 60%, transparent 100%)', borderRadius: '4px 4px 0 0' }} />
          <div style={{ position: 'absolute', top: -10, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,106,181,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 48, lineHeight: 1, opacity: 0.18, pointerEvents: 'none', userSelect: 'none', filter: 'drop-shadow(0 0 10px rgba(30,106,181,0.5))' }}>💧</div>
          <div style={s.ts}><span style={s.dotLive} />{l.live}</div>
          <div style={s.tn(false)}>{l.jetcalcName}</div>
          <p style={s.tdesc}>{l.jetcalcDesc}</p>
          <div style={s.tags}>
            {['Waterjet', '84 Materials', 'Metric & Imperial', 'EN / ES / PT'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
          <ReliabilityBadge level={5} l={l} />
          <button style={{ ...s.tcta, marginTop: 12 }} onClick={() => window.open('https://jetcalc.industrialcuttinglabs.com', '_self')}>{l.jetcalcCta}</button>
        </div>

        {/* CUTBOT AI — concept */}
        <div style={{ ...s.tc(false, false), opacity: 0.35 }}>
          <div style={s.ts}><span style={s.dotPlan} />{l.exploring}</div>
          <div style={s.tn(false)}>{l.cutbotName}</div>
          <p style={s.tdesc}>{l.cutbotDesc}</p>
          <div style={s.tags}>
            {['AI', 'Plasma', 'Waterjet', 'Laser'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
          <ReliabilityBadge level={1} l={l} />
        </div>

        {/* FLARE — live */}
        <div style={s.tc(false, false)}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #d4541a 0%, rgba(212,84,26,0.35) 60%, transparent 100%)', borderRadius: '4px 4px 0 0' }} />
          <div style={{ position: 'absolute', top: -10, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,84,26,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 48, lineHeight: 1, opacity: 0.22, pointerEvents: 'none', userSelect: 'none', filter: 'drop-shadow(0 0 10px rgba(212,84,26,0.5))' }}>🔥</div>
          <div style={s.ts}><span style={s.dotLive} />{l.live}</div>
          <div style={s.tn(false)}>{l.flareName}</div>
          <p style={s.tdesc}>{l.flareDesc}</p>
          <div style={s.tags}>
            {['Plasma', 'Oil & Gas', 'Refinery', 'EN / ES / PT'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
          <ReliabilityBadge level={3} l={l} />
          <button style={{ ...s.tcta, marginTop: 12 }} onClick={() => window.open('https://flare.industrialcuttinglabs.com', '_self')}>{l.flareCta}</button>
        </div>

        {/* CUTBENCH — live */}
        <div style={s.tc(false, false)}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #4db6ac 0%, rgba(77,182,172,0.35) 60%, transparent 100%)', borderRadius: '4px 4px 0 0' }} />
          <div style={{ position: 'absolute', top: -10, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle, rgba(77,182,172,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 48, lineHeight: 1, opacity: 0.2, pointerEvents: 'none', userSelect: 'none', filter: 'drop-shadow(0 0 10px rgba(77,182,172,0.4))' }}>⚖️</div>
          <div style={s.ts}><span style={s.dotLive} />{l.live}</div>
          <div style={s.tn(false)}>{l.cutbenchName}</div>
          <p style={s.tdesc}>{l.cutbenchDesc}</p>
          <div style={s.tags}>
            {['Plasma', 'Laser', 'Waterjet', 'Oxyfuel'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
          <ReliabilityBadge level={3} l={l} />
          <button style={{ ...s.tcta, marginTop: 12 }} onClick={() => window.open('https://cutbench.industrialcuttinglabs.com', '_self')}>{l.cutbenchCta}</button>
        </div>

        {/* PLACEHOLDER — more coming */}
        <div style={{ border: `0.5px dashed ${C.t06}`, borderRadius: 4, padding: '22px 20px', background: 'transparent', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8, opacity: 0.3 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `0.5px dashed ${C.t22}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16, color: C.t32, lineHeight: 1 }}>+</span>
          </div>
          <div style={{ fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.t22 }}>More coming</div>
        </div>
      </div>

      <div style={s.fbBanner} className="hub-fb-banner">
        <div style={s.fbMain}>
          <div style={s.fbTitle}>{l.feedbackTitle}</div>
          <div style={s.fbSub}>{l.feedbackSub}</div>
        </div>
        <button style={s.fbCtaBtn} onClick={() => go('talk')}>{l.feedbackCta}</button>
      </div>
    </div>
  )
}

function MediaPage({ t, s }) {
  const m = t.media
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  async function handleNotify() {
    if (!email.includes('@')) return
    await saveLead({ email, source: 'media' })
    setDone(true)
  }

  return (
    <div>
      <div style={s.ph} className="hub-ph">
        <div style={s.pl}><span style={s.plLine} />{m.label}</div>
        <h1 style={s.ph1}>{m.title}</h1>
      </div>
      <div style={s.mediaPg}>
        <div style={s.mediaRing}><div style={s.mediaPlay} /></div>
        <p style={s.mediaSoon}>{m.coming}</p>
        <p style={s.mediaDesc}>{m.desc}</p>
        {!done ? (
          <>
            <p style={s.notifyLbl}>{m.notifyLabel}</p>
            <div style={s.notifyForm}>
              <input style={s.notifyInput} type="email" placeholder={m.placeholder} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleNotify()} />
              <button style={s.notifyBtn} onClick={handleNotify}>{m.notifyBtn}</button>
            </div>
          </>
        ) : (
          <p style={{ fontSize: 12, color: s.notifyLbl.color, letterSpacing: '0.5px' }}>✓ Got it — you'll hear from us first.</p>
        )}
      </div>
    </div>
  )
}

// Newsletter images — decorative strip (order doesn't matter, just visual color)
const NL_IMAGES = [
  '/newsletter/01.jpg',
  '/newsletter/02.jpg',
  '/newsletter/03.jpg',
  '/newsletter/04.jpg',
  '/newsletter/05.jpg',
  '/newsletter/06.jpg',
  '/newsletter/08.jpg',
  '/newsletter/09.jpg',
  '/newsletter/10.jpg',
  '/newsletter/11.jpg',
  '/newsletter/12.jpg',
]

function NewsletterPage({ t, s }) {
  const n = t.newsletter
  const issues = [
    { num: 'Apr 9, 2026',  title: 'Plasma 101 — Part 3: Consumables' },
    { num: 'Apr 2, 2026',  title: 'Plasma 101 — Part 2: Gases' },
    { num: 'Mar 26, 2026', title: 'Plasma 101 — Part 1: What Fast Five Got (Surprisingly) Right' },
    { num: 'Mar 19, 2026', title: 'Shipbuilding Is Not a Cutting Problem.' },
    { num: 'Mar 12, 2026', title: 'How to Fix Your Cutting Operations in 1 Day' },
    { num: 'Mar 5, 2026',  title: 'What 3D Printing Got Right That Industrial Cutting Still Gets Wrong' },
    { num: 'Feb 26, 2026', title: 'Simplifying Industrial Networking with Plasma' },
    { num: 'Feb 12, 2026', title: 'Why Uptime, Not Innovation, Determines Who Wins in Industrial Cutting' },
    { num: 'Feb 5, 2026',  title: 'Cutting Process Calculators' },
    { num: 'Jan 29, 2026', title: 'Plasma Cutting Exotic Metals: Practical Guidelines When No Cut Charts Exist' },
    { num: 'Jan 22, 2026', title: 'Marking with Plasma' },
  ]
  // duplicate for seamless infinite scroll
  const strip = [...NL_IMAGES, ...NL_IMAGES]

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ ...s.ph, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }} className="hub-ph hub-nl-header">
        <div>
          <div style={s.pl}><span style={s.plLine} />{n.label}</div>
          <h1 style={{ ...s.ph1, marginBottom: 6 }}>{n.title}</h1>
          <p style={{ ...s.pd, marginBottom: 0 }}>{n.desc}</p>
        </div>
        <button style={{ ...s.liBtn, flexShrink: 0 }} onClick={() => window.open(NL_URL, '_blank')}>
          <div style={s.liIcon}><span style={s.liIn}>in</span></div>
          {n.cta}
        </button>
      </div>

      {/* Scrolling image strip */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 200, margin: '0 0 0' }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${s.root.background}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(270deg, ${s.root.background}, transparent)`, zIndex: 2, pointerEvents: 'none' }} />
        {/* Scrolling track */}
        <div className="hub-nl-strip">
          {strip.map((src, i) => (
            <div key={i} style={{ flexShrink: 0, width: 320, height: 200, overflow: 'hidden', borderRadius: 3 }}>
              <img
                src={src}
                alt=""
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.75 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Editions list + subscribe col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, padding: '32px 48px 0' }} className="hub-2col">
        <div>
          <div style={{ ...s.pl, marginBottom: 10 }}><span style={s.plLine} />{n.recent}</div>
          <div style={s.nlIssues}>
            {issues.map((issue, i) => (
              <div key={i} style={s.nlIssue} onClick={() => window.open(NL_URL, '_blank')}>
                <div style={s.nlINum}>{issue.num}</div>
                <div style={s.nlITitle}>{issue.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ paddingTop: 32 }}>
          <div style={s.nlN}>11</div>
          <p style={s.nlDesc}>{n.desc2 || 'Biweekly deep-dives on plasma, laser, waterjet and oxyfuel — applications, trade-offs, and decision-making for people who actually work with these machines.'}</p>
          <div style={{ fontSize: 11, color: s.statL.color, letterSpacing: '1px', marginBottom: 16, textTransform: 'uppercase' }}>520 subscribers · biweekly</div>
          <button style={s.liBtn} onClick={() => window.open(NL_URL, '_blank')}>
            <div style={s.liIcon}><span style={s.liIn}>in</span></div>
            {n.cta}
          </button>
        </div>
      </div>
    </div>
  )
}

// Artists pending review — will be added back one by one after curation
const CUTTING_ARTISTS = []

const chCategories = [
  {
    icon: '✦',
    label: 'Cutting Art',
    desc: 'Artists and fabricators using plasma, laser, and waterjet as a medium. Decorative panels, sculptures, architectural pieces that started as a cut.',
    accent: true,
  },
  {
    icon: '◎',
    label: 'Accidental Aesthetics',
    desc: 'Slag patterns, dross formations, kerf textures, heat tints — things that happen as a byproduct of cutting and end up looking like abstract art.',
    accent: false,
  },
  {
    icon: '⚡',
    label: 'Unexpected Applications',
    desc: 'Plasma cutting gelo. Waterjet em queijo. Laser em couro. Industrial processes showing up where you least expect them.',
    accent: false,
  },
  {
    icon: '◈',
    label: 'Field Finds',
    desc: "Things I actually saw in the field — unusual machines, ingenious workarounds, setups that shouldn't exist but work perfectly.",
    accent: false,
  },
  {
    icon: '▲',
    label: 'Process Beauty',
    desc: 'Long-exposure cuts, plasma arc close-ups, the glow of a fresh kerf. The kind of photo that makes non-machinists stop scrolling.',
    accent: false,
  },
  {
    icon: '◻',
    label: 'Pop Culture & Crossovers',
    desc: 'Industrial cutting in movies, architecture, fashion, and design. Fast Five is just the beginning.',
    accent: false,
  },
  {
    icon: '?',
    label: "This Shouldn't Work But Does",
    desc: 'Non-conventional solutions the industry quietly uses. The kind of thing nobody teaches in training but everyone knows works.',
    accent: false,
  },
]

function CuttingArtGallery({ onClose, C }) {
  const [hovered, setHovered] = useState(null)
  return (
    <div style={{ padding: '0 48px 48px' }} className="hub-gallery">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, paddingTop: 4 }} className="hub-gallery-head">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3, color: C.hi }}>
            Cutting Art
          </div>
          <div style={{ fontSize: 10, color: C.t25, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            10 artists
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: `0.5px solid ${C.border}`, color: C.t40, fontSize: 11, padding: '4px 12px', borderRadius: 3, cursor: 'pointer', letterSpacing: '0.5px' }}>
          ✕ close
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ marginBottom: 20, fontSize: 11, color: C.t22, lineHeight: 1.6, maxWidth: 640, borderLeft: `2px solid rgba(212,84,26,0.3)`, paddingLeft: 10 }}>
        No affiliation, sponsorship, or commercial relationship with any of these artists.
        I just think what they make is incredible — and figured others in this industry should know their work exists.
      </div>

      {/* Gallery grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }} className="hub-gallery-grid">
        {CUTTING_ARTISTS.map((artist, i) => (
          <a
            key={artist.name}
            href={artist.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ textDecoration: 'none', display: 'block', borderRadius: 4, overflow: 'hidden', position: 'relative', aspectRatio: '4/3', cursor: 'pointer' }}
          >
            <img
              src={artist.img}
              alt={artist.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: hovered === i ? 'brightness(0.45)' : 'brightness(0.6)', transition: 'filter 0.3s' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '20px 12px 10px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            }}>
              <div style={{ fontSize: 10, color: C.accent, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2, fontWeight: 500 }}>{artist.tag}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 1.5, color: '#fff', lineHeight: 1 }}>{artist.name}</div>
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              opacity: hovered === i ? 1 : 0,
              transition: 'opacity 0.25s',
              padding: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: 10 }}>{artist.desc}</div>
              <div style={{ fontSize: 10, color: C.accent, letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                View work <span style={{ fontSize: 14 }}>→</span>
              </div>
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              border: `1.5px solid ${hovered === i ? 'rgba(212,84,26,0.6)' : C.t06}`,
              borderRadius: 4,
              transition: 'border-color 0.25s',
              pointerEvents: 'none',
            }} />
          </a>
        ))}
      </div>
    </div>
  )
}

function CoolHubPage({ s, C }) {
  const [galleryOpen, setGalleryOpen] = useState(false)

  const chCard = (accent, clickable) => ({
    border: `0.5px solid ${accent ? 'rgba(212,84,26,0.28)' : C.border}`,
    borderRadius: 4,
    padding: '22px 20px',
    background: accent ? 'linear-gradient(135deg, rgba(212,84,26,0.06) 0%, rgba(212,84,26,0.02) 100%)' : C.bg2,
    position: 'relative',
    overflow: 'hidden',
    cursor: clickable ? 'pointer' : 'default',
    transition: clickable ? 'border-color 0.2s' : 'none',
  })
  const chBar = (accent) => ({
    position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
    background: accent
      ? `linear-gradient(90deg, ${C.accent}, transparent)`
      : `linear-gradient(90deg, ${C.t07}, transparent)`,
    borderRadius: '4px 4px 0 0',
  })
  const chIcon = (accent) => ({
    width: 32, height: 32, borderRadius: 3,
    background: accent ? 'rgba(212,84,26,0.15)' : C.t05,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, marginBottom: 14, color: accent ? C.accent : C.t40,
  })

  return (
    <div>
      <div style={s.ph} className="hub-ph">
        <div style={s.pl}><span style={s.plLine} />Cool Hub</div>
        <h1 style={s.ph1}>Unexpected Finds</h1>
        <p style={{ ...s.pd, maxWidth: 580 }}>
          Art, oddities, and things you wouldn't expect to find in an industrial cutting context.
          Things I found in the field, or stumbled upon, that made me stop and think — or just smile.
          Curated from real experience. No sponsor, no agenda.
        </p>
      </div>

      {/* teaser banner */}
      <div style={{ margin: '20px 48px 4px', padding: '13px 18px', background: 'rgba(212,84,26,0.04)', border: `0.5px solid rgba(212,84,26,0.12)`, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 12 }} className="hub-ch-teaser">
        <span style={{ fontSize: 11, color: C.t22 }}>◈</span>
        <span style={{ fontSize: 12, color: C.t38, fontWeight: 300, lineHeight: 1.6 }}>
          All categories are being curated. Content drops as finds happen — no editorial schedule, no filler.
        </span>
      </div>

      {/* categories grid */}
      <div style={{ padding: '16px 48px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }} className="hub-3col">
        {chCategories.map((cat) => (
          <div
            key={cat.label}
            style={chCard(cat.accent, cat.accent && CUTTING_ARTISTS.length > 0)}
            onClick={cat.accent && CUTTING_ARTISTS.length > 0 ? () => setGalleryOpen(v => !v) : undefined}
          >
            <div style={chBar(cat.accent)} />
            <div style={chIcon(cat.accent)}>{cat.icon}</div>
            <div style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.t28, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: cat.accent ? C.accent : C.t18, display: 'inline-block' }} />
              {cat.accent && CUTTING_ARTISTS.length > 0 ? (galleryOpen ? 'Click to close' : 'Click to explore') : 'Building'}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: C.hi, marginBottom: 8, lineHeight: 1 }}>{cat.label}</div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* Cutting Art Gallery — opens below the grid */}
      {galleryOpen && (
        <div style={{ margin: '12px 0 0', borderTop: `0.5px solid rgba(212,84,26,0.2)`, paddingTop: 24 }} className="hub-ch-gallery">
          <CuttingArtGallery onClose={() => setGalleryOpen(false)} C={C} />
        </div>
      )}

      {!galleryOpen && <div style={{ paddingBottom: 28 }} />}
    </div>
  )
}

function AboutPage({ t, s }) {
  const a = t.about
  const values = [
    { t: a.v1t, d: a.v1d, n: '01' },
    { t: a.v2t, d: a.v2d, n: '02' },
    { t: a.v3t, d: a.v3d, n: '03' },
    { t: a.v4t, d: a.v4d, n: '04' },
  ]
  return (
    <div>
      <div style={s.ph} className="hub-ph">
        <div style={s.pl}><span style={s.plLine} />{a.label}</div>
        <h1 style={s.ph1}>{a.title}</h1>
        <p style={{ ...s.pd, maxWidth: 600 }}>{a.mission}</p>
      </div>
      <div style={s.valuesGrid} className="hub-values-grid">
        {values.map(v => (
          <div key={v.n} style={s.valCard}>
            <div style={s.valNum}>{v.n}</div>
            <div style={s.valTitle}>{v.t}</div>
            <p style={s.valDesc}>{v.d}</p>
          </div>
        ))}
      </div>
      <div style={s.authorStrip} className="hub-author-strip">
        <div style={s.authorDot} />
        <span style={s.authorTxt}>{a.author}</span>
      </div>
    </div>
  )
}

function TalkPage({ t, s, C }) {
  const tk = t.talk
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [done, setDone] = useState(false)

  async function handleSend() {
    if (!form.email.includes('@') || !form.message.trim()) return
    await saveMessage({ name: form.name, email: form.email, message: form.message })
    setDone(true)
  }

  return (
    <div style={s.talkPg} className="hub-2col">
      <div>
        <div style={s.pl}><span style={s.plLine} />{tk.label}</div>
        <h1 style={s.ph1}>{tk.title}</h1>
        <p style={s.pd}>{tk.desc}</p>
        <div style={s.channels}>
          <div style={s.channel} onClick={() => window.open(LI_URL, '_blank')}>
            <div style={s.chDot('#0077b5')} />
            <div style={s.chInfo}>
              <div style={s.chLabel}>LinkedIn</div>
              <div style={s.chVal}>Gui Rossi</div>
            </div>
            <span style={s.chArr}>→</span>
          </div>
          <div style={s.channel} onClick={() => window.open(`mailto:gui@industrialcuttinglabs.com`)}>
            <div style={s.chDot(C.accent)} />
            <div style={s.chInfo}>
              <div style={s.chLabel}>Email</div>
              <div style={s.chVal}>gui@industrialcuttinglabs.com</div>
            </div>
            <span style={s.chArr}>→</span>
          </div>
        </div>
      </div>
      {!done ? (
        <div style={s.talkForm}>
          <div style={s.ff}><label style={s.fl}>{tk.nameLbl}</label><input style={s.fi} type="text" placeholder={tk.namePh} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div style={s.ff}><label style={s.fl}>{tk.emailLbl}</label><input style={s.fi} type="email" placeholder={tk.emailPh} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div style={s.ff}><label style={s.fl}>{tk.msgLbl}</label><textarea style={{ ...s.fi, ...s.fta }} placeholder={tk.msgPh} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} /></div>
          <button style={s.fsub} onClick={handleSend}>{tk.send}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 24 }}>
          <span style={{ fontSize: 13, color: s.pd.color }}>✓ Message received — I'll get back to you.</span>
        </div>
      )}
    </div>
  )
}
