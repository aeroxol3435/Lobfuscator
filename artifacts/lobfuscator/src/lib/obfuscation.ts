// Safe chars for junk after -- (NO [ or ] to prevent premature ]] closing)
const GARBAGE_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+=~`|<>?/\\;:'\",. (){}";
// Alphanumeric only — used for junk around the hidden tag so the regex reliably finds it
const ALPHANUM_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// Lua-like keywords to mix into the 5-word code prefix on each garbage line
const LUA_KEYWORDS = ["local","function","return","end","if","then","else","for","while","do","not","and","or","true","false","nil","repeat","until","break","in"];
const ALPHA_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function rndAlphaNum(len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) s += ALPHANUM_CHARS[Math.floor(Math.random() * ALPHANUM_CHARS.length)];
  return s;
}

function rndGarbageLine(len = 0): string {
  const l = len || 80 + Math.floor(Math.random() * 60);
  let s = "";
  for (let i = 0; i < l; i++) s += GARBAGE_CHARS[Math.floor(Math.random() * GARBAGE_CHARS.length)];
  return s;
}

// Generates a fake Lua-like identifier word
function rndCodeWord(): string {
  if (Math.random() < 0.25) return LUA_KEYWORDS[Math.floor(Math.random() * LUA_KEYWORDS.length)];
  const len = 3 + Math.floor(Math.random() * 9);
  let s = ALPHA_CHARS[Math.floor(Math.random() * ALPHA_CHARS.length)];
  for (let i = 1; i < len; i++) s += ALPHANUM_CHARS[Math.floor(Math.random() * ALPHANUM_CHARS.length)];
  return s;
}

// 5 code-like words joined by spaces — the visible prefix of each garbage line
function rndCodePrefix(): string {
  return Array.from({ length: 5 }, rndCodeWord).join(" ");
}

function rndVarName(len: number): string {
  const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphanum = alpha + "0123456789";
  let s = alpha[Math.floor(Math.random() * alpha.length)];
  for (let i = 1; i < len; i++) s += alphanum[Math.floor(Math.random() * alphanum.length)];
  return s;
}

// ── Encoding helpers ─────────────────────────────────────────────────────────

export function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

export function fromBase64(str: string): string {
  try { return decodeURIComponent(escape(atob(str))); }
  catch { return atob(str); }
}

// Decimal byte escapes: A → \065  (safe in Lua [[]] long strings, no ] chars)
export function toDecEsc(str: string): string {
  let r = "";
  for (let i = 0; i < str.length; i++) {
    r += "\\" + str.charCodeAt(i).toString(10).padStart(3, "0");
  }
  return r;
}

export function fromDecEsc(str: string): string {
  return str.replace(/\\(\d{3})/g, (_: string, d: string) => String.fromCharCode(parseInt(d, 10)));
}

export function toRev(str: string): string {
  return str.split("").reverse().join("");
}

export function toROT13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (c: string) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

// ── 20 Obfuscation Orders ────────────────────────────────────────────────────
// Notation: B=base64, D=decimal-escape, R=reverse, T=ROT13
// encode(p) → enc, decode(enc) → p
// Lua decode string uses: b64d(), decEsc(), rev(), rot13()

interface Order {
  name: string;
  encode: (p: string) => string;
  decode: (e: string) => string;       // JS decode (deobfuscator)
  luaDec: string;                      // Lua decode expression (V = variable name placeholder)
}

const ORDERS: Order[] = [
  {
    name: "Protocol I",
    encode: p => toBase64(toDecEsc(toBase64(toDecEsc(p)))),
    decode: e => fromDecEsc(fromBase64(fromDecEsc(fromBase64(e)))),
    luaDec: "decEsc(b64d(decEsc(b64d(V))))",
  },
  {
    name: "Protocol II",
    encode: p => toRev(toBase64(toRev(toBase64(p)))),
    decode: e => fromBase64(toRev(fromBase64(toRev(e)))),
    luaDec: "b64d(rev(b64d(rev(V))))",
  },
  {
    name: "Protocol III",
    encode: p => toBase64(toBase64(toBase64(toDecEsc(p)))),
    decode: e => fromDecEsc(fromBase64(fromBase64(fromBase64(e)))),
    luaDec: "decEsc(b64d(b64d(b64d(V))))",
  },
  {
    name: "Protocol IV",
    encode: p => toBase64(toDecEsc(toRev(toBase64(p)))),
    decode: e => fromBase64(toRev(fromDecEsc(fromBase64(e)))),
    luaDec: "b64d(rev(decEsc(b64d(V))))",
  },
  {
    name: "Protocol V",
    encode: p => toDecEsc(toBase64(toROT13(p))),
    decode: e => toROT13(fromBase64(fromDecEsc(e))),
    luaDec: "rot13(b64d(decEsc(V)))",
  },
  {
    name: "Protocol VI",
    encode: p => toBase64(toROT13(toBase64(p))),
    decode: e => fromBase64(toROT13(fromBase64(e))),
    luaDec: "b64d(rot13(b64d(V)))",
  },
  {
    name: "Protocol VII",
    encode: p => toRev(toDecEsc(toBase64(toRev(p)))),
    decode: e => toRev(fromBase64(fromDecEsc(toRev(e)))),
    luaDec: "rev(b64d(decEsc(rev(V))))",
  },
  {
    name: "Protocol VIII",
    encode: p => toBase64(toDecEsc(toROT13(toBase64(p)))),
    decode: e => fromBase64(toROT13(fromDecEsc(fromBase64(e)))),
    luaDec: "b64d(rot13(decEsc(b64d(V))))",
  },
  {
    name: "Protocol IX",
    encode: p => toROT13(toBase64(toRev(toDecEsc(p)))),
    decode: e => fromDecEsc(toRev(fromBase64(toROT13(e)))),
    luaDec: "decEsc(rev(b64d(rot13(V))))",
  },
  {
    name: "Protocol X",
    encode: p => toBase64(toRev(toROT13(toDecEsc(p)))),
    decode: e => fromDecEsc(toROT13(toRev(fromBase64(e)))),
    luaDec: "decEsc(rot13(rev(b64d(V))))",
  },
  {
    name: "Protocol XI",
    encode: p => toDecEsc(toROT13(toBase64(toRev(toBase64(p))))),
    decode: e => fromBase64(toRev(fromBase64(toROT13(fromDecEsc(e))))),
    luaDec: "b64d(rev(b64d(rot13(decEsc(V)))))",
  },
  {
    name: "Protocol XII",
    encode: p => toBase64(toRev(toDecEsc(toROT13(toBase64(p))))),
    decode: e => fromBase64(toROT13(fromDecEsc(toRev(fromBase64(e))))),
    luaDec: "b64d(rot13(decEsc(rev(b64d(V)))))",
  },
  {
    name: "Protocol XIII",
    encode: p => toROT13(toBase64(toDecEsc(toRev(toROT13(p))))),
    decode: e => toROT13(toRev(fromDecEsc(fromBase64(toROT13(e))))),
    luaDec: "rot13(rev(decEsc(b64d(rot13(V)))))",
  },
  {
    name: "Protocol XIV",
    encode: p => toRev(toROT13(toBase64(toDecEsc(toBase64(p))))),
    decode: e => fromBase64(fromDecEsc(fromBase64(toROT13(toRev(e))))),
    luaDec: "b64d(decEsc(b64d(rot13(rev(V)))))",
  },
  {
    name: "Protocol XV",
    encode: p => toBase64(toDecEsc(toBase64(toROT13(toRev(p))))),
    decode: e => toRev(toROT13(fromBase64(fromDecEsc(fromBase64(e))))),
    luaDec: "rev(rot13(b64d(decEsc(b64d(V)))))",
  },
  {
    name: "Protocol XVI",
    encode: p => toDecEsc(toBase64(toROT13(toBase64(toRev(p))))),
    decode: e => toRev(fromBase64(toROT13(fromBase64(fromDecEsc(e))))),
    luaDec: "rev(b64d(rot13(b64d(decEsc(V)))))",
  },
  {
    name: "Protocol XVII",
    encode: p => toROT13(toDecEsc(toRev(toBase64(toROT13(toBase64(p)))))),
    decode: e => fromBase64(toROT13(fromBase64(toRev(fromDecEsc(toROT13(e)))))),
    luaDec: "b64d(rot13(b64d(rev(decEsc(rot13(V))))))",
  },
  {
    name: "Protocol XVIII",
    encode: p => toBase64(toROT13(toRev(toDecEsc(toBase64(toRev(p)))))),
    decode: e => toRev(fromBase64(fromDecEsc(toRev(toROT13(fromBase64(e)))))),
    luaDec: "rev(b64d(decEsc(rev(rot13(b64d(V))))))",
  },
  {
    name: "Protocol XIX",
    encode: p => toRev(toBase64(toROT13(toDecEsc(toROT13(toBase64(p)))))),
    decode: e => fromBase64(toROT13(fromDecEsc(toROT13(fromBase64(toRev(e)))))),
    luaDec: "b64d(rot13(decEsc(rot13(b64d(rev(V))))))",
  },
  {
    name: "Protocol XX",
    encode: p => toDecEsc(toRev(toROT13(toBase64(toRev(toROT13(toBase64(p))))))),
    decode: e => fromBase64(toROT13(toRev(fromBase64(toROT13(toRev(fromDecEsc(e))))))),
    luaDec: "b64d(rot13(rev(b64d(rot13(rev(decEsc(V)))))))",
  },
];

export const ORDER_NAMES: Record<number, string> = {};
ORDERS.forEach((o, i) => { ORDER_NAMES[i + 1] = o.name; });

// ── Garbage + hidden order tag ───────────────────────────────────────────────

function encodeOrderTag(order: number): string {
  // Encode as hex of (order * 7 + 31), looks like a random hex constant
  return ((order * 7 + 31)).toString(16).toUpperCase().padStart(4, "0");
}

export function decodeOrderTag(tag: string): number {
  const val = parseInt(tag, 16);
  return (val - 31) / 7;
}

function makeGarbage(order: number): string {
  const LINES = 400;
  const insertAt = Math.floor(LINES / 2) + Math.floor(Math.random() * 20 - 10);
  const tag = encodeOrderTag(order);
  let lines: string[] = [];
  for (let i = 0; i < LINES; i++) {
    if (i === insertAt) {
      // Hidden order tag: looks like a normal garbage line but contains alphanumeric junk around the 4-char hex tag
      // junk1/junk2 MUST be alphanumeric so the regex /[A-Za-z0-9]{6}([0-9A-F]{4})[A-Za-z0-9]{6}MEM/ reliably matches
      const junk1 = rndAlphaNum(6);
      const junk2 = rndAlphaNum(6);
      lines.push(`${rndCodePrefix()} -- 0x${junk1}${tag}${junk2}MEM`);
    } else {
      lines.push(`${rndCodePrefix()} -- ${rndGarbageLine()}`);
    }
  }
  return "--[[\n" + lines.join("\n") + "\n]]--\n\n";
}

// ── Lua runtime helpers (injected into every obfuscated script) ───────────────

const LUA_HELPERS = `local function b64d(s)
  local b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  s=s:gsub("[^"..b.."=]","")
  local t,pad={},0
  s:gsub("(.)",function(c)
    if c=="=" then pad=pad+1;return end
    local n=b:find(c)-1
    for i=6,1,-1 do t[#t+1]=math.floor(n/2^(i-1))%2 end
  end)
  local out=""
  for i=1,#t-7,8 do
    local sv=0
    for j=0,7 do sv=sv+t[i+j]*2^(7-j) end
    out=out..string.char(sv)
  end
  return out:sub(1,#out-pad)
end
local function decEsc(s)
  return(s:gsub("\\\\(%d%d%d)",function(d)return string.char(tonumber(d,10))end))
end
local function rev(s) return s:reverse() end
local function rot13(s)
  return(s:gsub("[A-Za-z]",function(c)
    local b=c:byte()>=97 and 97 or 65
    return string.char((c:byte()-b+13)%26+b)
  end))
end
`;

// ── Main obfuscate function ───────────────────────────────────────────────────

export interface ObfuscationResult {
  code: string;
  order: number;
}

export function obfuscate(input: string): ObfuscationResult {
  const order = Math.floor(Math.random() * 20) + 1;
  const def = ORDERS[order - 1];

  // Split into 3 roughly equal parts
  const third = Math.floor(input.length / 3);
  const p1 = input.substring(0, third);
  const p2 = input.substring(third, third * 2);
  const p3 = input.substring(third * 2);

  const enc1 = def.encode(p1);
  const enc2 = def.encode(p2);
  const enc3 = def.encode(p3);

  const v1 = rndVarName(14 + Math.floor(Math.random() * 8));
  const v2 = rndVarName(14 + Math.floor(Math.random() * 8));
  const v3 = rndVarName(14 + Math.floor(Math.random() * 8));
  const vFinal = rndVarName(12 + Math.floor(Math.random() * 6));

  const d1 = def.luaDec.replace("V", v1);
  const d2 = def.luaDec.replace("V", v2);
  const d3 = def.luaDec.replace("V", v3);

  const garbage = makeGarbage(order);

  const code =
    `-- This file is obfuscated by Lobfuscator, Lobfuscator.netlify.app\n\n` +
    garbage +
    `local ${v1}=[[${enc1}]]\n` +
    `local ${v2}=[[${enc2}]]\n` +
    `local ${v3}=[[${enc3}]]\n\n` +
    LUA_HELPERS + "\n" +
    `${v1}=${d1}\n` +
    `${v2}=${d2}\n` +
    `${v3}=${d3}\n\n` +
    `local ${vFinal}=${v1}..${v2}..${v3}\n` +
    `local _f=loadstring or load\n` +
    `local _fn=_f(${vFinal})\n` +
    `if _fn then _fn() end\n`;

  return { code, order };
}

// ── Deobfuscate ───────────────────────────────────────────────────────────────

export interface DeobfResult {
  success: boolean;
  order?: number;
  result?: string;
  error?: string;
}

export function deobfuscate(input: string): DeobfResult {
  const firstLine = input.split("\n")[0]?.trim() ?? "";
  if (!firstLine.toLowerCase().includes("lobfuscator")) {
    return { success: false, error: "Invalid input: this does not appear to be a Lobfuscator file." };
  }

  // Find hidden order tag: -- 0x<6chars><TAG><6chars>MEM
  const tagMatch = input.match(/-- 0x[A-Za-z0-9]{6}([0-9A-F]{4})[A-Za-z0-9]{6}MEM/);
  if (!tagMatch) {
    return { success: false, error: "Could not find the hidden obfuscation marker in the code." };
  }

  const order = decodeOrderTag(tagMatch[1]);
  if (!Number.isInteger(order) || order < 1 || order > 20) {
    return { success: false, error: `Unrecognized obfuscation marker (decoded: ${order}).` };
  }

  const def = ORDERS[order - 1];

  // Extract the 3 encoded [[...]] blocks
  const varMatches = [...input.matchAll(/local\s+\w+\s*=\s*\[\[([\s\S]*?)\]\]/g)];
  if (varMatches.length < 3) {
    return { success: false, error: "Could not find encoded data blocks in the code." };
  }

  try {
    const p1 = def.decode(varMatches[0][1]);
    const p2 = def.decode(varMatches[1][1]);
    const p3 = def.decode(varMatches[2][1]);
    return { success: true, order, result: p1 + p2 + p3 };
  } catch (e) {
    return { success: false, error: "Decoding failed: " + String(e) };
  }
}
