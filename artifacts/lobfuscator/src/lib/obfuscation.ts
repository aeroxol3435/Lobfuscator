export function randomString(len: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+=~`|<>?/\\;:'\",.{}[]()";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function randomGarbageLine(): string {
  const len = 120 + Math.floor(Math.random() * 80);
  return randomString(len);
}

export function randomGarbage(): string {
  let txt = "--[[\n";
  for (let i = 0; i < 400; i++) {
    txt += randomGarbageLine() + "\n";
  }
  txt += "]]--\n\n";
  return txt;
}

export function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

export function fromBase64(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return atob(str);
  }
}

export function toOctal(str: string): string {
  let r = "";
  for (let i = 0; i < str.length; i++) {
    r += "\\" + str.charCodeAt(i).toString(8);
  }
  return r;
}

export function toHex(str: string): string {
  let r = "";
  for (let i = 0; i < str.length; i++) {
    r += "\\x" + str.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return r;
}

export function toReversed(str: string): string {
  return str.split("").reverse().join("");
}

export function toBinary(str: string): string {
  let r = "";
  for (let i = 0; i < str.length; i++) {
    r += str.charCodeAt(i).toString(2).padStart(8, "0") + " ";
  }
  return r.trim();
}

export function splitIntoThree(str: string): [string, string, string] {
  const p = Math.floor(str.length / 3);
  return [str.substring(0, p), str.substring(p, p * 2), str.substring(p * 2)];
}

function rnd(len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const DECODE_FUNCS = `
local function b64decode(data)
  local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  data=data:gsub('[^'..b..'=]','')
  return (data:gsub('.',function(x)
    if x=='=' then return '' end
    local r,f='',(b:find(x)-1)
    for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and '1' or '0') end
    return r
  end):gsub('%d%d%d?%d?%d?%d?%d?%d?',function(x)
    if #x~=8 then return '' end
    local c=0
    for i=1,8 do if x:sub(i,i)=='1' then c=c+2^(8-i) end end
    return string.char(c)
  end))
end

local function octDecode(str)
  return (str:gsub('\\\\(%d+)',function(d)
    return string.char(tonumber(d,8))
  end))
end

local function hexDecode(str)
  return (str:gsub('\\\\x(%x%x)',function(h)
    return string.char(tonumber(h,16))
  end))
end

local function binDecode(str)
  local result=""
  for byte in str:gmatch("%d+") do
    result=result..string.char(tonumber(byte,2))
  end
  return result
end

local function strReverse(s)
  return s:reverse()
end
`;

export interface ObfuscationResult {
  code: string;
  order: number;
}

export function obfuscate(input: string): ObfuscationResult {
  const order = Math.floor(Math.random() * 8) + 1;
  const [p1, p2, p3] = splitIntoThree(input);

  let enc1: string, enc2: string, enc3: string;
  let dec1: string, dec2: string, dec3: string;

  switch (order) {
    case 1: {
      enc1 = toBase64(toOctal(toBase64(toOctal(p1))));
      enc2 = toOctal(toBase64(toOctal(toBase64(p2))));
      enc3 = toBase64(toBase64(toBase64(toOctal(p3))));
      dec1 = "octDecode(b64decode(octDecode(b64decode(V1))))";
      dec2 = "b64decode(octDecode(b64decode(octDecode(V2))))";
      dec3 = "octDecode(b64decode(b64decode(b64decode(V3))))";
      break;
    }
    case 2: {
      enc1 = toBase64(toHex(toBase64(p1)));
      enc2 = toHex(toBase64(toHex(p2)));
      enc3 = toBase64(toBase64(toHex(p3)));
      dec1 = "b64decode(hexDecode(b64decode(V1)))";
      dec2 = "hexDecode(b64decode(hexDecode(V2)))";
      dec3 = "hexDecode(b64decode(b64decode(V3)))";
      break;
    }
    case 3: {
      enc1 = toBase64(toReversed(toBase64(p1)));
      enc2 = toReversed(toBase64(toReversed(p2)));
      enc3 = toBase64(toReversed(toBase64(p3)));
      dec1 = "b64decode(strReverse(b64decode(V1)))";
      dec2 = "strReverse(b64decode(strReverse(V2)))";
      dec3 = "b64decode(strReverse(b64decode(V3)))";
      break;
    }
    case 4: {
      enc1 = toOctal(toHex(toOctal(p1)));
      enc2 = toHex(toOctal(toHex(p2)));
      enc3 = toOctal(toHex(p3));
      dec1 = "octDecode(hexDecode(octDecode(V1)))";
      dec2 = "hexDecode(octDecode(hexDecode(V2)))";
      dec3 = "hexDecode(octDecode(V3))";
      break;
    }
    case 5: {
      enc1 = toBase64(toBinary(p1));
      enc2 = toBinary(toBase64(p2));
      enc3 = toBase64(toBinary(toBase64(p3)));
      dec1 = "binDecode(b64decode(V1))";
      dec2 = "b64decode(binDecode(V2))";
      dec3 = "b64decode(binDecode(b64decode(V3)))";
      break;
    }
    case 6: {
      enc1 = toReversed(toOctal(toBase64(p1)));
      enc2 = toBase64(toReversed(toOctal(p2)));
      enc3 = toOctal(toBase64(toReversed(p3)));
      dec1 = "b64decode(octDecode(strReverse(V1)))";
      dec2 = "octDecode(strReverse(b64decode(V2)))";
      dec3 = "strReverse(b64decode(octDecode(V3)))";
      break;
    }
    case 7: {
      enc1 = toHex(toBase64(toHex(toBase64(p1))));
      enc2 = toBase64(toHex(toBase64(toHex(p2))));
      enc3 = toHex(toBase64(toHex(p3)));
      dec1 = "b64decode(hexDecode(b64decode(hexDecode(V1))))";
      dec2 = "hexDecode(b64decode(hexDecode(b64decode(V2))))";
      dec3 = "hexDecode(b64decode(hexDecode(V3)))";
      break;
    }
    case 8: {
      enc1 = toBase64(toOctal(toHex(toReversed(p1))));
      enc2 = toReversed(toHex(toOctal(toBase64(p2))));
      enc3 = toOctal(toReversed(toBase64(toHex(p3))));
      dec1 = "strReverse(hexDecode(octDecode(b64decode(V1))))";
      dec2 = "b64decode(octDecode(hexDecode(strReverse(V2))))";
      dec3 = "hexDecode(b64decode(strReverse(octDecode(V3))))";
      break;
    }
    default: {
      enc1 = toBase64(p1);
      enc2 = toBase64(p2);
      enc3 = toBase64(p3);
      dec1 = "b64decode(V1)";
      dec2 = "b64decode(V2)";
      dec3 = "b64decode(V3)";
    }
  }

  const v1 = rnd(18), v2 = rnd(20), v3 = rnd(22);
  const finalVar = rnd(16);

  const d1 = dec1.replace("V1", v1);
  const d2 = dec2.replace("V2", v2);
  const d3 = dec3.replace("V3", v3);

  const code =
    `-- (This text is obfuscated by lobfuscator)\n` +
    `-- [${order}]\n\n` +
    randomGarbage() +
    `local ${v1}=[[${enc1}]]\n` +
    `local ${v2}=[[${enc2}]]\n` +
    `local ${v3}=[[${enc3}]]\n\n` +
    DECODE_FUNCS + "\n" +
    `${v1}=${d1}\n` +
    `${v2}=${d2}\n` +
    `${v3}=${d3}\n\n` +
    `local ${finalVar}=${v1}..${v2}..${v3}\n` +
    `local f=loadstring or load\n` +
    `local fn=f(${finalVar})\n` +
    `if fn then fn() end`;

  return { code, order };
}

export function deobfuscate(input: string): { success: boolean; order?: number; result?: string; error?: string } {
  const headerLine = input.split("\n")[0]?.trim() ?? "";
  if (!headerLine.toLowerCase().includes("this text is obfuscated by")) {
    return { success: false, error: "Invalid code: must start with '-- (This text is obfuscated by lobfuscator)'" };
  }

  const orderMatch = input.match(/^--\s*\[(\d+)\]/m);
  if (!orderMatch) {
    return { success: false, error: "Could not find obfuscation order number in the code." };
  }

  const order = parseInt(orderMatch[1], 10);
  if (order < 1 || order > 8) {
    return { success: false, error: `Unknown order number: ${order}` };
  }

  const varMatches = [...input.matchAll(/local\s+(\w+)=\[\[([\s\S]*?)\]\]/g)];
  if (varMatches.length < 3) {
    return { success: false, error: "Could not parse encoded parts from the code." };
  }

  const enc1 = varMatches[0][2];
  const enc2 = varMatches[1][2];
  const enc3 = varMatches[2][2];

  try {
    let p1: string, p2: string, p3: string;
    switch (order) {
      case 1:
        p1 = fromBase64(fromOctal(fromBase64(fromOctal(enc1))));
        p2 = fromBase64(fromOctal(fromBase64(fromOctal(enc2))));
        p3 = fromBase64(fromBase64(fromBase64(fromOctal(enc3))));
        break;
      case 2:
        p1 = fromBase64(fromHex(fromBase64(enc1)));
        p2 = fromHex(fromBase64(fromHex(enc2)));
        p3 = fromHex(fromBase64(fromBase64(enc3)));
        break;
      case 3:
        p1 = fromBase64(toReversed(fromBase64(enc1)));
        p2 = toReversed(fromBase64(toReversed(enc2)));
        p3 = fromBase64(toReversed(fromBase64(enc3)));
        break;
      case 4:
        p1 = fromOctal(fromHex(fromOctal(enc1)));
        p2 = fromHex(fromOctal(fromHex(enc2)));
        p3 = fromHex(fromOctal(enc3));
        break;
      case 5:
        p1 = fromBinary(fromBase64(enc1));
        p2 = fromBase64(fromBinary(enc2));
        p3 = fromBase64(fromBinary(fromBase64(enc3)));
        break;
      case 6:
        p1 = fromBase64(fromOctal(toReversed(enc1)));
        p2 = fromOctal(toReversed(fromBase64(enc2)));
        p3 = toReversed(fromBase64(fromOctal(enc3)));
        break;
      case 7:
        p1 = fromBase64(fromHex(fromBase64(fromHex(enc1))));
        p2 = fromHex(fromBase64(fromHex(fromBase64(enc2))));
        p3 = fromHex(fromBase64(fromHex(enc3)));
        break;
      case 8:
        p1 = toReversed(fromHex(fromOctal(fromBase64(enc1))));
        p2 = fromBase64(fromOctal(fromHex(toReversed(enc2))));
        p3 = fromHex(fromBase64(toReversed(fromOctal(enc3))));
        break;
      default:
        return { success: false, error: "Unknown order" };
    }
    return { success: true, order, result: p1 + p2 + p3 };
  } catch (e) {
    return { success: false, error: "Failed to decode: " + String(e) };
  }
}

function fromOctal(str: string): string {
  return str.replace(/\\(\d+)/g, (_: string, d: string) => String.fromCharCode(parseInt(d, 8)));
}

function fromHex(str: string): string {
  return str.replace(/\\x([0-9a-fA-F]{2})/g, (_: string, h: string) => String.fromCharCode(parseInt(h, 16)));
}

function fromBinary(str: string): string {
  return str.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join("");
}

export const ORDER_NAMES: Record<number, string> = {
  1: "Octal-Base64 Quad Layer",
  2: "Hex-Base64 Hybrid",
  3: "Base64 Reverse Mirror",
  4: "Octal-Hex Chain",
  5: "Binary Burst",
  6: "Reverse Octal Spiral",
  7: "Hex-Base64 Ultra Quad",
  8: "Maximum Chaos",
};
