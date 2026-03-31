import { useState, useEffect, useRef } from "react";

const FACTS = {
  en: [
    "The largest shipyard in the world can build a supertanker in just 3 months.",
    "A single shipyard welder can lay up to 3km of weld seams in a single day.",
    "Modern cargo ships use over 300km of welding seams in their construction.",
    "The world's largest ships are longer than the Empire State Building is tall.",
    "Over 50,000 commercial ships are currently sailing the world's oceans.",
    "A typical shipyard processes thousands of tons of steel plate every month.",
    "Shipbuilding accounts for over 90% of all international trade by volume.",
  ],
  es: [
    "El astillero mas grande del mundo puede construir un superpetrolero en solo 3 meses.",
    "Un soldador de astillero puede depositar hasta 3km de cordones de soldadura en un dia.",
    "Los buques de carga modernos usan mas de 300km de costuras de soldadura en su construccion.",
    "Los barcos mas grandes del mundo son mas largos que el Empire State Building de alto.",
    "Mas de 50.000 barcos comerciales navegan actualmente por los oceanos del mundo.",
    "Un astillero tipico procesa miles de toneladas de plancha de acero cada mes.",
    "La construccion naval representa mas del 90% de todo el comercio internacional.",
  ],
  pt: [
    "O maior estaleiro do mundo pode construir um superpetroleiro em apenas 3 meses.",
    "Um soldador de estaleiro pode depositar ate 3km de cordoes de solda em um unico dia.",
    "Navios de carga modernos usam mais de 300km de costuras de solda em sua construcao.",
    "Os maiores navios do mundo sao mais longos do que o Empire State Building e alto.",
    "Mais de 50.000 navios comerciais estao navegando pelos oceanos do mundo atualmente.",
    "Um estaleiro tipico processa milhares de toneladas de chapa de aco por mes.",
    "A construcao naval representa mais de 90% de todo o comercio internacional.",
  ],
};

const MESSAGES = {
  en: [
    "Igniting the calculations...",
    "Crunching your numbers...",
    "Mapping your savings...",
    "Making you more profitable...",
    "Almost ready...",
  ],
  es: [
    "Encendiendo los calculos...",
    "Procesando tus numeros...",
    "Mapeando tus ahorros...",
    "Haciendote mas rentable...",
    "Casi listo...",
  ],
  pt: [
    "Iniciando os calculos...",
    "Processando seus numeros...",
    "Mapeando suas economias...",
    "Tornando voce mais lucrativo...",
    "Quase pronto...",
  ],
};

const NEWSLETTER_URL = "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7419724116267520000";

export default function LoadingScreen({ lang, onDone }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const facts = FACTS[lang] || FACTS.en;
  const messages = MESSAGES[lang] || MESSAGES.en;
  const fact = useRef(facts[Math.floor(Math.random() * facts.length)]).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 9000);

    const msgTimer = setInterval(() => {
      setMsgIndex((prev) => Math.min(prev + 2, messages.length - 1));
    }, 1800);

    const progTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 3, 100));
    }, 180);

    return () => {
      clearTimeout(timer);
      clearInterval(msgTimer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a1929", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes spinCW { to { transform: rotate(360deg); } }
        @keyframes spinCCW { to { transform: rotate(-360deg); } }
        @keyframes glowPulse { 0%,100% { opacity:0.5; transform:translate(-50%,-50%) scale(1); } 50% { opacity:1; transform:translate(-50%,-50%) scale(1.15); } }
        @keyframes fadeMsg { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes factSlide { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,188,212,0.07) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "glowPulse 3s ease-in-out infinite", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100px", height: "100px", marginBottom: "36px" }}>
        <div style={{ position: "absolute", inset: 0, border: "3px solid rgba(0,188,212,0.15)", borderTopColor: "#00bcd4", borderRadius: "50%", animation: "spinCW 1.4s linear infinite" }} />
        <div style={{ position: "absolute", inset: "12px", border: "3px solid rgba(255,152,0,0.15)", borderTopColor: "#ff9800", borderRadius: "50%", animation: "spinCCW 1s linear infinite" }} />
        <div style={{ position: "absolute", inset: "24px", border: "2px solid rgba(0,188,212,0.1)", borderTopColor: "rgba(0,188,212,0.5)", borderRadius: "50%", animation: "spinCW 0.7s linear infinite" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "10px", height: "10px", borderRadius: "50%", background: "#ff9800" }} />
      </div>

      <div
        key={msgIndex}
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "32px", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", animation: "fadeMsg 0.5s ease", minHeight: "44px" }}
      >
        {messages[msgIndex]}
      </div>

      <div style={{ width: "320px", height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden", marginBottom: "48px" }}>
        <div style={{ height: "100%", width: progress + "%", background: "linear-gradient(90deg, #00bcd4, #ff9800)", borderRadius: "100px", transition: "width 0.08s linear" }} />
      </div>

      <div style={{ maxWidth: "520px", marginBottom: "36px", animation: "factSlide 0.8s ease 0.3s both" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: "#00bcd4", textTransform: "uppercase", marginBottom: "10px" }}>
          {lang === "en" ? "Did you know?" : lang === "es" ? "Sabias que?" : "Voce sabia?"}
        </div>
        <div style={{ fontSize: "16px", color: "#90a4ae", lineHeight: 1.7, fontStyle: "italic" }}>
          {fact}
        </div>
      </div>

      <div
        onClick={() => window.open(NEWSLETTER_URL, "_blank")}
        style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 22px", border: "1px solid rgba(0,188,212,0.25)", borderRadius: "100px", background: "rgba(0,188,212,0.06)", cursor: "pointer", animation: "factSlide 0.8s ease 0.6s both" }}
      >
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00bcd4", flexShrink: 0 }} />
        <span style={{ fontSize: "12px", color: "#90a4ae" }}>
          {lang === "en" && "Stay sharp — follow "}
          {lang === "es" && "Mantente actualizado — sigue "}
          {lang === "pt" && "Fique atualizado — siga "}
          <span style={{ color: "#00bcd4", fontWeight: 700 }}>Industrial Cutting Processes</span>
          {lang === "en" && " on LinkedIn"}
          {lang === "es" && " en LinkedIn"}
          {lang === "pt" && " no LinkedIn"}
        </span>
      </div>
    </div>
  );
}