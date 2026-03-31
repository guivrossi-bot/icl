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

  const goToReport = () => setStep("report");

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
              onNext={() => setStep("loading")}
              onBack={() => setStep("select")}
            />
          )}

          {step === "loading" && (
            <LoadingScreen
              lang={lang}
              onDone={goToReport}
            />
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