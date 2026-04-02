import { useState, useEffect } from 'react'
import { LanguageContext, UnitContext } from './lib/contexts'
import { runCalculation } from './lib/calculations'
import LandingPage from './components/LandingPage'
import CalculatorForm from './components/CalculatorForm'
import EmailGate from './components/EmailGate'
import ResultsPage from './components/ResultsPage'
import Footer from './components/Footer'

// Detect metric vs imperial from browser locale
function detectUnit() {
  try {
    const locale = navigator.language || 'en-US'
    const imperial = ['en-US', 'en-LR', 'en-MM']
    return imperial.some(l => locale.startsWith(l.split('-')[0]) && locale === l) ? 'imperial' : 'metric'
  } catch {
    return 'metric'
  }
}

// Detect language
function detectLang() {
  try {
    const l = navigator.language.split('-')[0]
    return ['en', 'pt', 'es'].includes(l) ? l : 'en'
  } catch {
    return 'en'
  }
}

export default function App() {
  const [step, setStep] = useState('landing')   // landing | form | gate | results
  const [lang, setLang] = useState(detectLang)
  const [unit, setUnit] = useState(detectUnit)
  const [formData, setFormData] = useState(null)
  const [results, setResults] = useState(null)

  function handleFormSubmit(data) {
    setFormData(data)
    setStep('gate')
  }

  function handleUnlock() {
    try {
      const res = runCalculation(formData, unit === 'metric')
      setResults(res)
      setStep('results')
    } catch (err) {
      console.error('Calculation error:', err)
    }
  }

  function handleReset() {
    setFormData(null)
    setResults(null)
    setStep('landing')
  }

  return (
    <LanguageContext.Provider value={lang}>
      <UnitContext.Provider value={unit}>
        <div className="app">
          {step === 'landing' && (
            <LandingPage
              onStart={() => setStep('form')}
              lang={lang}
              setLang={setLang}
              unit={unit}
              setUnit={setUnit}
            />
          )}

          {step === 'form' && (
            <CalculatorForm
              lang={lang}
              unit={unit}
              onSubmit={handleFormSubmit}
            />
          )}

          {step === 'gate' && (
            <>
              <CalculatorForm
                lang={lang}
                unit={unit}
                onSubmit={handleFormSubmit}
              />
              <EmailGate lang={lang} onUnlock={handleUnlock} />
            </>
          )}

          {step === 'results' && (
            <ResultsPage
              lang={lang}
              unit={unit}
              results={results}
              formInputs={formData}
              onReset={handleReset}
            />
          )}

          <Footer />
        </div>
      </UnitContext.Provider>
    </LanguageContext.Provider>
  )
}
