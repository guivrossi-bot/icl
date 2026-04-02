import { useLanguage } from '../lib/contexts'
import { t } from '../lib/translations'

export default function Footer() {
  const lang = useLanguage()
  const tr = t[lang]

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">JetCalc</span>
        <span className="footer-sep">·</span>
        <span className="footer-tagline">{tr.footerTagline}</span>
        <span className="footer-sep">·</span>
        <a href="/labs/ignite" className="footer-link">{tr.footerIgnite}</a>
      </div>
    </footer>
  )
}
