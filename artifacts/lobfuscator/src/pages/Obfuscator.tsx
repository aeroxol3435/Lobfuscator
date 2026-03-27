import { useState } from "react";
import { obfuscate, ORDER_NAMES } from "@/lib/obfuscation";

export default function Obfuscator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lastOrder, setLastOrder] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  function handleObfuscate() {
    if (!input.trim()) return;
    const result = obfuscate(input);
    setOutput(result.code);
    setLastOrder(result.order);
    setCopied(false);
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDeobfuscatorClick() {
    const pw = window.prompt("Enter password to access the deobfuscator:");
    if (pw === null) return;
    if (pw === "ilovecookies67") {
      window.location.href = import.meta.env.BASE_URL + "deobfuscator";
    } else {
      window.location.reload();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "hsl(222 47% 6%)", color: "hsl(210 40% 98%)", fontFamily: "system-ui, sans-serif", padding: "0", margin: "0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "hsl(263 70% 58% / 0.15)", border: "1px solid hsl(263 70% 58% / 0.4)", borderRadius: 8, padding: "4px 14px", marginBottom: 16, fontSize: 12, color: "hsl(263 70% 75%)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Lua Obfuscation Engine
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, margin: "0 0 12px", background: "linear-gradient(135deg, #c084fc, #818cf8, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
            lobfuscator
          </h1>
          <p style={{ color: "hsl(215 20% 55%)", fontSize: 15, margin: 0 }}>
            8 randomized obfuscation orders — your code, unreadable.
          </p>
        </div>

        {lastOrder && (
          <div style={{ background: "hsl(263 70% 58% / 0.1)", border: "1px solid hsl(263 70% 58% / 0.35)", borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ background: "hsl(263 70% 58%)", color: "white", borderRadius: 6, padding: "2px 10px", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>
              ORDER {lastOrder}
            </span>
            <span style={{ color: "hsl(263 70% 75%)", fontSize: 14 }}>
              {ORDER_NAMES[lastOrder]}
            </span>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "hsl(215 20% 55%)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Lua Source Code
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your Lua code here..."
            style={{
              width: "100%",
              height: 200,
              background: "hsl(222 47% 9%)",
              color: "hsl(210 40% 98%)",
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
            onFocus={e => { e.target.style.borderColor = "hsl(263 70% 58%)"; e.target.style.boxShadow = "0 0 0 2px hsl(263 70% 58% / 0.2)"; }}
            onBlur={e => { e.target.style.borderColor = "hsl(217 32% 20%)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={handleObfuscate}
            style={{
              background: "hsl(263 70% 58%)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "10px 28px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              flex: 1,
            }}
          >
            Obfuscate
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            style={{
              background: copied ? "hsl(142 76% 36%)" : "hsl(217 32% 14%)",
              color: "hsl(210 40% 98%)",
              border: "1px solid hsl(217 32% 25%)",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 600,
              fontSize: 14,
              cursor: output ? "pointer" : "not-allowed",
              opacity: output ? 1 : 0.5,
              minWidth: 130,
            }}
          >
            {copied ? "Copied!" : "Copy Output"}
          </button>
        </div>

        {output && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "hsl(215 20% 55%)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Obfuscated Output
            </label>
            <textarea
              readOnly
              value={output}
              style={{
                width: "100%",
                height: 360,
                background: "hsl(222 47% 9%)",
                color: "hsl(142 76% 56%)",
                border: "1px solid hsl(217 32% 20%)",
                borderRadius: 8,
                padding: "12px 14px",
                resize: "vertical",
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontSize: 11,
                lineHeight: 1.5,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <button
            onClick={handleDeobfuscatorClick}
            style={{
              background: "transparent",
              color: "hsl(215 20% 35%)",
              border: "1px solid hsl(217 32% 18%)",
              borderRadius: 8,
              padding: "8px 20px",
              fontSize: 12,
              cursor: "pointer",
              letterSpacing: "0.05em",
            }}
          >
            Deobfuscator
          </button>
        </div>
      </div>
    </div>
  );
}
