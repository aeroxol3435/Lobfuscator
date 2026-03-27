import { useState, useRef } from "react";
import { deobfuscate, ORDER_NAMES } from "@/lib/obfuscation";

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
};

const LABEL: React.CSSProperties = {
  fontSize: 11,
  color: "#8b949e",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  marginBottom: 6,
  display: "block",
};

export default function Deobfuscator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ success: boolean; order?: number; result?: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const inFileRef = useRef<HTMLInputElement>(null);
  const outFileRef = useRef<HTMLInputElement>(null);

  function handleDeobfuscate() {
    if (!input.trim()) return;
    setResult(deobfuscate(input));
    setCopied(false);
  }

  function handleCopy() {
    if (!result?.result) return;
    navigator.clipboard.writeText(result.result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleClearIn() { setInput(""); setResult(null); }
  function handleClearOut() { setResult(null); }

  async function handlePasteIn() {
    try { setInput(await navigator.clipboard.readText()); } catch { /* ignore */ }
  }

  function handleFileIn(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setInput(ev.target?.result as string ?? "");
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleFileOut(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { /* load into output display, not applicable here */ };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleDownload() {
    if (!result?.result) return;
    const blob = new Blob([result.result], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "decoded.lua";
    a.click();
  }

  const orderNum = result?.success && result.order ? result.order : null;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "Inter,system-ui,sans-serif", margin: 0, padding: 0 }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #21262d", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            🔓
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>De-lobfuscator</span>
          <span style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 20, padding: "2px 10px", fontSize: 11, color: "#f59e0b" }}>Secret</span>
        </div>
        <a href={BASE} style={{ ...BTN, textDecoration: "none", fontSize: 12, color: "#8b949e" }}>
          ← Obfuscator
        </a>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, margin: "0 0 10px", background: "linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em" }}>
            Decode Obfuscated Code
          </h1>
          <p style={{ color: "#8b949e", fontSize: 14, margin: 0 }}>
            Paste lobfuscator output. Only accepts valid lobfuscator code with the correct header.
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" as const }}>
          {/* LEFT — Order info + input */}
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            {/* Order info box */}
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: 16, marginBottom: 16, minHeight: 80 }}>
              <div style={{ fontSize: 11, color: "#8b949e", textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 10 }}>Detected Obfuscation Order</div>
              {orderNum ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#0d1117", borderRadius: 6, padding: "3px 12px", fontWeight: 800, fontSize: 14, fontFamily: "monospace" }}>
                      ORDER {orderNum}
                    </span>
                    <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 600 }}>{ORDER_NAMES[orderNum]}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#8b949e" }}>
                    Detected from hidden marker — decoded successfully.
                  </div>
                </div>
              ) : result && !result.success ? (
                <div style={{ color: "#f85149", fontSize: 13 }}>{result.error}</div>
              ) : (
                <div style={{ color: "#484f58", fontSize: 13 }}>Order info will appear here after decoding.</div>
              )}
            </div>

            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={LABEL}>Obfuscated Input</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={handlePasteIn} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5 }}>Paste</button>
                  <button onClick={() => inFileRef.current?.click()} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5 }}>Add File</button>
                  <button onClick={handleClearIn} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5, color: "#f85149" }}>Clear</button>
                </div>
              </div>
              <input ref={inFileRef} type="file" accept=".lua,.txt" style={{ display: "none" }} onChange={handleFileIn} />
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={"-- This file is obfuscated by Lobfuscator, Lobfuscator.netlify.app\n\n--[[\n... (garbage block) ...\n]]--\n\nlocal ... = [[...]]"}
                style={{ ...TA_STYLE, height: 300, color: "#e6edf3" }}
                onFocus={e => { e.target.style.borderColor = "#f59e0b"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "#30363d"; e.target.style.boxShadow = "none"; }}
              />
              <button
                onClick={handleDeobfuscate}
                disabled={!input.trim()}
                style={{ marginTop: 12, width: "100%", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#0d1117", border: "none", borderRadius: 8, padding: "10px", fontWeight: 700, fontSize: 14, cursor: input.trim() ? "pointer" : "not-allowed", opacity: input.trim() ? 1 : 0.5 }}
              >
                Deobfuscate
              </button>
            </div>
          </div>

          {/* RIGHT — Output */}
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 18, height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={LABEL}>Decoded Lua Code</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={handleCopy} disabled={!result?.result} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5, opacity: result?.result ? 1 : 0.4, background: copied ? "#1f6feb" : "#161b22", color: copied ? "#fff" : "#c9d1d9" }}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button onClick={handleDownload} disabled={!result?.result} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5, opacity: result?.result ? 1 : 0.4 }}>Download</button>
                  <button onClick={handleClearOut} disabled={!result} style={{ ...BTN, padding: "4px 11px", fontSize: 11.5, opacity: result ? 1 : 0.4, color: "#f85149" }}>Clear</button>
                </div>
              </div>
              <input ref={outFileRef} type="file" accept=".lua,.txt" style={{ display: "none" }} onChange={handleFileOut} />
              <textarea
                readOnly
                value={result?.result ?? ""}
                placeholder={"-- Decoded source code will appear here...\n-- Paste obfuscated code on the left\n-- then click Deobfuscate"}
                style={{ ...TA_STYLE, height: 420, color: result?.result ? "#7ee787" : "#484f58" }}
              />
              {result?.result && (
                <div style={{ marginTop: 8, fontSize: 11.5, color: "#8b949e" }}>
                  {result.result.length.toLocaleString()} characters decoded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
