"use client";

import { useState, useRef } from "react";

const STYLES = [
  "Herzlich & familiär",
  "Professionell & höflich",
  "Locker & freundlich",
  "Gehoben & elegant",
  "Direkt & unkompliziert",
];

const TYPES = [
  { emoji: "⭐", label: "Bewertung (positiv)" },
  { emoji: "😤", label: "Bewertung (negativ)" },
  { emoji: "📅", label: "Reservierungsanfrage" },
  { emoji: "🥗", label: "Frage zur Speisekarte" },
  { emoji: "⚠️", label: "Beschwerde" },
  { emoji: "💬", label: "Sonstiges" },
];

export default function Home() {
  const [restName, setRestName] = useState("");
  const [contact, setContact] = useState("");
  const [style, setStyle] = useState("Herzlich & familiär");
  const [extra, setExtra] = useState("");
  const [msgType, setMsgType] = useState("Bewertung (positiv)");
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);
  const resultsRef = useRef(null);

  async function generate() {
    if (!message.trim()) {
      setError("Bitte füge eine Nachricht ein.");
      return;
    }
    setError("");
    setLoading(true);
    setReplies([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restName, contact, style, extra, msgType, message }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setReplies(data.replies || []);
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      }
    } catch {
      setError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  function copy(text, i) {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2200);
  }

  return (
    <div style={s.page}>
      <div style={s.bgGrain} />

      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoRow}>
            <span style={s.logoMark}>RR</span>
            <div>
              <div style={s.logoName}>RestaurantReply</div>
              <div style={s.logoSub}>KI-Antwort-Assistent für Gastronomie</div>
            </div>
          </div>
          <div style={s.headerBadge}>Beta</div>
        </div>
        <div style={s.headerLine} />
      </header>

      <main style={s.main}>
        <div style={s.hero}>
          <div style={s.heroEyebrow}>Für Restaurants & Gastronomen</div>
          <h1 style={s.heroTitle}>
            Professionelle Antworten,
            <br />
            <span style={s.heroAccent}>in Sekunden.</span>
          </h1>
          <p style={s.heroSub}>
            Einfach Nachricht einfügen – die KI schreibt drei passende Antworten in
            eurem Stil. Spart täglich Zeit und hinterlässt einen starken Eindruck.
          </p>
        </div>

        <div style={s.steps}>
          {["Restaurant einrichten", "Nachricht einfügen", "Antwort kopieren"].map(
            (step, i) => (
              <div key={i} style={s.step}>
                <div style={s.stepNum}>{i + 1}</div>
                <div style={s.stepLabel}>{step}</div>
              </div>
            )
          )}
        </div>

        <div style={s.card}>
          <div style={s.cardLabel}>
            <span style={s.labelDot} />
            Euer Restaurant
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Restaurantname</label>
              <input
                style={s.input}
                value={restName}
                onChange={(e) => setRestName(e.target.value)}
                placeholder="z.B. Trattoria Da Luigi"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Unterzeichner (optional)</label>
              <input
                style={s.input}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="z.B. Maria, das Team"
              />
            </div>
          </div>
          <div style={{ ...s.field, marginBottom: 16 }}>
            <label style={s.label}>Euer Stil</label>
            <div style={s.pillWrap}>
              {STYLES.map((st) => (
                <button
                  key={st}
                  onClick={() => setStyle(st)}
                  style={{ ...s.pill, ...(style === st ? s.pillDark : {}) }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Besonderheiten (optional)</label>
            <input
              style={s.input}
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="z.B. vegane Spezialitäten, 20 Jahre Tradition..."
            />
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardLabel}>
            <span style={s.labelDot} />
            Eingegangene Nachricht
          </div>
          <div style={s.field}>
            <label style={s.label}>Art der Nachricht</label>
            <div style={s.pillWrap}>
              {TYPES.map(({ emoji, label }) => (
                <button
                  key={label}
                  onClick={() => setMsgType(label)}
                  style={{ ...s.pill, ...(msgType === label ? s.pillWine : {}) }}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ ...s.field, marginTop: 16 }}>
            <label style={s.label}>Text der Nachricht / Bewertung</label>
            <textarea
              style={{ ...s.input, ...s.textarea }}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError("");
              }}
              placeholder="Hier die Kundennachricht oder Google-Bewertung einfügen..."
            />
            {error && <div style={s.errorMsg}>{error}</div>}
          </div>
          <button
            onClick={generate}
            disabled={loading}
            style={{ ...s.genBtn, ...(loading ? s.btnDisabled : {}) }}
          >
            {loading ? (
              <>
                <span style={s.spinnerEl} /> Antworten werden generiert...
              </>
            ) : (
              <>✨ Antworten generieren</>
            )}
          </button>
        </div>

        {replies.length > 0 && (
          <div ref={resultsRef} style={s.card}>
            <div style={s.cardLabel}>
              <span style={{ ...s.labelDot, background: "#2d7a4e" }} />
              Eure Antwort-Vorschläge
            </div>
            {replies.map((reply, i) => (
              <div key={i} style={s.replyCard}>
                <div style={s.replyHeader}>
                  <span style={s.replyLabel}>Variante {i + 1}</span>
                  <button
                    onClick={() => copy(reply, i)}
                    style={{ ...s.copyBtn, ...(copied === i ? s.copyDone : {}) }}
                  >
                    {copied === i ? "✓ Kopiert!" : "Kopieren"}
                  </button>
                </div>
                <div style={s.replyText}>{reply}</div>
              </div>
            ))}
            <div style={s.tip}>
              💡 <strong>Tipp:</strong> Antwort kurz durchlesen und minimal anpassen –
              dann wirkt sie noch persönlicher.
            </div>
            <button
              onClick={generate}
              disabled={loading}
              style={{ ...s.regenBtn, ...(loading ? s.btnDisabled : {}) }}
            >
              {loading ? "Generiert..." : "↻ Neue Varianten generieren"}
            </button>
          </div>
        )}
      </main>

      <footer style={s.footer}>
        <div style={s.footerText}>
          RestaurantReply · KI-Assistent für Gastronomie
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; }
        input::placeholder, textarea::placeholder { color: #9e9488; }
        input:focus, textarea:focus { outline: none; border-color: #b07d3a !important; box-shadow: 0 0 0 3px rgba(176,125,58,0.12); }
        button { cursor: pointer; font-family: 'Outfit', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const s = {
  page: { fontFamily: "'Outfit', sans-serif", background: "#F5F0E8", minHeight: "100vh", position: "relative" },
  bgGrain: { position: "fixed", inset: 0, opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px", pointerEvents: "none", zIndex: 0 },
  header: { background: "#1C1408", position: "relative", zIndex: 10 },
  headerInner: { maxWidth: 860, margin: "0 auto", padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logoRow: { display: "flex", alignItems: "center", gap: 14 },
  logoMark: { width: 42, height: 42, background: "linear-gradient(135deg, #C8963E, #8B5E1A)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 16, color: "#1C1408", letterSpacing: "0.05em", flexShrink: 0 },
  logoName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#F5F0E8", letterSpacing: "0.02em", lineHeight: 1.2 },
  logoSub: { fontSize: 10, color: "#C8963E", fontWeight: 300, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 },
  headerBadge: { background: "#8B1A1A", color: "#F5F0E8", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20 },
  headerLine: { height: 2, background: "linear-gradient(90deg, #8B1A1A, #C8963E, #8B1A1A)" },
  main: { maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px", position: "relative", zIndex: 1 },
  hero: { textAlign: "center", marginBottom: 48 },
  heroEyebrow: { display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C8963E", background: "rgba(200,150,62,0.1)", border: "1px solid rgba(200,150,62,0.25)", borderRadius: 20, padding: "5px 16px", marginBottom: 20 },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 6vw, 50px)", fontWeight: 600, lineHeight: 1.15, color: "#1C1408", margin: "0 0 16px 0" },
  heroAccent: { color: "#8B1A1A", fontStyle: "italic" },
  heroSub: { color: "#6B5F52", fontSize: 15, fontWeight: 300, lineHeight: 1.75, maxWidth: 500, margin: "0 auto" },
  steps: { display: "flex", marginBottom: 40, background: "#1C1408", borderRadius: 14, overflow: "hidden" },
  step: { flex: 1, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderRight: "1px solid rgba(245,240,232,0.08)" },
  stepNum: { width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #C8963E, #8B5E1A)", color: "#1C1408", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepLabel: { color: "#D4C9B8", fontSize: 13, fontWeight: 400, lineHeight: 1.3 },
  card: { background: "#FDFAF5", border: "1px solid #E0D6C5", borderRadius: 18, padding: "32px", marginBottom: 24, boxShadow: "0 4px 32px rgba(28,20,8,0.06)" },
  cardLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B5F52", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #E0D6C5" },
  labelDot: { width: 8, height: 8, borderRadius: "50%", background: "#C8963E", display: "inline-block" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, fontWeight: 600, color: "#8B7D6E", letterSpacing: "0.08em", textTransform: "uppercase" },
  input: { fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#1C1408", background: "white", border: "1.5px solid #E0D6C5", borderRadius: 9, padding: "11px 14px", transition: "all 0.2s", width: "100%" },
  textarea: { minHeight: 130, resize: "vertical", lineHeight: 1.65 },
  pillWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: { padding: "8px 16px", borderRadius: 8, border: "1.5px solid #E0D6C5", background: "white", color: "#6B5F52", fontSize: 13, fontWeight: 400, transition: "all 0.18s" },
  pillDark: { background: "#1C1408", borderColor: "#1C1408", color: "#F5F0E8", fontWeight: 500 },
  pillWine: { background: "#8B1A1A", borderColor: "#8B1A1A", color: "#F5F0E8", fontWeight: 500 },
  errorMsg: { color: "#c0392b", fontSize: 12, marginTop: 4 },
  genBtn: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #8B1A1A, #6e1414)", color: "#F5F0E8", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s", boxShadow: "0 4px 16px rgba(139,26,26,0.25)" },
  btnDisabled: { opacity: 0.65, cursor: "not-allowed", boxShadow: "none" },
  spinnerEl: { display: "inline-block", width: 16, height: 16, border: "2px solid rgba(245,240,232,0.3)", borderTopColor: "#F5F0E8", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  replyCard: { background: "white", border: "1.5px solid #E0D6C5", borderRadius: 12, padding: "22px 24px", marginBottom: 14 },
  replyHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  replyLabel: { fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontStyle: "italic", color: "#8B1A1A", fontWeight: 600 },
  copyBtn: { fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B5F52", background: "#F5F0E8", border: "1px solid #E0D6C5", borderRadius: 7, padding: "5px 14px", transition: "all 0.2s" },
  copyDone: { color: "#2d7a4e", borderColor: "#2d7a4e", background: "#f0faf4" },
  replyText: { fontSize: 14, lineHeight: 1.8, color: "#2A2018", whiteSpace: "pre-wrap" },
  tip: { background: "#FFF8EC", border: "1px solid #E8D5A0", borderRadius: 10, padding: "14px 18px", fontSize: 13, color: "#7A6010", lineHeight: 1.65, marginBottom: 16 },
  regenBtn: { width: "100%", padding: "13px", background: "transparent", color: "#1C1408", border: "1.5px solid #1C1408", borderRadius: 11, fontSize: 14, fontWeight: 500, transition: "all 0.2s" },
  footer: { borderTop: "1px solid #E0D6C5", padding: "24px", textAlign: "center", position: "relative", zIndex: 1 },
  footerText: { fontSize: 12, color: "#9e9488", letterSpacing: "0.04em" },
};
