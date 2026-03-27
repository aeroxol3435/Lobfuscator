import { useState, useRef } from "react";
import { obfuscate } from "@/lib/obfuscation";

const BASE = import.meta.env.BASE_URL;

const TA_STYLE: React.CSSProperties = {
  width: "100%",
  background: "#0d1117",
  color: "#e6edf3",
  border: "1px solid #30363d",
  borderRadius: 8,
  padding: "12px 14px",
  resize: "vertical",
  fontFamily: "Consolas,'JetBrains Mono','Fira Code',monospace",
  fontSize: 12.5,
  lineHeight: 1.65,
  outline: "none",
  boxSizing: "border-box" as const,
};

const BTN: React.CSSProperties = {
  border: "1px solid #30363d",
  borderRadius: 7,
  padding: "7px 14px",
  fontSize: 12.5,
  fontWeight: 600,
  cursor: "pointer",
  background: "#161b22",
  color: "#c9d1d9",
  letterSpacing: "0.01em",
};

const BTN_PRIMARY: React.CSSProperties = {
  ...BTN,
  background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  color: "#fff",
  border: "1px solid #6d28d9",
  padding: "9px 28px",
  fontSize: 14,
  fontWeight: 700,
};

const LABEL: React.CSSProperties = {
  fontSize: 11,
  color: "#8b949e",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  marginBottom: 6,
  display: "block",
};

export default function Obfuscator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const outFileRef = useRef<HTMLInputElement>(null);

  function handleObfuscate() {
    if (!input.trim()) return;
    const result = obfuscate(input);
    setOutput(result.code);
    setCopied(false);
    setSaveMsg("");
    // Store original to MongoDB
    const firstWords = input.trim().split(/\s+/).slice(0, 3).join("_").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 40) || "untitled";
    setSaving(true);
    fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: firstWords, content: input }),
    })
      .then(r => r.ok ? setSaveMsg("Saved to database.") : setSaveMsg(""))
      .catch(() => setSaveMsg(""))
      .finally(() => setSaving(false));
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleClear() { setInput(""); setOutput(""); setSaveMsg(""); }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch { /* ignore */ }
  }

  function handleFileLoad(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setInput(ev.target?.result as string ?? "");
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleOutFileLoad(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setOutput(ev.target?.result as string ?? "");
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "obfuscated.lua";
    a.click();
  }

  function handleDeobfuscatorClick() {
    const pw = window.prompt("Enter password:");
    if (pw === null) return;
    if (pw === "@ILoveCookies67!") {
      window.location.href = BASE + "deobfuscator";
    } else {
      window.location.reload();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "Inter,system-ui,sans-serif", margin: 0, padding: 0 }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #21262d", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#8b5cf6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            🔐
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>lobfuscator</span>
          <span style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 20, padding: "2px 10px", fontSize: 11, color: "#8b949e" }}>v2.0</span>
        </div>
        <button onClick={handleDeobfuscatorClick} style={{ ...BTN, fontSize: 12, color: "#8b949e" }}>
          Deobfuscator
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, margin: "0 0 10px", background: "linear-gradient(135deg,#c084fc,#818cf8,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em" }}>
            Lua Code Obfuscator
          </h1>
          <p style={{ color: "#8b949e", fontSize: 14.5, margin: 0 }}>
            20 advanced randomized obfuscation methods — Roblox compatible.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* INPUT PANEL */}
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={LABEL}>Source Code</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={handlePaste} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5 }}>Paste</button>
                <button onClick={() => fileRef.current?.click()} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5 }}>Add File</button>
                <button onClick={handleClear} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5, color: "#f85149" }}>Clear</button>
              </div>
            </div>
            <input ref={fileRef} type="file" accept=".lua,.txt" style={{ display: "none" }} onChange={handleFileLoad} />
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={"-- Paste your Lua code here...\n-- Or use Paste / Add File above\n\nprint('Hello Roblox!')"}
              style={{ ...TA_STYLE, height: 320, color: "#e6edf3" }}
              onFocus={e => { e.target.style.borderColor = "#8b5cf6"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.15)"; }}
              onBlur={e => { e.target.style.borderColor = "#30363d"; e.target.style.boxShadow = "none"; }}
            />
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                onClick={handleObfuscate}
                disabled={!input.trim()}
                style={{ ...BTN_PRIMARY, flex: 1, opacity: input.trim() ? 1 : 0.5, cursor: input.trim() ? "pointer" : "not-allowed" }}
              >
                Obfuscate
              </button>
            </div>
            {saving && <div style={{ marginTop: 8, fontSize: 11.5, color: "#8b949e" }}>Saving to database...</div>}
            {saveMsg && <div style={{ marginTop: 8, fontSize: 11.5, color: "#3fb950" }}>{saveMsg}</div>}
          </div>

          {/* OUTPUT PANEL */}
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={LABEL}>Obfuscated Output</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={handleCopy} disabled={!output} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5, opacity: output ? 1 : 0.4, background: copied ? "#1f6feb" : "#161b22", color: copied ? "#fff" : "#c9d1d9" }}>
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={handleDownload} disabled={!output} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5, opacity: output ? 1 : 0.4 }}>Download</button>
                <button onClick={() => outFileRef.current?.click()} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5 }}>Load File</button>
              </div>
            </div>
            <input ref={outFileRef} type="file" accept=".lua,.txt" style={{ display: "none" }} onChange={handleOutFileLoad} />
            <textarea
              readOnly
              value={output}
              placeholder={"-- Obfuscated output will appear here...\n-- Click Obfuscate to generate"}
              style={{ ...TA_STYLE, height: 320, color: output ? "#7ee787" : "#484f58" }}
            />
            <div style={{ marginTop: 12, fontSize: 11.5, color: "#8b949e", minHeight: 20 }}>
              {output ? `${output.length.toLocaleString()} characters` : ""}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 24 }}>
          {[
            { icon: "🎲", title: "20 Orders", desc: "Randomly selected from 20 advanced encoding chains each time" },
            { icon: "🎮", title: "Roblox Ready", desc: "Compatible with Luau — tested decimal escapes, base64, ROT13" },
            { icon: "🔒", title: "Multi-Layer", desc: "Up to 7 encoding layers including base64, decimal, reverse, ROT13" },
          ].map(c => (
            <div key={c.title} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
