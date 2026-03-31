import { useState, useEffect } from "react";
import './index.css';
import { LanguageContext, UnitContext } from "./lib/contexts";
import LandingPage from "./components/LandingPage";
import ApplicationSelector from "./components/ApplicationSelector";
import CalculatorForms from "./components/CalculatorForms";
import LoadingScreen from "./components/LoadingScreen";
import ReportPage from "./components/ReportPage";

export default function App() {
  const [lang, setLang] = useState("en");
  const [unit, setUnit] = useState("metric");
  const [step, setStep] = useState("landing");
  const [selectedApps, setSelectedApps] = useState([]);
  const [calcData, setCalcData] = useState({});

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) => {
        if (["US", "LR", "MM"].includes(d.country_code)) setUnit("imperial");
        else setUnit("metric");
      })
      .catch(() => {});
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <UnitContext.Provider value={{ unit, setUnit }}>
        <div className="app-root">

          {/* Back to ICL */}
          <a href="/"
            style={{
              position: 'fixed', top: 14, left: 16, zIndex: 9999,
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', letterSpacing: '0.3px',
              background: 'rgba(255,255,255,0.07)',
              border: '0.5px solid rgba(255,255,255,0.12)',
              padding: '4px 10px', borderRadius: 20,
              backdropFilter: 'blur(6px)',
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.13)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            ICL
          </a>

          {step === "landing" && (
            <LandingPage onStart={() => setStep("select")} />
          )}

          {step === "select" && (
            <ApplicationSelector
              selected={selectedApps}
              setSelected={setSelectedApps}
              onNext={() => setStep("calculate")}
              onBack={() => setStep("landing")}
            />
          )}

          {step === "calculate" && (
            <CalculatorForms
              apps={selectedApps}
              calcData={calcData}
              setCalcData={setCalcData}
              onNext={() => setStep("loading")}
              onBack={() => setStep("select")}
            />
          )}

          {step === "loading" && (
            <LoadingScreen lang={lang} onDone={() => setStep("report")} />
          )}

          {step === "report" && (
            <ReportPage
              apps={selectedApps}
              calcData={calcData}
              onRestart={() => {
                setStep("landing");
                setSelectedApps([]);
                setCalcData({});
              }}
            />
          )}

        </div>
      </UnitContext.Provider>
    </LanguageContext.Provider>
  );
}