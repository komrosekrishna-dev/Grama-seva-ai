import { useState, useEffect } from "react";

const translations = {
  en: {
    title: "Graama Seva AI",
    subtitle: "Government Certificate Guide",
    tagline: "Get the right steps & local help — instantly",
    selectCert: "Which certificate do you need?",
    selectState: "Your State",
    askBtn: "Get Help",
    loading: "Finding steps & local helpers...",
    stepsTitle: "Step-by-Step Process",
    helpersTitle: "Local People Who Can Help You",
    langToggle: "తెలుగులో చూడు",
    placeholder: "Type your question here...",
    orAsk: "Or ask in your own words",
    sendBtn: "Ask AI",
    certs: ["Birth Certificate", "Death Certificate", "Caste Certificate", "Income Certificate", "Residence Certificate"],
    tabGuide: "📋 Certificate Guide",
    tabDraft: "✍️ Draft Application",
    draftIntro: "Fill your details — AI will write a ready-to-submit application letter",
    draftCertLabel: "Certificate you're applying for",
    nameLabel: "Your Full Name",
    fatherLabel: "Father's / Husband's Name",
    villageLabel: "Village",
    mandalLabel: "Mandal",
    districtLabel: "District",
    reasonLabel: "Reason / Purpose (e.g. school admission, bank loan, pension)",
    reasonPlaceholder: "e.g. Needed for my daughter's school admission",
    generateLetterBtn: "Generate Application Letter",
    letterLoading: "Drafting your application letter...",
    letterTitle: "Your Application Letter",
    addressedToLabel: "Addressed To",
    subjectLabel: "Subject",
    copyBtn: "Copy Text",
    copiedBtn: "Copied!",
    requiredMsg: "Please fill Name, Village and Reason at least",
    pwaInstallBtn: "📲 Install App",
    pwaInstalled: "App Installed!",
  },
  te: {
    title: "గ్రామ సేవ AI",
    subtitle: "ప్రభుత్వ సర్టిఫికేట్ గైడ్",
    tagline: "సరైన దశలు & స్థానిక సహాయం — వెంటనే పొందండి",
    selectCert: "మీకు ఏ సర్టిఫికేట్ కావాలి?",
    selectState: "మీ రాష్ట్రం",
    askBtn: "సహాయం పొందండి",
    loading: "దశలు & స్థానిక సహాయకులను వెతుకుతున్నాం...",
    stepsTitle: "దశల వారీ ప్రక్రియ",
    helpersTitle: "మీకు సహాయపడే స్థానిక వ్యక్తులు",
    langToggle: "View in English",
    placeholder: "మీ ప్రశ్న ఇక్కడ టైప్ చేయండి...",
    orAsk: "లేదా మీ స్వంత మాటల్లో అడగండి",
    sendBtn: "AI ని అడగండి",
    certs: ["పుట్టిన సర్టిఫికేట్", "మరణ సర్టిఫికేట్", "కుల సర్టిఫికేట్", "ఆదాయ సర్టిఫికేట్", "నివాస సర్టిఫికేట్"],
    tabGuide: "📋 సర్టిఫికేట్ గైడ్",
    tabDraft: "✍️ దరఖాస్తు రాయండి",
    draftIntro: "మీ వివరాలు నింపండి — AI సమర్పించడానికి సిద్ధంగా ఉన్న దరఖాస్తు లేఖను రాస్తుంది",
    draftCertLabel: "మీరు దరఖాస్తు చేస్తున్న సర్టిఫికేట్",
    nameLabel: "మీ పూర్తి పేరు",
    fatherLabel: "తండ్రి / భర్త పేరు",
    villageLabel: "గ్రామం",
    mandalLabel: "మండలం",
    districtLabel: "జిల్లా",
    reasonLabel: "కారణం / ఉద్దేశం (ఉ. స్కూల్ అడ్మిషన్, బ్యాంక్ లోన్, పెన్షన్)",
    reasonPlaceholder: "ఉ. నా కుమార్తె స్కూల్ అడ్మిషన్ కోసం అవసరం",
    generateLetterBtn: "దరఖాస్తు లేఖ తయారు చేయండి",
    letterLoading: "మీ దరఖాస్తు లేఖను తయారు చేస్తున్నాం...",
    letterTitle: "మీ దరఖాస్తు లేఖ",
    addressedToLabel: "ఎవరికి పంపించాలి",
    subjectLabel: "విషయం",
    copyBtn: "టెక్స్ట్ కాపీ చేయండి",
    copiedBtn: "కాపీ అయింది!",
    requiredMsg: "దయచేసి పేరు, గ్రామం మరియు కారణం కనీసం నింపండి",
    pwaInstallBtn: "📲 యాప్ ఇన్‌స్టాల్ చేయండి",
    pwaInstalled: "యాప్ ఇన్‌స్టాల్ అయింది!",
  }
};

const certKeysEN = ["Birth Certificate", "Death Certificate", "Caste Certificate", "Income Certificate", "Residence Certificate"];

export default function App() {
  const [lang, setLang] = useState("en");
  const [selectedCert, setSelectedCert] = useState("");
  const [customQ, setCustomQ] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shared, setShared] = useState(false);
  const [mode, setMode] = useState("guide"); // "guide" | "draft"

  // Draft application state
  const [draftCert, setDraftCert] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [village, setVillage] = useState("");
  const [mandal, setMandal] = useState("");
  const [district, setDistrict] = useState("");
  const [reason, setReason] = useState("");
  const [letterResult, setLetterResult] = useState(null);
  const [letterLoading, setLetterLoading] = useState(false);
  const [letterError, setLetterError] = useState("");
  const [copied, setCopied] = useState(false);
  const [letterShared, setLetterShared] = useState(false);

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  const t = translations[lang];

  const buildWhatsAppText = (data, certName) => {
    const title = certName || (lang === "en" ? "Government Certificate Guide" : "ప్రభుత్వ సర్టిఫికేట్ గైడ్");
    const header = lang === "en"
      ? `📜 *${title}* — Graama Seva AI\n\n`
      : `📜 *${title}* — గ్రామ సేవ AI\n\n`;

    const stepsLabel = lang === "en" ? "✅ *Steps:*\n" : "✅ *దశలు:*\n";
    const steps = data.steps?.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n\n";

    const docsLabel = lang === "en" ? "📁 *Documents Needed:*\n" : "📁 *అవసరమైన పత్రాలు:*\n";
    const docs = data.documents?.map(d => `• ${d}`).join("\n") + "\n\n";

    const timeLabel = lang === "en" ? `⏱️ *Time:* ${data.timeframe}\n` : `⏱️ *సమయం:* ${data.timeframe}\n`;
    const feeLabel = lang === "en" ? `💰 *Fees:* ${data.fees}\n\n` : `💰 *రుసుము:* ${data.fees}\n\n`;

    const helpersLabel = lang === "en" ? "👥 *Who can help:*\n" : "👥 *సహాయపడే వ్యక్తులు:*\n";
    const helpers = data.helpers?.map(h => `• ${h.role} — ${h.tip}`).join("\n") + "\n\n";

    const noteLabel = data.note ? (lang === "en" ? `⚠️ *Tip:* ${data.note}\n\n` : `⚠️ *సూచన:* ${data.note}\n\n`) : "";

    const footer = lang === "en"
      ? "_Shared via Graama Seva AI — Free Government Certificate Helper_"
      : "_గ్రామ సేవ AI ద్వారా షేర్ చేయబడింది — ఉచిత సర్టిఫికేట్ గైడ్_";

    return encodeURIComponent(header + stepsLabel + steps + docsLabel + docs + timeLabel + feeLabel + helpersLabel + helpers + noteLabel + footer);
  };

  const handleWhatsAppShare = () => {
    if (!result) return;
    const text = buildWhatsAppText(result, selectedCert || customQ);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  const getSystemPrompt = () => `You are a helpful government services assistant for rural villages in India, especially Telangana/Andhra Pradesh.
When asked about getting a government certificate, respond ONLY in valid JSON with this structure:
{
  "steps": ["step 1", "step 2", "step 3", ...],
  "documents": ["doc 1", "doc 2", ...],
  "helpers": [
    {"role": "VRO (Village Revenue Officer)", "duty": "Issues most certificates at village level", "tip": "Visit on working days 10am-4pm"},
    {"role": "CSC Operator (Common Service Centre)", "duty": "Online applications & digital certificates", "tip": "Usually found in gram panchayat office"},
    {"role": "Gram Panchayat Secretary", "duty": "Local verification & recommendation letters", "tip": "Available at panchayat bhavan"},
    {"role": "Meeseva Centre", "duty": "Telangana government online services", "tip": "Pay small fee, get certificate in 1-7 days"}
  ],
  "timeframe": "Expected time to get certificate",
  "fees": "Approximate fees",
  "onlineLink": "Relevant government portal URL",
  "note": "One important tip"
}
${lang === "te" ? "Respond with all text content in Telugu language." : "Respond in English."}
Be specific to Indian rural context. Keep steps simple and practical.`;

  const handleAsk = async () => {
    const query = selectedCert || customQ;
    if (!query) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = selectedCert
        ? `How to get ${certKeysEN[t.certs.indexOf(selectedCert)] || selectedCert} in India (rural Telangana/AP context)?`
        : query;

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: getSystemPrompt(),
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setResult({ error: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  const getLetterSystemPrompt = () => `You are an assistant that drafts formal Indian government application letters for rural citizens applying for civil certificates (birth, death, caste, income, residence) in Telangana/Andhra Pradesh.
Respond ONLY in valid JSON with this structure:
{
  "addressedTo": "Correct officer title, e.g. The Village Revenue Officer (VRO) / The Tahsildar, [Mandal Name]",
  "subject": "One line subject for the letter",
  "letter": "Full formal letter body including date placeholder, salutation (Sir/Madam), body paragraphs explaining the request using the applicant's details and reason, and a polite closing with 'Yours faithfully' and signature line with applicant's name"
}
${lang === "te" ? "Write the ENTIRE letter in Telugu language, including salutation and closing, in formal/polite register suitable for a government office." : "Write the entire letter in formal English suitable for an Indian government office."}
Keep the letter concise (under 200 words), simple, and ready to print or copy as-is. Use the exact applicant details provided without inventing extra information.`;

  const handleGenerateLetter = async () => {
    if (!applicantName.trim() || !village.trim() || !reason.trim()) {
      setLetterError(t.requiredMsg);
      return;
    }
    setLetterError("");
    setLetterLoading(true);
    setLetterResult(null);
    try {
      const certName = draftCert || t.certs[0];
      const prompt = `Applicant details:
Name: ${applicantName}
Father's/Husband's Name: ${fatherName || "-"}
Village: ${village}
Mandal: ${mandal || "-"}
District: ${district || "-"}
Certificate requested: ${certName}
Reason/Purpose: ${reason}

Draft the application letter as per the system instructions.`;

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: getLetterSystemPrompt(),
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setLetterResult(parsed);
    } catch (e) {
      setLetterError(lang === "en" ? "Something went wrong. Please try again." : "ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.");
    }
    setLetterLoading(false);
  };

  const handleCopyLetter = () => {
    if (!letterResult) return;
    const fullText = `${letterResult.addressedTo}\n\n${lang === "en" ? "Subject" : "విషయం"}: ${letterResult.subject}\n\n${letterResult.letter}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLetterWhatsAppShare = () => {
    if (!letterResult) return;
    const fullText = `📜 *${letterResult.subject}*\n\n${letterResult.addressedTo}\n\n${letterResult.letter}\n\n_${lang === "en" ? "Drafted via Graama Seva AI" : "గ్రామ సేవ AI ద్వారా తయారు చేయబడింది"}_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, "_blank");
    setLetterShared(true);
    setTimeout(() => setLetterShared(false), 3000);
  };


  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f4c35 0%, #1a6b4a 40%, #2d8f65 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "rgba(0,0,0,0.25)",
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(8px)",
      }}>
        <div>
          <div style={{ color: "#f0c040", fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>{t.title}</div>
          <div style={{ color: "#a8d5b8", fontSize: 12 }}>{t.subtitle}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {deferredPrompt && !installed && (
            <button onClick={handleInstallClick} style={{
              background: "rgba(255,255,255,0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 20,
              padding: "8px 12px",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer"
            }}>{t.pwaInstallBtn}</button>
          )}
          {installed && (
            <span style={{ color: "#a8d5b8", fontSize: 12 }}>✅ {t.pwaInstalled}</span>
          )}
          <button onClick={() => setLang(lang === "en" ? "te" : "en")} style={{
            background: "#f0c040",
            color: "#0f4c35",
            border: "none",
            borderRadius: 20,
            padding: "8px 14px",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer"
          }}>{t.langToggle}</button>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px" }}>
        {/* Hero */}
        <div style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "20px",
          marginBottom: 20,
          border: "1px solid rgba(255,255,255,0.15)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📜</div>
          <div style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{t.tagline}</div>
          <div style={{ color: "#a8d5b8", fontSize: 13 }}>
            {lang === "en" ? "Select a certificate below or ask your own question" : "దిగువ సర్టిఫికేట్ ఎంచుకోండి లేదా మీ ప్రశ్న అడగండి"}
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: "flex",
          gap: 6,
          background: "rgba(0,0,0,0.2)",
          borderRadius: 14,
          padding: 4,
          marginBottom: 20,
        }}>
          <button onClick={() => setMode("guide")} style={{
            flex: 1,
            background: mode === "guide" ? "#f0c040" : "transparent",
            color: mode === "guide" ? "#0f4c35" : "#a8d5b8",
            border: "none",
            borderRadius: 10,
            padding: "10px 8px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s"
          }}>{t.tabGuide}</button>
          <button onClick={() => setMode("draft")} style={{
            flex: 1,
            background: mode === "draft" ? "#f0c040" : "transparent",
            color: mode === "draft" ? "#0f4c35" : "#a8d5b8",
            border: "none",
            borderRadius: 10,
            padding: "10px 8px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s"
          }}>{t.tabDraft}</button>
        </div>

        {mode === "guide" && (
        <>
        {/* Certificate Buttons */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#a8d5b8", fontSize: 13, marginBottom: 10, fontWeight: 600 }}>{t.selectCert}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {t.certs.map((cert, i) => (
              <button key={i} onClick={() => { setSelectedCert(cert); setCustomQ(""); }}
                style={{
                  background: selectedCert === cert ? "#f0c040" : "rgba(255,255,255,0.1)",
                  color: selectedCert === cert ? "#0f4c35" : "#ffffff",
                  border: selectedCert === cert ? "none" : "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 20,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: selectedCert === cert ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}>
                {cert}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Question */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#a8d5b8", fontSize: 13, marginBottom: 8, fontWeight: 600 }}>{t.orAsk}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={customQ}
              onChange={e => { setCustomQ(e.target.value); setSelectedCert(""); }}
              placeholder={t.placeholder}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#fff",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button onClick={handleAsk} style={{
              background: "#f0c040",
              color: "#0f4c35",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer"
            }}>{t.sendBtn}</button>
          </div>
        </div>

        {/* Main CTA */}
        {(selectedCert) && (
          <button onClick={handleAsk} style={{
            width: "100%",
            background: "linear-gradient(90deg, #f0c040, #e8a020)",
            color: "#0f4c35",
            border: "none",
            borderRadius: 12,
            padding: "14px",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            marginBottom: 20,
            boxShadow: "0 4px 20px rgba(240,192,64,0.3)"
          }}>
            {t.askBtn} →
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 20,
            textAlign: "center",
            color: "#a8d5b8"
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
            <div>{t.loading}</div>
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Steps */}
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 18, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "#f0c040", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📋 {t.stepsTitle}</div>
              {result.steps?.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{
                    background: "#f0c040", color: "#0f4c35", borderRadius: "50%",
                    width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 12, flexShrink: 0, marginTop: 1
                  }}>{i + 1}</div>
                  <div style={{ color: "#e8f5ee", fontSize: 14, lineHeight: 1.5 }}>{step}</div>
                </div>
              ))}
            </div>

            {/* Documents */}
            {result.documents?.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 18, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#f0c040", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                  📁 {lang === "en" ? "Documents Needed" : "అవసరమైన పత్రాలు"}
                </div>
                {result.documents.map((doc, i) => (
                  <div key={i} style={{ color: "#e8f5ee", fontSize: 14, marginBottom: 6, display: "flex", gap: 8 }}>
                    <span style={{ color: "#f0c040" }}>✓</span> {doc}
                  </div>
                ))}
              </div>
            )}

            {/* Time & Fees */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>⏱️</div>
                <div style={{ color: "#a8d5b8", fontSize: 11, marginBottom: 4 }}>{lang === "en" ? "Time" : "సమయం"}</div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{result.timeframe}</div>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>💰</div>
                <div style={{ color: "#a8d5b8", fontSize: 11, marginBottom: 4 }}>{lang === "en" ? "Fees" : "రుసుము"}</div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{result.fees}</div>
              </div>
            </div>

            {/* Local Helpers */}
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 18, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "#f0c040", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>👥 {t.helpersTitle}</div>
              {result.helpers?.map((h, i) => (
                <div key={i} style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  borderLeft: "3px solid #f0c040"
                }}>
                  <div style={{ color: "#f0c040", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{h.role}</div>
                  <div style={{ color: "#c8e8d8", fontSize: 13, marginBottom: 4 }}>{h.duty}</div>
                  <div style={{ color: "#a8d5b8", fontSize: 12 }}>💡 {h.tip}</div>
                </div>
              ))}
            </div>

            {/* Online Link */}
            {result.onlineLink && (
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#f0c040", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                  🌐 {lang === "en" ? "Apply Online" : "ఆన్‌లైన్‌లో దరఖాస్తు చేయండి"}
                </div>
                <div style={{ color: "#a8d5b8", fontSize: 13, wordBreak: "break-all" }}>{result.onlineLink}</div>
              </div>
            )}

            {/* Note */}
            {result.note && (
              <div style={{
                background: "rgba(240,192,64,0.1)",
                borderRadius: 12,
                padding: 14,
                border: "1px solid rgba(240,192,64,0.3)"
              }}>
                <div style={{ color: "#f0c040", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  ⚠️ {lang === "en" ? "Important Tip" : "ముఖ్యమైన సూచన"}
                </div>
                <div style={{ color: "#e8f5ee", fontSize: 13 }}>{result.note}</div>
              </div>
            )}

            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              style={{
                width: "100%",
                background: shared
                  ? "linear-gradient(90deg, #1a8a3a, #15703a)"
                  : "linear-gradient(90deg, #25D366, #1ebe5d)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "16px",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
                transition: "all 0.3s",
                letterSpacing: 0.5,
              }}>
              <span style={{ fontSize: 22 }}>
                {shared ? "✅" : (
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="white">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.456.666 4.759 1.822 6.74L2 30l7.463-1.797A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.406 19.594c-.31.87-1.54 1.594-2.516 1.806-.672.143-1.55.257-4.5-.966-3.775-1.554-6.207-5.387-6.397-5.637-.183-.25-1.553-2.063-1.553-3.938 0-1.875.983-2.797 1.332-3.176.348-.38.758-.475.01-.475h-1.003c-.333 0-.87.125-1.326.593-.455.467-1.738 1.698-1.738 4.138 0 2.44 1.78 4.8 2.027 5.133.25.333 3.497 5.337 8.48 7.483 1.183.51 2.107.815 2.826 1.044 1.188.375 2.27.322 3.126.195 0 0 .875-.104 1.876-.845.583-.434.875-1.073.875-1.355z"/>
                  </svg>
                )}
              </span>
              <span>
                {shared
                  ? (lang === "en" ? "Opened WhatsApp!" : "WhatsApp తెరవబడింది!")
                  : (lang === "en" ? "Share on WhatsApp" : "WhatsApp లో షేర్ చేయండి")}
              </span>
            </button>

          </div>
        )}

        {result?.error && (
          <div style={{ background: "rgba(255,80,80,0.15)", borderRadius: 12, padding: 16, color: "#ffaaaa", textAlign: "center" }}>
            {result.error}
          </div>
        )}
        </>
        )}

        {mode === "draft" && (
        <>
          {/* Draft intro */}
          <div style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "18px",
            marginBottom: 18,
            border: "1px solid rgba(255,255,255,0.15)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: 30, marginBottom: 6 }}>✍️</div>
            <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 600 }}>{t.draftIntro}</div>
          </div>

          {/* Certificate type for draft */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "#a8d5b8", fontSize: 13, marginBottom: 10, fontWeight: 600 }}>{t.draftCertLabel}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {t.certs.map((cert, i) => (
                <button key={i} onClick={() => setDraftCert(cert)}
                  style={{
                    background: draftCert === cert ? "#f0c040" : "rgba(255,255,255,0.1)",
                    color: draftCert === cert ? "#0f4c35" : "#ffffff",
                    border: draftCert === cert ? "none" : "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 20,
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: draftCert === cert ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}>
                  {cert}
                </button>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 18,
            border: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}>
            {[
              { label: t.nameLabel, value: applicantName, set: setApplicantName },
              { label: t.fatherLabel, value: fatherName, set: setFatherName },
              { label: t.villageLabel, value: village, set: setVillage },
              { label: t.mandalLabel, value: mandal, set: setMandal },
              { label: t.districtLabel, value: district, set: setDistrict },
            ].map((f, i) => (
              <div key={i}>
                <div style={{ color: "#a8d5b8", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>{f.label}</div>
                <input
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    padding: "9px 12px",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            ))}
            <div>
              <div style={{ color: "#a8d5b8", fontSize: 12, marginBottom: 4, fontWeight: 600 }}>{t.reasonLabel}</div>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={t.reasonPlaceholder}
                rows={3}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {letterError && (
            <div style={{ background: "rgba(255,80,80,0.15)", borderRadius: 10, padding: 12, color: "#ffaaaa", textAlign: "center", marginBottom: 14, fontSize: 13 }}>
              {letterError}
            </div>
          )}

          {/* Generate button */}
          <button onClick={handleGenerateLetter} style={{
            width: "100%",
            background: "linear-gradient(90deg, #f0c040, #e8a020)",
            color: "#0f4c35",
            border: "none",
            borderRadius: 12,
            padding: "14px",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            marginBottom: 20,
            boxShadow: "0 4px 20px rgba(240,192,64,0.3)"
          }}>
            {t.generateLetterBtn} →
          </button>

          {/* Loading */}
          {letterLoading && (
            <div style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
              color: "#a8d5b8"
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              <div>{t.letterLoading}</div>
            </div>
          )}

          {/* Letter Result */}
          {letterResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{
                background: "#fdf8ee",
                borderRadius: 14,
                padding: 20,
                color: "#2a2a2a",
                fontSize: 14,
                lineHeight: 1.7,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
              }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                  {t.addressedToLabel}
                </div>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>{letterResult.addressedTo}</div>

                <div style={{ fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                  {t.subjectLabel}
                </div>
                <div style={{ fontWeight: 700, marginBottom: 14 }}>{letterResult.subject}</div>

                <div style={{ whiteSpace: "pre-wrap" }}>{letterResult.letter}</div>
              </div>

              {/* Copy button */}
              <button onClick={handleCopyLetter} style={{
                width: "100%",
                background: copied ? "rgba(240,192,64,0.3)" : "rgba(255,255,255,0.1)",
                color: copied ? "#f0c040" : "#ffffff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 12,
                padding: "12px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s"
              }}>
                {copied ? `✅ ${t.copiedBtn}` : `📋 ${t.copyBtn}`}
              </button>

              {/* WhatsApp Share */}
              <button onClick={handleLetterWhatsAppShare} style={{
                width: "100%",
                background: letterShared
                  ? "linear-gradient(90deg, #1a8a3a, #15703a)"
                  : "linear-gradient(90deg, #25D366, #1ebe5d)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "16px",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
                transition: "all 0.3s",
                letterSpacing: 0.5,
              }}>
                <svg width="22" height="22" viewBox="0 0 32 32" fill="white">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.456.666 4.759 1.822 6.74L2 30l7.463-1.797A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.406 19.594c-.31.87-1.54 1.594-2.516 1.806-.672.143-1.55.257-4.5-.966-3.775-1.554-6.207-5.387-6.397-5.637-.183-.25-1.553-2.063-1.553-3.938 0-1.875.983-2.797 1.332-3.176.348-.38.758-.475.01-.475h-1.003c-.333 0-.87.125-1.326.593-.455.467-1.738 1.698-1.738 4.138 0 2.44 1.78 4.8 2.027 5.133.25.333 3.497 5.337 8.48 7.483 1.183.51 2.107.815 2.826 1.044 1.188.375 2.27.322 3.126.195 0 0 .875-.104 1.876-.845.583-.434.875-1.073.875-1.355z"/>
                </svg>
                <span>
                  {letterShared
                    ? (lang === "en" ? "Opened WhatsApp!" : "WhatsApp తెరవబడింది!")
                    : (lang === "en" ? "Share on WhatsApp" : "WhatsApp లో షేర్ చేయండి")}
                </span>
              </button>
            </div>
          )}
        </>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 24, paddingBottom: 20 }}>
          Graama Seva AI • For rural communities • {lang === "en" ? "Free to use" : "ఉచితంగా వాడుకోండి"}
        </div>
      </div>
    </div>
  );
}
