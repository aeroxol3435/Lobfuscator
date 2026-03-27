import { useState } from "react";
import { deobfuscate, ORDER_NAMES } from "@/lib/obfuscation";

export default function Deobfuscator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ success: boolean; order?: number; result?: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleDeobfuscate() {
    if (!input.trim()) return;
    const r = deobfuscate(input);
    setResult(r);
    setCopied(false);
  }

  function handleCopy() {
    if (!result?.result) return;
    navigator.clipboard.writeText(result.result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "hsl(222 47% 6%)", color: "hsl(210 40% 98%)", fontFamily: "system-ui, sans-serif", padding: "0", margin: "0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "hsl(38 92% 50% / 0.15)", border: "1px solid hsl(38 92% 50% / 0.4)", borderRadius: 8, padding: "4px 14px", marginBottom: 16, fontSize: 12, color: "hsl(38 92% 70%)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Secret Access — Deobfuscator
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, margin: "0 0 12px", background: "linear-gradient(135deg, #fb923c, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
            De-lobfuscator
          </h1>
          <p style={{ color: "hsl(215 20% 55%)", fontSize: 15, margin: 0 }}>
            Paste obfuscated lobfuscator code to decode it. Only accepts valid lobfuscator output.
          </p>
        </div>

        {result && result.success && result.order && (
          <div style={{ background: "hsl(38 92% 50% / 0.1)", border: "1px solid hsl(38 92% 50% / 0.35)", borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ background: "hsl(38 92% 50%)", color: "hsl(222 47% 6%)", borderRadius: 6, padding: "2px 10px", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>
              ORDER {result.order}
            </span>
            <span style={{ color: "hsl(38 92% 70%)", fontSize: 14 }}>
              {ORDER_NAMES[result.order]}
            </span>
          </div>
        )}

        {result && !result.success && (
          <div style={{ background: "hsl(0 72% 51% / 0.1)", border: "1px solid hsl(0 72% 51% / 0.4)", borderRadius: 8, padding: "10px 16px", marginBottom: 20, color: "hsl(0 72% 70%)", fontSize: 14 }}>
            {result.error}
          </div>
        )}

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px", minWidth: 280 }}>
            <label style={{ display: "block", fontSize: 12, color: "hsl(215 20% 55%)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Obfuscated Code Input
            </label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={"-- (This text is obfuscated by lobfuscator)\n-- [3]\n\n--[[\n...\n]]--\n\n..."}
              style={{
                width: "100%",
                height: 340,
                background: "hsl(222 47% 9%)",
                color: "hsl(210 40% 98%)",
                border: "1px solid hsl(217 32% 20%)",
                borderRadius: 8,
                padding: "12px 14px",
                resize: "vertical",
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontSize: 12,
                lineHeight: 1.5,
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => { e.target.style.borderColor = "hsl(38 92% 50%)"; e.target.style.boxShadow = "0 0 0 2px hsl(38 92% 50% / 0.2)"; }}
              onBlur={e => { e.target.style.borderColor = "hsl(217 32% 20%)"; e.target.style.boxShadow = "none"; }}
            />
            <button
              onClick={handleDeobfuscate}
              style={{
                marginTop: 12,
                width: "100%",
                background: "hsl(38 92% 50%)",
                color: "hsl(222 47% 6%)",
                border: "none",
                borderRadius: 8,
                padding: "11px 28px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Deobfuscate
            </button>
          </div>

          <div style={{ flex: "1 1 380px", minWidth: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ display: "block", fontSize: 12, color: "hsl(215 20% 55%)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Decoded Lua Code
              </label>
              {result?.result && (
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? "hsl(142 76% 36%)" : "hsl(217 32% 14%)",
                    color: "hsl(210 40% 98%)",
                    border: "1px solid hsl(217 32% 25%)",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={result?.result ?? ""}
              placeholder="Decoded output will appear here..."
              style={{
                width: "100%",
                height: 340,
                background: "hsl(222 47% 9%)",
                color: result?.result ? "hsl(142 76% 56%)" : "hsl(215 20% 35%)",
                border: "1px solid hsl(217 32% 20%)",
                borderRadius: 8,
                padding: "12px 14px",
                resize: "vertical",
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontSize: 13,
                lineHeight: 1.6,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {result?.success && result.order && (
              <div style={{ marginTop: 10, padding: "8px 12px", background: "hsl(222 47% 9%)", border: "1px solid hsl(217 32% 18%)", borderRadius: 8, fontSize: 12, color: "hsl(215 20% 50%)" }}>
                Obfuscation type detected: <span style={{ color: "hsl(38 92% 65%)", fontWeight: 600 }}>Order {result.order} — {ORDER_NAMES[result.order]}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <a
            href={import.meta.env.BASE_URL}
            style={{
              background: "transparent",
              color: "hsl(215 20% 35%)",
              border: "1px solid hsl(217 32% 18%)",
              borderRadius: 8,
              padding: "8px 20px",
              fontSize: 12,
              cursor: "pointer",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            ← Back to Obfuscator
          </a>
        </div>
      </div>
    </div>
  );
}
