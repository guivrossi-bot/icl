import { useState, useEffect } from "react";
import { useLanguage, useUnit } from "../lib/contexts";
import t from "../lib/translations";
import { INDUSTRY_DEFAULTS, APP_CALC_MAP } from "../lib/calculators";
import Footer from "./Footer";
import { generatePDF } from "./ReportPDF";

const APP_ICONS = {
  burnRate: "🔥", noPreheat: "🌡️", training: "🎓", setup: "⚙️",
  grinding: "🔩", skeleton: "🏗️", beveling: "📐", marking: "✏️",
  gouging: "⚡", tempAttach: "🔗",
};

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtNum = (n) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

const NEWSLETTER_URL = "https://www.linkedin.com/newsletters/industrial-cutting-processes-7419724116267520000/";
const PROFILE_URL = "https://www.linkedin.com/in/guivrossi/";

function getNarrative(appId, data, result, unit, lang) {
  const d = data;
  const isM = unit === "metric";
  const sp = isM ? "mm/min" : "ipm";
  const narratives = {
    burnRate: {
      en: "Your " + fmtNum(d.employees) + " cutting employees currently spend an estimated " + fmtNum(result.torchTime) + " hours per year on oxyfuel cutting. Switching to plasma reduces that to " + fmtNum(result.plasmaTime) + " hours. That is " + fmtNum(result.timeSavings) + " hours freed up per year, equivalent to roughly " + Math.round(result.timeSavings / 1800) + " full-time operators.",
      es: "Sus " + fmtNum(d.employees) + " empleados de corte gastan aproximadamente " + fmtNum(result.torchTime) + " horas al ano en corte con oxicombustible. Cambiar a plasma reduce eso a " + fmtNum(result.plasmaTime) + " horas, liberando " + fmtNum(result.timeSavings) + " horas al ano.",
      pt: "Seus " + fmtNum(d.employees) + " funcionarios de corte gastam aproximadamente " + fmtNum(result.torchTime) + " horas por ano em corte com oxicombustivel. Mudar para plasma reduz isso para " + fmtNum(result.plasmaTime) + " horas, liberando " + fmtNum(result.timeSavings) + " horas por ano.",
    },
    noPreheat: {
      en: "Your operators perform an estimated " + fmtNum(d.plasmaStarts * d.opDays * d.employees) + " torch starts per year. Each one requires " + d.preheatTime + " seconds of preheating with oxyfuel. Plasma starts instantly, eliminating " + fmtNum(result.timeSavings) + " hours of pure waiting time annually.",
      es: "Sus operadores realizan aproximadamente " + fmtNum(d.plasmaStarts * d.opDays * d.employees) + " arranques de antorcha por ano. El plasma arranca instantaneamente, eliminando " + fmtNum(result.timeSavings) + " horas de espera al ano.",
      pt: "Seus operadores realizam aproximadamente " + fmtNum(d.plasmaStarts * d.opDays * d.employees) + " partidas por ano. O plasma parte instantaneamente, eliminando " + fmtNum(result.timeSavings) + " horas de espera por ano.",
    },
    training: {
      en: "You train " + fmtNum(d.trainEmployees * d.trainWeeks) + " operators per year. Oxyfuel certification requires " + d.oxyTraining + " hours each, plasma requires only " + d.plasmaTraining + ". That frees up " + fmtNum(result.timeSavings) + " hours annually.",
      es: "Entrena " + fmtNum(d.trainEmployees * d.trainWeeks) + " operadores por ano. La certificacion en oxicombustible requiere " + d.oxyTraining + " horas, el plasma solo " + d.plasmaTraining + ". Eso son " + fmtNum(result.timeSavings) + " horas ahorradas.",
      pt: "Voce treina " + fmtNum(d.trainEmployees * d.trainWeeks) + " operadores por ano. A certificacao em oxicombustivel requer " + d.oxyTraining + " horas, o plasma requer apenas " + d.plasmaTraining + ". Sao " + fmtNum(result.timeSavings) + " horas economizadas.",
    },
    setup: {
      en: "With " + d.employees + " employees doing " + d.torchSetups + " oxyfuel setups per shift across " + d.numShifts + " shifts, your team spends significant time just preparing to cut. Plasma requires fewer and faster setups, saving " + fmtNum(result.timeSavings) + " hours per year.",
      es: "Con " + d.employees + " empleados realizando " + d.torchSetups + " configuraciones por turno, el plasma requiere configuraciones mas rapidas, ahorrando " + fmtNum(result.timeSavings) + " horas por ano.",
      pt: "Com " + d.employees + " funcionarios fazendo " + d.torchSetups + " configuracoes por turno, o plasma requer configuracoes mais rapidas, economizando " + fmtNum(result.timeSavings) + " horas por ano.",
    },
    grinding: {
      en: "Your " + d.grindEmployees + " grinding employees currently spend " + d.dailyGrind + " hours per day cleaning up oxyfuel cut edges. Plasma produces a cleaner cut, reducing grinding to just " + d.plasmaGrindPct + "% of current time. That saves " + fmtNum(result.timeSavings) + " hours annually.",
      es: "Sus " + d.grindEmployees + " empleados de esmerilado gastan " + d.dailyGrind + " horas por dia. El plasma reduce el esmerilado al " + d.plasmaGrindPct + "% del tiempo actual, ahorrando " + fmtNum(result.timeSavings) + " horas al ano.",
      pt: "Seus " + d.grindEmployees + " funcionarios de esmerilamento gastam " + d.dailyGrind + " horas por dia. O plasma reduz o esmerilamento para apenas " + d.plasmaGrindPct + "% do tempo atual, economizando " + fmtNum(result.timeSavings) + " horas por ano.",
    },
    skeleton: {
      en: "Your " + d.skelEmployees + " skeleton removal employees spend " + d.skelHours + " hour(s) per shift cutting apart leftover plate. A plasma long torch is approximately 50% faster, saving " + fmtNum(result.timeSavings) + " hours annually and increasing your CNC table uptime.",
      es: "Sus " + d.skelEmployees + " empleados de remocion de esqueleto pasan " + d.skelHours + " hora(s) por turno. Una antorcha larga de plasma es aproximadamente un 50% mas rapida, ahorrando " + fmtNum(result.timeSavings) + " horas al ano.",
      pt: "Seus " + d.skelEmployees + " funcionarios de remocao de esqueleto passam " + d.skelHours + " hora(s) por turno. Uma tocha longa de plasma e aproximadamente 50% mais rapida, economizando " + fmtNum(result.timeSavings) + " horas por ano.",
    },
    beveling: {
      en: "Your " + d.bevelStations + " bevel stations run " + d.bevelHours + " hours per day. Plasma cuts bevels at " + d.bevelPlasmaSpeed + " " + sp + " vs " + d.bevelOxySpeed + " for oxyfuel, and eliminates $" + d.gasCost + "/hr gas costs replacing them with $" + d.elecCost + "/hr electricity. Combined savings reach " + fmtCurrency(result.savings) + " annually.",
      es: "Sus " + d.bevelStations + " estaciones de biselado funcionan " + d.bevelHours + " horas por dia. El plasma elimina $" + d.gasCost + "/hr en gas. Los ahorros combinados alcanzan " + fmtCurrency(result.savings) + " anuales.",
      pt: "Suas " + d.bevelStations + " estacoes de chanframento funcionam " + d.bevelHours + " horas por dia. O plasma elimina $" + d.gasCost + "/hr em gas. As economias combinadas chegam a " + fmtCurrency(result.savings) + " anuais.",
    },
    marking: {
      en: "Your " + d.markEmployees + " marking employees currently hand punch at " + d.punchSpeed + " " + sp + ". Plasma marking runs at " + d.plasmaMarkSpeed + " " + sp + ", over " + Math.round(d.plasmaMarkSpeed / d.punchSpeed) + "x faster, producing a permanent mark that survives shot blasting and painting. That saves " + fmtNum(result.timeSavings) + " hours per year.",
      es: "Sus " + d.markEmployees + " empleados de marcado punzonan manualmente a " + d.punchSpeed + " " + sp + ". El marcado plasma es mas de " + Math.round(d.plasmaMarkSpeed / d.punchSpeed) + "x mas rapido, ahorrando " + fmtNum(result.timeSavings) + " horas al ano.",
      pt: "Seus " + d.markEmployees + " funcionarios de marcacao puncionam manualmente a " + d.punchSpeed + " " + sp + ". A marcacao a plasma e mais de " + Math.round(d.plasmaMarkSpeed / d.punchSpeed) + "x mais rapida, economizando " + fmtNum(result.timeSavings) + " horas por ano.",
    },
    gouging: {
      en: "Carbon arc gouging costs more per hour in labor, consumables, and grinding. Plasma gouges at " + d.plasmaGougSpeed + " " + sp + " vs " + d.cagSpeed + " for CAG, twice as fast, while requiring less grinding. The combined cost reduction adds up to " + fmtCurrency(result.savings) + " per year.",
      es: "El plasma gouging es el doble de rapido que el CAG y requiere menos esmerilado, una reduccion de costo combinada de " + fmtCurrency(result.savings) + " por ano.",
      pt: "A goivagem a plasma e duas vezes mais rapida que o CAG e requer menos esmerilamento, uma reducao de custo combinada de " + fmtCurrency(result.savings) + " por ano.",
    },
    tempAttach: {
      en: "Removing temporary attachments with oxyfuel or CAG requires setup, cutting, and heavy grinding. Plasma FlushCut removes them cleanly at " + d.flushCutRate + " " + sp + ", requiring only " + d.grindPctPlasma + "% of current grinding time, saving " + fmtNum(result.timeSavings) + " labor hours per year.",
      es: "El FlushCut plasma remueve las fijaciones limpiamente, requiriendo solo el " + d.grindPctPlasma + "% del tiempo de esmerilado actual, ahorrando " + fmtNum(result.timeSavings) + " horas al ano.",
      pt: "O FlushCut plasma remove as fixacoes de forma limpa, exigindo apenas " + d.grindPctPlasma + "% do tempo de esmerilamento atual, economizando " + fmtNum(result.timeSavings) + " horas por ano.",
    },
  };
  return narratives[appId]?.[lang] || narratives[appId]?.["en"] || "";
}

function getBreakdown(appId, data, result, unit) {
  const d = data;
  const isM = unit === "metric";
  const sp = isM ? "mm/min" : "ipm";
  const lu = isM ? "m" : "in";
  const breakdowns = {
    burnRate: [
      { label: fmtNum(d.employees) + " employees x " + d.dailyCut + " " + lu + "/day x " + d.opDays + " days", value: fmtNum(d.employees * d.dailyCut * d.opDays) + " " + lu + "/yr total" },
      { label: "At " + d.torchUse + "% torch use, active cutting length", value: fmtNum(d.employees * d.dailyCut * d.opDays * d.torchUse / 100) + " " + lu + "/yr" },
      { label: "Plasma at " + d.plasmaSpeed + " " + sp + ", cutting time", value: fmtNum(result.plasmaTime) + " hrs/yr" },
      { label: "Oxyfuel at " + d.torchSpeed + " " + sp + ", cutting time", value: fmtNum(result.torchTime) + " hrs/yr" },
      { label: "Time saved x $" + d.laborRate + "/hr", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    noPreheat: [
      { label: d.plasmaStarts + " starts/day x " + d.opDays + " days x " + d.employees + " employees", value: fmtNum(d.plasmaStarts * d.opDays * d.employees) + " starts/yr" },
      { label: d.preheatTime + " sec preheat per start eliminated", value: fmtNum(d.plasmaStarts * d.opDays * d.employees * d.preheatTime / 3600) + " hrs saved/yr" },
      { label: "Time saved x $" + d.laborRate + "/hr", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    training: [
      { label: d.trainEmployees + " employees/week x " + d.trainWeeks + " weeks", value: fmtNum(d.trainEmployees * d.trainWeeks) + " operators/yr" },
      { label: "Oxyfuel: " + fmtNum(d.trainEmployees * d.trainWeeks) + " x " + d.oxyTraining + " hrs", value: fmtNum(d.trainEmployees * d.trainWeeks * d.oxyTraining) + " hrs/yr" },
      { label: "Plasma: " + fmtNum(d.trainEmployees * d.trainWeeks) + " x " + d.plasmaTraining + " hrs", value: fmtNum(d.trainEmployees * d.trainWeeks * d.plasmaTraining) + " hrs/yr" },
      { label: "Hours saved x $" + d.laborRate + "/hr", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    setup: [
      { label: "Oxyfuel: " + d.torchSetups + " setups x " + d.numShifts + " shifts x " + d.opDays + " days x " + d.employees + " emp", value: fmtNum(d.torchSetups * d.numShifts * d.opDays * d.employees * d.oxySetup / 60) + " hrs/yr" },
      { label: "Plasma: " + d.plasmaSetups + " setups x " + d.numShifts + " shifts x " + d.opDays + " days x " + d.employees + " emp", value: fmtNum(d.plasmaSetups * d.numShifts * d.opDays * d.employees * d.plasmaSetup / 60) + " hrs/yr" },
      { label: "Hours saved x $" + d.laborRate + "/hr", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    grinding: [
      { label: d.grindEmployees + " employees x " + d.dailyGrind + " hrs/day x " + d.opDays + " days", value: fmtNum(d.grindEmployees * d.dailyGrind * d.opDays) + " hrs/yr oxyfuel" },
      { label: "Plasma grinding at " + d.plasmaGrindPct + "% of oxyfuel time", value: fmtNum(d.grindEmployees * d.dailyGrind * d.opDays * d.plasmaGrindPct / 100) + " hrs/yr" },
      { label: "Hours saved x $" + d.laborRate + "/hr", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    skeleton: [
      { label: d.skelEmployees + " employees x " + d.skelHours + " hrs/shift x " + d.skelShifts + " shifts x " + d.opDays + " days", value: fmtNum(d.skelEmployees * d.skelHours * d.skelShifts * d.opDays) + " hrs/yr" },
      { label: "Plasma long torch 50% faster", value: fmtNum(d.skelEmployees * d.skelHours * d.skelShifts * d.opDays * 0.5) + " hrs saved/yr" },
      { label: "Hours saved x $" + d.laborRate + "/hr", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    beveling: [
      { label: d.bevelStations + " stations x " + d.bevelHours + " hrs/day x " + d.opDays + " days", value: fmtNum(d.bevelStations * d.bevelHours * d.opDays) + " total hrs/yr" },
      { label: "Plasma at " + d.bevelPlasmaSpeed + " " + sp + " vs oxyfuel at " + d.bevelOxySpeed + " " + sp, value: fmtNum(result.timeSavings) + " hrs saved/yr" },
      { label: "Gas $" + d.gasCost + "/hr replaced by electricity $" + d.elecCost + "/hr", value: "Operating savings" },
      { label: "Labor plus operating cost savings", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    marking: [
      { label: d.markEmployees + " employees x " + d.dailyMark + " " + lu + "/day x " + d.opDays + " days", value: fmtNum(d.markEmployees * d.dailyMark * d.opDays) + " " + lu + "/yr" },
      { label: "Plasma at " + d.plasmaMarkSpeed + " " + sp, value: fmtNum(result.plasmaTime) + " hrs/yr" },
      { label: "Hand punching at " + d.punchSpeed + " " + sp, value: fmtNum(result.punchTime) + " hrs/yr" },
      { label: "Hours saved x $" + d.laborRate + "/hr", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    gouging: [
      { label: d.gougEmployees + " employees x " + d.gougLength + " " + (isM ? "m" : "ft") + "/day x " + d.opDays + " days", value: fmtNum(d.gougEmployees * d.gougLength * d.opDays) + " " + (isM ? "m" : "ft") + "/yr" },
      { label: "Plasma at " + d.plasmaGougSpeed + " " + sp + " plus " + d.grindAfterPlasma + " min grind per 30m", value: "Plasma total cost" },
      { label: "CAG at " + d.cagSpeed + " " + sp + " plus $" + d.carbonRodCost + " per rod plus " + d.grindAfterCAG + " min grind per 30m", value: "CAG total cost" },
      { label: "Cost reduction labor plus consumables plus grinding", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
    tempAttach: [
      { label: d.employees + " employees x " + d.dailyCutLength + " " + lu + "/day x " + d.opDays + " days", value: fmtNum(d.employees * d.dailyCutLength * d.opDays) + " " + lu + "/yr" },
      { label: "Flush cutting " + d.flushUse + "% of daily cutting at " + d.flushCutRate + " " + sp, value: "Plasma time" },
      { label: "Current method " + d.torchCAGUse + "% use at " + d.altRate + " " + sp + " plus grinding", value: "Current total time" },
      { label: "Hours saved x $" + d.laborRate + "/hr", value: fmtCurrency(result.savings) + "/yr", total: true },
    ],
  };
  return breakdowns[appId] || [];
}

function DetailPanel({ appId, data, result, unit, lang }) {
  const breakdown = getBreakdown(appId, data, result, unit);
  const narrative = getNarrative(appId, data, result, unit, lang);
  const metrics = [
    { label: lang === "en" ? "Time saved" : lang === "es" ? "Tiempo ahorrado" : "Tempo economizado", value: fmtNum(result.timeSavings) + " hrs/yr", highlight: true },
    { label: lang === "en" ? "Annual savings" : lang === "es" ? "Ahorros anuales" : "Economias anuais", value: fmtCurrency(result.savings), highlight: true },
    { label: lang === "en" ? "Equivalent FTEs" : lang === "es" ? "Equiv. empleados" : "Equiv. funcionarios", value: "~" + Math.max(1, Math.round(result.timeSavings / 1800)), highlight: false },
  ];
  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "20px", background: "rgba(0,0,0,0.2)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "16px" }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 14px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{m.label}</div>
            <div style={{ fontSize: "20px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: m.highlight ? "var(--plasma)" : "var(--text)" }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", marginBottom: "14px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
          {lang === "en" ? "How the savings are calculated" : lang === "es" ? "Como se calculan los ahorros" : "Como as economias sao calculadas"}
        </div>
        {breakdown.map((row, i) => (
          <div key={i}>
            {row.total && <div style={{ borderTop: "1px solid var(--border)", margin: "10px 0" }} />}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: row.total ? "14px" : "12px", color: row.total ? "var(--text)" : "var(--text-muted)", fontWeight: row.total ? 600 : 400, marginBottom: "6px" }}>
              <span style={{ flex: 1 }}>{row.label}</span>
              <span style={{ color: row.total ? "var(--plasma)" : "var(--text)", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: row.total ? "16px" : "13px" }}>{row.value}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", padding: "12px 16px", background: "rgba(0,188,212,0.05)", borderRadius: "10px", borderLeft: "3px solid var(--plasma)" }}>
        {narrative}
      </div>
    </div>
  );
}

function ResultCard({ appId, savings, timeSavings, totalSavings, data, unit, lang }) {
  const [open, setOpen] = useState(false);
  const tr = t[lang];
  const pct = totalSavings > 0 ? (savings / totalSavings) * 100 : 0;
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid " + (open ? "var(--plasma)" : "var(--border)"), borderRadius: "var(--radius)", overflow: "hidden", transition: "border-color 0.2s", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", cursor: "pointer", userSelect: "none" }} onClick={() => setOpen(!open)}>
        <span style={{ fontSize: "22px", flexShrink: 0 }}>{APP_ICONS[appId]}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "14px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: "uppercase", color: "#fff", marginBottom: "2px" }}>{tr[appId]}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{tr[appId + "Desc"]}</div>
        </div>
        <div style={{ width: "110px", flexShrink: 0 }}>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden", marginBottom: "4px" }}>
            <div style={{ height: "100%", width: Math.min(100, pct) + "%", background: "linear-gradient(90deg, var(--plasma), var(--spark))", borderRadius: "100px" }} />
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "right" }}>{pct.toFixed(0)}% of total</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, minWidth: "90px" }}>
          <div style={{ fontSize: "17px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: "var(--plasma)" }}>{fmtCurrency(savings)}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>per year</div>
        </div>
        <div style={{ fontSize: "16px", color: "var(--plasma)", marginLeft: "6px", transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none", flexShrink: 0 }}>{">"}</div>
      </div>
      {open && (
        <DetailPanel
          appId={appId}
          data={data}
          result={{ savings, timeSavings, ...data._computed }}
          unit={unit}
          lang={lang}
        />
      )}
    </div>
  );
}

function EmailBanner({ lang, totalSavings, apps, calcData, unit }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = () => {
    if (!email || !email.includes("@")) {
      setError(
        lang === "en" ? "Please enter a valid email." :
        lang === "es" ? "Ingresa un correo valido." :
        "Digite um e-mail valido."
      );
      return;
    }
    console.log("LEAD:", { name, email, company, totalSavings });
    setGenerated(true);
    generatePDF({ apps, calcData, unit, lang, userInfo: { name, email, company } });
  };

  if (dismissed || !visible) return null;

  const benefitStyle = { display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px" };
  const benefitTitleStyle = { fontSize: "12px", fontWeight: 600, color: "#e8f4f8", marginBottom: "2px" };
  const benefitTextStyle = { fontSize: "11px", color: "#90a4ae", lineHeight: 1.4 };

  return (
    <div style={{ position: "sticky", top: "70px", zIndex: 90, margin: "0 0 24px 0", background: "linear-gradient(135deg, #0d2137, #1a3a5c)", border: "1px solid var(--plasma)", borderRadius: "var(--radius)", padding: "24px 28px", animation: "slideDown 0.4s ease" }}>
      <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {generated ? (
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "32px" }}>✅</span>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
              {lang === "en" ? "Your report is opening..." : lang === "es" ? "Tu informe se esta abriendo..." : "Seu relatorio esta abrindo..."}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {lang === "en" ? "Save or print it from the new tab. Check your popup blocker if nothing opened." : lang === "es" ? "Guardalo o imprimelo desde la nueva pestana." : "Salve ou imprima a partir da nova aba."}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--plasma)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>
                {lang === "en" ? "Get the full report" : lang === "es" ? "Obtener el informe completo" : "Obter o relatorio completo"}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                {lang === "en" ? "Take this to your next management meeting" : lang === "es" ? "Lleva esto a tu proxima reunion de direccion" : "Leve isso para sua proxima reuniao de gestao"}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {lang === "en" ? "The screen shows the numbers. The PDF gives you a presentation-ready report your team can act on." : lang === "es" ? "La pantalla muestra los numeros. El PDF te da un informe listo para presentar." : "A tela mostra os numeros. O PDF te da um relatorio pronto para apresentar."}
              </div>
            </div>
            <button onClick={() => setDismissed(true)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px", padding: "0 0 0 20px", lineHeight: 1, flexShrink: 0 }}>x</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "18px" }}>
            <div style={benefitStyle}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>📄</span>
              <div>
                <div style={benefitTitleStyle}>{lang === "en" ? "Shareable PDF" : lang === "es" ? "PDF compartible" : "PDF compartilhavel"}</div>
                <div style={benefitTextStyle}>{lang === "en" ? "Forward to your manager or procurement team" : lang === "es" ? "Comparte con tu gerente o equipo de compras" : "Compartilhe com seu gerente ou equipe de compras"}</div>
              </div>
            </div>
            <div style={benefitStyle}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>🔢</span>
              <div>
                <div style={benefitTitleStyle}>{lang === "en" ? "Full calculation breakdown" : lang === "es" ? "Desglose completo de calculos" : "Detalhamento completo dos calculos"}</div>
                <div style={benefitTextStyle}>{lang === "en" ? "Every number explained so anyone can verify" : lang === "es" ? "Cada numero explicado para que cualquiera pueda verificar" : "Cada numero explicado para qualquer um verificar"}</div>
              </div>
            </div>
            <div style={benefitStyle}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>📰</span>
              <div>
                <div style={benefitTitleStyle}>{lang === "en" ? "Newsletter included" : lang === "es" ? "Boletin incluido" : "Newsletter incluido"}</div>
                <div style={benefitTextStyle}>{lang === "en" ? "Industrial Cutting Processes insights on plasma, laser and waterjet" : lang === "es" ? "Perspectivas sobre plasma, laser y chorro de agua" : "Perspectivas sobre plasma, laser e jato de agua"}</div>
              </div>
            </div>
            <div style={benefitStyle}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>💬</span>
              <div>
                <div style={benefitTitleStyle}>{lang === "en" ? "Direct contact" : lang === "es" ? "Contacto directo" : "Contato direto"}</div>
                <div style={benefitTextStyle}>{lang === "en" ? "My details so you can follow up when ready" : lang === "es" ? "Mis datos para que puedas contactarme cuando estes listo" : "Meus dados para voce entrar em contato quando estiver pronto"}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: "8px", alignItems: "flex-start" }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "en" ? "Your name" : lang === "es" ? "Tu nombre" : "Seu nome"}
              style={{ width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "13px", fontFamily: "'Barlow', sans-serif" }}
            />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={lang === "en" ? "Company / Shipyard" : lang === "es" ? "Empresa / Astillero" : "Empresa / Estaleiro"}
              style={{ width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "13px", fontFamily: "'Barlow', sans-serif" }}
            />
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder={lang === "en" ? "your@email.com" : lang === "es" ? "tu@correo.com" : "seu@email.com"}
                style={{ width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid " + (error ? "#f44336" : "var(--border)"), borderRadius: "8px", color: "var(--text)", fontSize: "13px", fontFamily: "'Barlow', sans-serif" }}
              />
              {error && <div style={{ fontSize: "10px", color: "#f44336", marginTop: "3px" }}>{error}</div>}
            </div>
            <button
              onClick={handleGenerate}
              style={{ padding: "9px 18px", background: "var(--plasma)", color: "var(--navy)", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {lang === "en" ? "Generate my PDF" : lang === "es" ? "Generar mi PDF" : "Gerar meu PDF"}
            </button>
            <button
              onClick={() => setDismissed(true)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "12px", whiteSpace: "nowrap", padding: "9px 0" }}
            >
              {lang === "en" ? "Skip for now" : lang === "es" ? "Omitir" : "Pular"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportPage({ apps, calcData, onRestart }) {
  const { lang, setLang } = useLanguage();
  const { unit } = useUnit();
  const tr = t[lang];
  const defaults = INDUSTRY_DEFAULTS[unit];
  const [leadCaptured, setLeadCaptured] = useState(false);

  const results = apps.map((appId) => {
    const data = { ...(defaults[appId] || {}), ...(calcData[appId] || {}) };
    let result = { timeSavings: 0, savings: 0 };
    let computed = {};
    try {
      result = APP_CALC_MAP[appId](data, unit);
      const plasmaSpdM = unit === "imperial" ? data.plasmaSpeed * 25.4 : data.plasmaSpeed;
      const torchSpdM = unit === "imperial" ? data.torchSpeed * 25.4 : data.torchSpeed;
      const dailyCutM = unit === "imperial" ? data.dailyCut * 25.4 : data.dailyCut;
      const totalLength = (data.employees || 0) * (dailyCutM || 0) * (data.opDays || 0);
      const activeLength = totalLength * ((data.torchUse || 15) / 100);
      computed.plasmaTime = plasmaSpdM > 0 ? activeLength / (plasmaSpdM / 1000) / 60 : 0;
      computed.torchTime = torchSpdM > 0 ? activeLength / (torchSpdM / 1000) / 60 : 0;
      const plasmaMark = unit === "imperial" ? (data.plasmaMarkSpeed || 0) * 25.4 : (data.plasmaMarkSpeed || 0);
      const punchM = unit === "imperial" ? (data.punchSpeed || 0) * 25.4 : (data.punchSpeed || 0);
      const totalMark = (data.markEmployees || 0) * (data.dailyMark || 0) * (data.opDays || 0);
      computed.plasmaTime = computed.plasmaTime || (plasmaMark > 0 ? totalMark * 1000 / plasmaMark / 60 : 0);
      computed.punchTime = punchM > 0 ? totalMark * 1000 / punchM / 60 : 0;
    } catch (e) {}
    data._computed = computed;
    return { appId, data, ...result };
  });

  const totalSavings = results.reduce((s, r) => s + (r.savings || 0), 0);
  const totalTime = results.reduce((s, r) => s + (r.timeSavings || 0), 0);
  const topResult = [...results].sort((a, b) => b.savings - a.savings)[0];

  return (
    <div className="page-wrapper">
      <nav className="nav">
        <div className="nav-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">Ignite</span>
        </div>
        <div className="nav-controls">
          <div className="lang-select">
            {["en", "es", "pt"].map((l) => (
              <button key={l} className={"lang-btn " + (lang === l ? "active" : "")} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="btn-secondary sm" onClick={onRestart}>{tr.restart}</button>
        </div>
      </nav>

      <div className="report-content">
        <div className="step-indicator">
          <div className="step done">✓</div>
          <div className="step-line done"></div>
          <div className="step done">✓</div>
          <div className="step-line done"></div>
          <div className="step active">3</div>
        </div>

        <h2 className="page-title">{tr.reportTitle}</h2>
        <p className="page-sub">{tr.reportSub}</p>

        <EmailBanner
          lang={lang}
          totalSavings={totalSavings}
          apps={apps}
          calcData={calcData}
          unit={unit}
          onSubmit={(info) => { setLeadCaptured(true); console.log("Lead captured:", info); }}
          onSkip={() => console.log("User skipped email banner")}
        />

        <div className="savings-hero">
          <div className="savings-label">{tr.totalSavings}</div>
          <div className="savings-amount">{fmtCurrency(totalSavings)}</div>
          <div className="savings-period">{tr.perYear}</div>
          <div className="savings-time">{"+ " + fmtNum(totalTime) + " " + tr.hours + " " + tr.timeSavings}</div>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
          {lang === "en" ? "Click any application to see how the savings are calculated." : lang === "es" ? "Haz clic en cualquier aplicacion para ver como se calculan los ahorros." : "Clique em qualquer aplicacao para ver como as economias sao calculadas."}
        </p>

        <div>
          {results.map(({ appId, savings, timeSavings, data }) => (
            <ResultCard key={appId} appId={appId} savings={savings} timeSavings={timeSavings} totalSavings={totalSavings} data={data} unit={unit} lang={lang} />
          ))}
        </div>

        {topResult && (
          <div className="top-insight">
            <span className="insight-icon">💡</span>
            <div className="insight-text">
              {lang === "en" && "Your biggest opportunity is " + tr[topResult.appId] + ", with " + fmtCurrency(topResult.savings) + " in potential annual savings."}
              {lang === "es" && "Tu mayor oportunidad es " + tr[topResult.appId] + ", con " + fmtCurrency(topResult.savings) + " en ahorros anuales potenciales."}
              {lang === "pt" && "Sua maior oportunidade e " + tr[topResult.appId] + ", com " + fmtCurrency(topResult.savings) + " em economias anuais potenciais."}
            </div>
          </div>
        )}

        <div style={{ margin: "32px 0", border: "1px solid rgba(0,188,212,0.2)", borderRadius: "14px", padding: "28px 32px", background: "rgba(0,188,212,0.04)" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: "#00bcd4", textTransform: "uppercase", marginBottom: "14px" }}>
            {lang === "en" ? "What is next for you?" : lang === "es" ? "Cual es tu proximo paso?" : "Qual e o seu proximo passo?"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a href={NEWSLETTER_URL} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "10px", textDecoration: "none" }}>
              <span style={{ fontSize: "22px", flexShrink: 0 }}>📰</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>
                  {lang === "en" ? "Stay ahead — follow the newsletter" : lang === "es" ? "Mantente actualizado con el boletin" : "Fique atualizado com o newsletter"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {lang === "en" ? "Plasma, laser, waterjet insights. Industrial Cutting Processes on LinkedIn." : lang === "es" ? "Plasma, laser, chorro de agua. Industrial Cutting Processes en LinkedIn." : "Plasma, laser, jato de agua. Industrial Cutting Processes no LinkedIn."}
                </div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#085041", background: "#E1F5EE", padding: "6px 14px", borderRadius: "6px", whiteSpace: "nowrap", flexShrink: 0 }}>
                {lang === "en" ? "Follow free" : lang === "es" ? "Seguir gratis" : "Seguir gratis"}
              </div>
            </a>
            <a href={PROFILE_URL} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "10px", textDecoration: "none" }}>
              <span style={{ fontSize: "22px", flexShrink: 0 }}>💬</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "2px" }}>
                  {lang === "en" ? "Ready to act on these savings?" : lang === "es" ? "Listo para implementar estos ahorros?" : "Pronto para implementar essas economias?"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {lang === "en" ? "Let's talk about implementing plasma cutting in your yard." : lang === "es" ? "Hablemos sobre implementar corte por plasma en tu astillero." : "Vamos conversar sobre implementar corte a plasma no seu estaleiro."}
                </div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#042C53", background: "#378ADD", padding: "6px 14px", borderRadius: "6px", whiteSpace: "nowrap", flexShrink: 0 }}>
                {lang === "en" ? "Let's talk" : lang === "es" ? "Hablemos" : "Vamos conversar"}
              </div>
            </a>
          </div>
        </div>

        <p className="disclaimer">
          {lang === "en" && "* Savings estimates are based on industry averages and your provided data. Actual results may vary. Projections are based on 12mm mild steel thickness and standard industry benchmarks."}
          {lang === "es" && "* Las estimaciones de ahorro se basan en promedios de la industria y sus datos. Los resultados reales pueden variar."}
          {lang === "pt" && "* As estimativas de economia sao baseadas nas medias do setor e nos seus dados. Os resultados reais podem variar."}
        </p>

        <div className="report-actions">
          <button className="btn-secondary" onClick={onRestart}>{tr.restart}</button>
          <button className="btn-primary" onClick={() => window.print()}>
            {lang === "en" ? "Print Report" : lang === "es" ? "Imprimir Informe" : "Imprimir Relatorio"}
          </button>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}