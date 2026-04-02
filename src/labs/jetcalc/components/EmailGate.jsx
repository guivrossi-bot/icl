import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { t } from '../lib/translations'

export default function EmailGate({ lang, onUnlock }) {
  const tr = t[lang]
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email) return

    setLoading(true)
    setError('')

    try {
      await supabase.from('leads').insert([{
        email: form.email,
        company: form.company || null,
        source: 'jetcalc',
      }])
    } catch {
      // Non-blocking — proceed even if Supabase is unreachable
    }

    setLoading(false)
    onUnlock()
  }

  return (
    <div className="gate-overlay">
      <div className="gate-card">
        <div className="gate-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="var(--blue-100)" />
            <path d="M20 12l6 4v8l-6 4-6-4v-8l6-4z" fill="var(--blue-600)" />
          </svg>
        </div>
        <h2 className="gate-title">{tr.gateTitle}</h2>
        <p className="gate-sub">{tr.gateSubtitle}</p>

        <form className="gate-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>{tr.labelName}</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="John Smith"
            />
          </div>
          <div className="field">
            <label>{tr.labelEmail}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="john@company.com"
            />
          </div>
          <div className="field">
            <label>{tr.labelCompany}</label>
            <input
              type="text"
              value={form.company}
              onChange={e => set('company', e.target.value)}
              placeholder="Acme Waterjet Co."
            />
          </div>

          {error && <p className="gate-error">{error}</p>}

          <button type="submit" className="gate-submit" disabled={loading}>
            {loading ? '...' : tr.unlockBtn}
          </button>
        </form>

        <p className="gate-disclaimer">{tr.disclaimer}</p>
      </div>
    </div>
  )
}
