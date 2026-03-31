import { useState } from 'react'
import { translations, detectLang } from './i18n/translations'

const NL_URL = 'https://www.linkedin.com/newsletters/7419724116267520000/?displayConfirmation=true'
const LI_URL = 'https://www.linkedin.com/in/guivrossi/'
const IGNITE_URL = '/labs/ignite'

const C = {
  bg: '#0a0c0f', bg2: '#0e1015', bg3: '#13161c',
  text: '#e8e3d8', muted: 'rgba(232,227,216,0.45)',
  accent: '#d4541a', border: 'rgba(255,255,255,0.08)',
  borderHi: 'rgba(255,255,255,0.15)',
}

const s = {
  root: { background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' },
  accentLine: { height: 2, background: `linear-gradient(90deg, transparent, ${C.accent}, #f5a623, transparent)` },

  // NAV
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 56, borderBottom: `0.5px solid ${C.border}` },
  navLeft: { display: 'flex', alignItems: 'baseline', gap: 8, cursor: 'pointer' },
  navLogo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3, color: '#fff' },
  navAccent: { color: C.accent },
  navLinks: { display: 'flex', alignItems: 'center', gap: 2 },
  navBtn: (active) => ({ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase', color: active ? '#fff' : 'rgba(255,255,255,0.65)', background: active ? 'rgba(255,255,255,0.1)' : 'none', border: 'none', cursor: 'pointer', padding: '5px 11px', borderRadius: 3 }),
  soonBadge: { fontSize: 7, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', padding: '2px 4px', borderRadius: 2, marginLeft: 4, verticalAlign: 'middle' },
  langSw: { display: 'flex', gap: 2, marginLeft: 8, borderLeft: `0.5px solid ${C.border}`, paddingLeft: 10 },
  langBtn: (active) => ({ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '1px', color: active ? '#fff' : 'rgba(255,255,255,0.4)', background: active ? 'rgba(255,255,255,0.12)' : 'none', border: 'none', cursor: 'pointer', padding: '3px 6px', borderRadius: 2 }),
  talkBtn: { fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase', background: C.accent, color: '#fff', border: 'none', padding: '7px 18px', borderRadius: 3, cursor: 'pointer', marginLeft: 10 },

  // HOME
  homeHero: { padding: '52px 48px 0', display: 'grid', gridTemplateColumns: '1fr 390px', gap: 52, alignItems: 'start' },
  eyebrow: { fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: C.accent, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  eyebrowLine: { display: 'inline-block', width: 20, height: 1, background: C.accent },
  heroH1: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.9, letterSpacing: 2, marginBottom: 20 },
  heroL1: { display: 'block', color: '#fff' },
  heroL2: { display: 'block', color: 'rgba(255,255,255,0.18)' },
  heroL3: { display: 'block', color: 'rgba(255,255,255,0.07)' },
  heroBody: { fontSize: 14, lineHeight: 1.8, color: C.muted, fontWeight: 300, maxWidth: 390, marginBottom: 28 },
  heroActions: { display: 'flex', gap: 10, alignItems: 'center' },
  btnPrimary: { fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', background: C.accent, color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 3, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  btnGhost: { fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', background: 'none', color: 'rgba(255,255,255,0.5)', border: `0.5px solid rgba(255,255,255,0.18)`, padding: '11px 20px', borderRadius: 3, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  heroSections: { display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.05)', border: `0.5px solid ${C.border}`, borderRadius: 4, overflow: 'hidden', marginTop: 6 },
  hsec: (feat) => ({ background: feat ? 'rgba(212,84,26,0.06)' : C.bg2, padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }),
  hsecIcon: (feat) => ({ width: 28, height: 28, borderRadius: 3, background: feat ? 'rgba(212,84,26,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }),
  hsecLabel: (feat) => ({ fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: feat ? C.accent : 'rgba(255,255,255,0.32)', marginBottom: 2 }),
  hsecTitle: { fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)' },
  soonPill: { fontSize: 7, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', padding: '2px 6px', borderRadius: 2 },
  secArrow: { fontSize: 12, color: 'rgba(255,255,255,0.25)' },

  stats: { display: 'flex', padding: '36px 48px 0', borderTop: `0.5px solid ${C.border}`, marginTop: 40 },
  stat: (border) => ({ flex: 1, paddingBottom: 20, ...(border ? { borderRight: `0.5px solid ${C.border}`, paddingRight: 28, marginRight: 28 } : {}) }),
  statN: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 2, color: '#fff', lineHeight: 1, marginBottom: 3 },
  statL: { fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' },

  // PAGE SHARED
  ph: { padding: '40px 48px 28px', borderBottom: `0.5px solid ${C.border}` },
  pl: { fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: C.accent, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 },
  plLine: { display: 'inline-block', width: 16, height: 1, background: C.accent },
  ph1: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 46, letterSpacing: 2, color: '#fff', lineHeight: 1, marginBottom: 10 },
  pd: { fontSize: 13, color: C.muted, fontWeight: 300, lineHeight: 1.8, maxWidth: 520 },

  // LABS
  disclaimer: { margin: '16px 48px 0', padding: '11px 16px', background: 'rgba(255,255,255,0.03)', border: `0.5px solid ${C.border}`, borderRadius: 3, display: 'flex', gap: 10, alignItems: 'flex-start' },
  discIcon: { fontSize: 11, color: 'rgba(255,255,255,0.28)', flexShrink: 0, marginTop: 1 },
  discText: { fontSize: 12, color: 'rgba(255,255,255,0.32)', lineHeight: 1.65, fontWeight: 300 },
  labsGrid: { padding: '20px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
  tc: (feat, building) => ({ border: `0.5px solid ${feat ? 'rgba(212,84,26,0.32)' : building ? 'rgba(212,84,26,0.15)' : C.border}`, borderRadius: 4, padding: '22px 20px', background: feat ? 'linear-gradient(135deg, #12100d 0%, #0e1015 100%)' : C.bg2, position: 'relative', gridColumn: feat ? 'span 2' : 'span 1' }),
  tcBar: (amber) => ({ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg, ${amber ? 'rgba(212,84,26,0.55)' : C.accent}, transparent)`, borderRadius: '4px 4px 0 0' }),
  ts: { fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)' },
  dotLive: { width: 4, height: 4, borderRadius: '50%', background: '#639922' },
  dotBuild: { width: 4, height: 4, borderRadius: '50%', background: C.accent, opacity: 0.7 },
  dotPlan: { width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' },
  tn: (feat) => ({ fontFamily: "'Bebas Neue', sans-serif", fontSize: feat ? 34 : 28, letterSpacing: 2, color: '#fff', marginBottom: 6, lineHeight: 1 }),
  tdesc: { fontSize: 12, color: 'rgba(232,227,216,0.42)', lineHeight: 1.6, marginBottom: 14, fontWeight: 300 },
  tags: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 },
  tag: { fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.32)', padding: '2px 7px', borderRadius: 2 },
  tagAmber: { fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(212,84,26,0.1)', color: 'rgba(212,84,26,0.7)', padding: '2px 7px', borderRadius: 2 },
  tcta: { fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif" },
  progressBar: { height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 14, overflow: 'hidden' },
  progressFill: { height: '100%', background: `linear-gradient(90deg, ${C.accent}, rgba(212,84,26,0.35))`, borderRadius: 2, width: '35%' },
  buildingSub: { fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(212,84,26,0.55)' },
  fbBanner: { margin: '0 48px 28px', padding: '14px 20px', background: 'rgba(212,84,26,0.04)', border: `0.5px solid rgba(212,84,26,0.14)`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  fbMain: { flex: 1 },
  fbTitle: { fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.72)', marginBottom: 3 },
  fbSub: { fontSize: 12, color: 'rgba(255,255,255,0.36)', lineHeight: 1.55, fontWeight: 300 },
  fbCtaBtn: { fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', color: C.accent, background: 'none', border: `0.5px solid rgba(212,84,26,0.35)`, padding: '7px 16px', borderRadius: 3, cursor: 'pointer', flexShrink: 0, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },

  // MEDIA
  mediaPg: { padding: '60px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 380 },
  mediaRing: { width: 72, height: 72, border: `0.5px solid rgba(255,255,255,0.1)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative' },
  mediaPlay: { width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '15px solid rgba(255,255,255,0.28)', marginLeft: 3 },
  mediaSoon: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 3, color: 'rgba(255,255,255,0.26)', marginBottom: 14 },
  mediaDesc: { fontSize: 13, color: C.muted, fontWeight: 300, lineHeight: 1.8, maxWidth: 420, marginBottom: 8 },
  notifyLbl: { fontSize: 10, letterSpacing: '1px', color: 'rgba(255,255,255,0.28)', marginBottom: 14, textTransform: 'uppercase' },
  notifyForm: { display: 'flex', gap: 7, width: '100%', maxWidth: 340 },
  notifyInput: { flex: 1, background: 'rgba(255,255,255,0.05)', border: `0.5px solid rgba(255,255,255,0.1)`, color: '#fff', padding: '9px 12px', borderRadius: 3, fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: 'none' },
  notifyBtn: { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', border: `0.5px solid rgba(255,255,255,0.1)`, padding: '9px 16px', borderRadius: 3, fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

  // NEWSLETTER
  nlPg: { padding: '56px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' },
  nlN: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 110, lineHeight: 0.85, color: 'rgba(255,255,255,0.03)', letterSpacing: 4, marginBottom: -18 },
  nlDesc: { fontSize: 13, color: C.muted, lineHeight: 1.8, fontWeight: 300, marginBottom: 28 },
  liBtn: { display: 'inline-flex', alignItems: 'center', gap: 9, background: '#0077b5', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 3, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  liIcon: { width: 15, height: 15, background: '#fff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  liIn: { fontSize: 9, fontWeight: 700, color: '#0077b5', fontFamily: 'serif', lineHeight: 1 },
  nlIssues: { display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginTop: 10 },
  nlIssue: { background: C.bg2, padding: '16px 18px', cursor: 'pointer' },
  nlINum: { fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: C.accent, marginBottom: 3 },
  nlITitle: { fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.78)', marginBottom: 3 },
  nlIMeta: { fontSize: 10, color: 'rgba(255,255,255,0.25)' },

  // ABOUT
  valuesGrid: { padding: '24px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  valCard: { border: `0.5px solid ${C.border}`, borderRadius: 4, padding: '24px 20px', background: C.bg2, position: 'relative', overflow: 'hidden' },
  valNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: 'rgba(255,255,255,0.04)', lineHeight: 1, position: 'absolute', top: 12, right: 16, letterSpacing: 2 },
  valTitle: { fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 8 },
  valDesc: { fontSize: 12, color: 'rgba(232,227,216,0.4)', lineHeight: 1.75, fontWeight: 300 },
  authorStrip: { margin: '0 48px 40px', borderTop: `0.5px solid ${C.border}`, paddingTop: 20, display: 'flex', alignItems: 'center', gap: 10 },
  authorDot: { width: 5, height: 5, borderRadius: '50%', background: C.accent, flexShrink: 0 },
  authorTxt: { fontSize: 11, color: 'rgba(255,255,255,0.28)' },

  // TALK
  talkPg: { padding: '56px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' },
  channels: { display: 'flex', flexDirection: 'column', gap: 9, marginTop: 24 },
  channel: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: `0.5px solid ${C.border}`, borderRadius: 4, background: C.bg2, cursor: 'pointer' },
  chDot: (color) => ({ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }),
  chInfo: { flex: 1 },
  chLabel: { fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 2 },
  chVal: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  chArr: { fontSize: 12, color: 'rgba(255,255,255,0.22)' },
  talkForm: { display: 'flex', flexDirection: 'column', gap: 10 },
  ff: { display: 'flex', flexDirection: 'column', gap: 4 },
  fl: { fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' },
  fi: { background: 'rgba(255,255,255,0.04)', border: `0.5px solid rgba(255,255,255,0.1)`, color: '#fff', padding: '9px 12px', borderRadius: 3, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none' },
  fta: { resize: 'none', height: 90, lineHeight: 1.6 },
  fsub: { background: C.accent, color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 3, fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", alignSelf: 'flex-start', marginTop: 3 },

  footer: { borderTop: `0.5px solid ${C.border}`, padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 },
  fc: { fontSize: 9, letterSpacing: '1px', color: 'rgba(255,255,255,0.18)' },
  fd: { width: 3, height: 3, borderRadius: '50%', background: C.accent },
}

export default function HubApp() {
  const [lang, setLang] = useState(detectLang)
  const [page, setPage] = useState('home')
  const t = translations[lang]

  const go = (p) => setPage(p)
  const changeLang = (l) => setLang(l)

  return (
    <div style={s.root}>
      <div style={s.accentLine} />

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.navLeft} onClick={() => go('home')}>
          <span style={s.navLogo}>Industrial Cutting Labs<span style={s.navAccent}>.</span></span>
        </div>
        <div style={s.navLinks}>
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
          <button style={s.talkBtn} onClick={() => go('talk')}>{t.nav.talk}</button>
        </div>
      </nav>

      {/* PAGES */}
      {page === 'home' && <HomePage t={t} go={go} />}
      {page === 'labs' && <LabsPage t={t} go={go} />}
      {page === 'media' && <MediaPage t={t} />}
      {page === 'newsletter' && <NewsletterPage t={t} />}
      {page === 'coolhub' && <CoolHubPage t={t} />}
      {page === 'about' && <AboutPage t={t} />}
      {page === 'talk' && <TalkPage t={t} />}

      <footer style={s.footer}>
        <span style={s.fc}>{t.footer.copy}</span>
        <div style={s.fd} />
        <span style={s.fc}>{t.footer.tag}</span>
      </footer>
    </div>
  )
}

function HomePage({ t, go }) {
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
      <div style={s.homeHero}>
        <div>
          <div style={s.eyebrow}><span style={s.eyebrowLine} />Industrial Cutting Labs</div>
          <h1 style={s.heroH1}>
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
        <div>
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
      <div style={s.stats}>
        {[
          { val: '2', label: h.st },
          { val: '12', label: h.sy },
          { val: '4', label: h.sc },
          { val: '∞', label: h.sv },
        ].map((st, i) => (
          <div key={i} style={s.stat(i < 3)}>
            <div style={s.statN}>{st.val}</div>
            <div style={s.statL}>{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LabsPage({ t, go }) {
  const l = t.labs
  return (
    <div>
      <div style={s.ph}>
        <div style={s.pl}><span style={s.plLine} />{l.label}</div>
        <h1 style={s.ph1}>{l.title}</h1>
        <p style={s.pd}>{l.desc}</p>
      </div>

      <div style={s.disclaimer}>
        <span style={s.discIcon}>⚠</span>
        <span style={s.discText}>{l.disclaimer}</span>
      </div>

      <div style={s.labsGrid}>
        {/* IGNITE — live, spans 2 cols */}
        <div style={s.tc(true, false)}>
          <div style={s.tcBar(false)} />
          <div style={s.ts}><span style={s.dotLive} />{l.live}</div>
          <div style={s.tn(true)}>{l.igniteName}</div>
          <p style={s.tdesc}>{l.igniteDesc}</p>
          <div style={s.tags}>
            {['Plasma', 'Shipbuilding', 'PDF Export', 'EN / ES / PT'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
          <button style={s.tcta} onClick={() => window.open(IGNITE_URL, '_self')}>{l.igniteCta}</button>
        </div>

        {/* CUTWISE — building */}
        <div style={s.tc(false, true)}>
          <div style={s.tcBar(true)} />
          <div style={s.ts}><span style={s.dotBuild} />{l.building}</div>
          <div style={s.tn(false)}>{l.cutwiseName}</div>
          <p style={s.tdesc}>{l.cutwiseDesc}</p>
          <div style={s.tags}>
            <span style={s.tagAmber}>Experimental</span>
            {['Plasma', 'Waterjet', 'Laser'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
          <div style={s.progressBar}><div style={s.progressFill} /></div>
          <span style={s.buildingSub}>{l.buildingSub}</span>
        </div>

        {/* CUTBOT AI — planned */}
        <div style={s.tc(false, false)}>
          <div style={s.ts}><span style={s.dotPlan} />{l.planned}</div>
          <div style={s.tn(false)}>{l.cutbotName}</div>
          <p style={s.tdesc}>{l.cutbotDesc}</p>
          <div style={s.tags}>
            {['AI', 'Plasma', 'Waterjet', 'Laser'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
        </div>

        {/* PROCESS FINDER — planned */}
        <div style={s.tc(false, false)}>
          <div style={s.ts}><span style={s.dotPlan} />{l.planned}</div>
          <div style={s.tn(false)}>{l.processFindName}</div>
          <p style={s.tdesc}>{l.processFindDesc}</p>
          <div style={s.tags}>
            {['Material', 'Thickness', 'Process'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
        </div>

        {/* PART FINDER — planned */}
        <div style={s.tc(false, false)}>
          <div style={s.ts}><span style={s.dotPlan} />{l.planned}</div>
          <div style={s.tn(false)}>{l.partFindName}</div>
          <p style={s.tdesc}>{l.partFindDesc}</p>
          <div style={s.tags}>
            {['Consumables', 'Part Number', 'Search'].map(tag => (
              <span key={tag} style={s.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={s.fbBanner}>
        <div style={s.fbMain}>
          <div style={s.fbTitle}>{l.feedbackTitle}</div>
          <div style={s.fbSub}>{l.feedbackSub}</div>
        </div>
        <button style={s.fbCtaBtn} onClick={() => go('talk')}>{l.feedbackCta}</button>
      </div>
    </div>
  )
}

function MediaPage({ t }) {
  const m = t.media
  return (
    <div>
      <div style={s.ph}>
        <div style={s.pl}><span style={s.plLine} />{m.label}</div>
        <h1 style={s.ph1}>{m.title}</h1>
      </div>
      <div style={s.mediaPg}>
        <div style={s.mediaRing}><div style={s.mediaPlay} /></div>
        <p style={s.mediaSoon}>{m.coming}</p>
        <p style={s.mediaDesc}>{m.desc}</p>
        <p style={s.notifyLbl}>{m.notifyLabel}</p>
        <div style={s.notifyForm}>
          <input style={s.notifyInput} type="email" placeholder={m.placeholder} />
          <button style={s.notifyBtn}>{m.notifyBtn}</button>
        </div>
      </div>
    </div>
  )
}

function NewsletterPage({ t }) {
  const n = t.newsletter
  const issues = [
    { num: 'Mar 30, 2026', title: 'Plasma 101 — Part 2: Gases', date: '5 min read' },
    { num: 'Mar 24, 2026', title: 'Plasma 101 — Part 1: What Fast Five Got (Surprisingly) Right', date: '5 min read' },
    { num: 'Mar 16, 2026', title: 'Shipbuilding Is Not a Cutting Problem.', date: '5 min read' },
    { num: 'Mar 9, 2026', title: 'What 3D Printing Got Right That Industrial Cutting Still Gets Wrong', date: '5 min read' },
    { num: 'Mar 9, 2026', title: 'How to Fix Your Cutting Operations in 1 Day', date: '4 min read' },
    { num: 'Feb 28, 2026', title: 'Simplifying Industrial Networking with Plasma', date: '6 min read' },
  ]
  return (
    <div style={s.nlPg}>
      <div>
        <div style={s.nlN}>01</div>
        <div style={s.pl}><span style={s.plLine} />{n.label}</div>
        <h1 style={s.ph1}>{n.title}</h1>
        <p style={s.nlDesc}>{n.desc}</p>
        <button style={s.liBtn} onClick={() => window.open(NL_URL, '_blank')}>
          <div style={s.liIcon}><span style={s.liIn}>in</span></div>
          {n.cta}
        </button>
      </div>
      <div>
        <div style={{ ...s.pl, marginBottom: 8 }}><span style={s.plLine} />{n.recent}</div>
        <div style={s.nlIssues}>
          {issues.map((issue, i) => (
            <div key={i} style={s.nlIssue} onClick={() => window.open(NL_URL, '_blank')}>
              <div style={s.nlINum}>{issue.num}</div>
              <div style={s.nlITitle}>{issue.title}</div>
              <div style={s.nlIMeta}>{issue.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
    desc: 'Things I actually saw in the field — unusual machines, ingenious workarounds, setups that shouldn\'t exist but work perfectly.',
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
    label: 'This Shouldn\'t Work But Does',
    desc: 'Non-conventional solutions the industry quietly uses. The kind of thing nobody teaches in training but everyone knows works.',
    accent: false,
  },
]

function CoolHubPage() {
  const chCard = (accent) => ({
    border: `0.5px solid ${accent ? 'rgba(212,84,26,0.28)' : C.border}`,
    borderRadius: 4,
    padding: '22px 20px',
    background: accent ? 'linear-gradient(135deg, #12100d 0%, #0e1015 100%)' : C.bg2,
    position: 'relative',
    overflow: 'hidden',
  })
  const chBar = (accent) => ({
    position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
    background: accent
      ? `linear-gradient(90deg, ${C.accent}, transparent)`
      : `linear-gradient(90deg, rgba(255,255,255,0.08), transparent)`,
    borderRadius: '4px 4px 0 0',
  })
  const chIcon = (accent) => ({
    width: 32, height: 32, borderRadius: 3,
    background: accent ? 'rgba(212,84,26,0.15)' : 'rgba(255,255,255,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, marginBottom: 14, color: accent ? C.accent : 'rgba(255,255,255,0.4)',
  })

  return (
    <div>
      <div style={s.ph}>
        <div style={s.pl}><span style={s.plLine} />Cool Hub</div>
        <h1 style={s.ph1}>Unexpected Finds</h1>
        <p style={{ ...s.pd, maxWidth: 580 }}>
          Art, oddities, and things you wouldn't expect to find in an industrial cutting context.
          Things I found in the field, or stumbled upon, that made me stop and think — or just smile.
          Curated from real experience. No sponsor, no agenda.
        </p>
      </div>

      {/* teaser banner */}
      <div style={{ margin: '20px 48px 4px', padding: '13px 18px', background: 'rgba(212,84,26,0.04)', border: `0.5px solid rgba(212,84,26,0.12)`, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>◈</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 300, lineHeight: 1.6 }}>
          All categories are being curated. Content drops as finds happen — no editorial schedule, no filler.
        </span>
      </div>

      {/* categories grid */}
      <div style={{ padding: '16px 48px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {chCategories.map((cat) => (
          <div key={cat.label} style={chCard(cat.accent)}>
            <div style={chBar(cat.accent)} />
            <div style={chIcon(cat.accent)}>{cat.icon}</div>
            <div style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'inline-block' }} />
              Building
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: '#fff', marginBottom: 8, lineHeight: 1 }}>{cat.label}</div>
            <p style={{ fontSize: 12, color: 'rgba(232,227,216,0.38)', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>{cat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutPage({ t }) {
  const a = t.about
  const values = [
    { t: a.v1t, d: a.v1d, n: '01' },
    { t: a.v2t, d: a.v2d, n: '02' },
    { t: a.v3t, d: a.v3d, n: '03' },
    { t: a.v4t, d: a.v4d, n: '04' },
  ]
  return (
    <div>
      <div style={s.ph}>
        <div style={s.pl}><span style={s.plLine} />{a.label}</div>
        <h1 style={s.ph1}>{a.title}</h1>
        <p style={{ ...s.pd, maxWidth: 600 }}>{a.mission}</p>
      </div>
      <div style={s.valuesGrid}>
        {values.map(v => (
          <div key={v.n} style={s.valCard}>
            <div style={s.valNum}>{v.n}</div>
            <div style={s.valTitle}>{v.t}</div>
            <p style={s.valDesc}>{v.d}</p>
          </div>
        ))}
      </div>
      <div style={s.authorStrip}>
        <div style={s.authorDot} />
        <span style={s.authorTxt}>{a.author}</span>
      </div>
    </div>
  )
}

function TalkPage({ t }) {
  const tk = t.talk
  return (
    <div style={s.talkPg}>
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
        </div>
      </div>
      <div style={s.talkForm}>
        <div style={s.ff}><label style={s.fl}>{tk.nameLbl}</label><input style={s.fi} type="text" placeholder={tk.namePh} /></div>
        <div style={s.ff}><label style={s.fl}>{tk.emailLbl}</label><input style={s.fi} type="email" placeholder={tk.emailPh} /></div>
        <div style={s.ff}><label style={s.fl}>{tk.msgLbl}</label><textarea style={{ ...s.fi, ...s.fta }} placeholder={tk.msgPh} /></div>
        <button style={s.fsub}>{tk.send}</button>
      </div>
    </div>
  )
}
