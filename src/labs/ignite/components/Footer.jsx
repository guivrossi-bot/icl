export default function Footer({ lang }) {
  const newsletterUrl = "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7419724116267520000";
  const profileUrl = "https://www.linkedin.com/in/guivrossi/";

  const linkStyle = {
    fontSize: "12px",
    color: "#90a4ae",
    textDecoration: "none",
  };

  const separatorStyle = {
    color: "#1a3a5c",
  };

  return (
    <footer style={{
      borderTop: "1px solid rgba(0,188,212,0.15)",
      padding: "20px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "12px",
      background: "rgba(10,25,41,0.95)",
    }}>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "18px" }}>⚡</span>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#00bcd4", letterSpacing: "1px" }}>
            IGNITE
          </div>
          <div style={{ fontSize: "10px", color: "#90a4ae" }}>
            {lang === "en" && (
              <span>
                Part of the{" "}
                <a href={newsletterUrl} target="_blank" rel="noreferrer"
                  style={{ color: "#e8f4f8", textDecoration: "none", fontWeight: 600 }}>
                  Industrial Cutting Processes
                </a>
                {" "}ecosystem
              </span>
            )}
            {lang === "es" && (
              <span>
                Parte del ecosistema{" "}
                <a href={newsletterUrl} target="_blank" rel="noreferrer"
                  style={{ color: "#e8f4f8", textDecoration: "none", fontWeight: 600 }}>
                  Industrial Cutting Processes
                </a>
              </span>
            )}
            {lang === "pt" && (
              <span>
                Parte do ecossistema{" "}
                <a href={newsletterUrl} target="_blank" rel="noreferrer"
                  style={{ color: "#e8f4f8", textDecoration: "none", fontWeight: 600 }}>
                  Industrial Cutting Processes
                </a>
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <a href={newsletterUrl} target="_blank" rel="noreferrer" style={linkStyle}>
          {lang === "en" ? "📰 Newsletter" : lang === "es" ? "📰 Boletín" : "📰 Newsletter"}
        </a>

        <span style={separatorStyle}>|</span>

        <a href={profileUrl} target="_blank" rel="noreferrer" style={linkStyle}>
          {lang === "en" ? "💬 Get in touch" : lang === "es" ? "💬 Contáctame" : "💬 Entre em contato"}
        </a>

        <span style={separatorStyle}>|</span>

        <span style={{ fontSize: "11px", color: "#1a3a5c" }}>
          © 2025 Gui Rossi
        </span>
      </div>

    </footer>
  );
}