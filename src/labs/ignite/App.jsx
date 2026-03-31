import { useState, useEffect } from "react";
import './index.css';
import { LanguageContext, UnitContext } from "./lib/contexts";
import LandingPage from "./components/LandingPage";
import ApplicationSelector from "./components/ApplicationSelector";
import CalculatorForms from "./components/CalculatorForms";
import EmailGate from "./components/EmailGate";
import LoadingScreen from "./components/LoadingScreen";
import ReportPage from "./components/ReportPage";
import { saveLead } from "../../lib/supabase";

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

  async function handleEmailSubmit({ email, name, company }) {
    await saveLead({
      email,
      first_name: name,
      company,
      source: 'ignite',
      payload: { selected_apps: selectedApps }
    });
    setStep("loading");
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <UnitContext.Provider value={{ unit, setUnit }}>
        <div className="app-root">

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
              onNext={() => setStep("email")}
              onBack={() => setStep("select")}
            />
          )}

          {step === "email" && (
            <EmailGate
              onSubmit={handleEmailSubmit}
              onBack={() => setStep("calculate")}
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