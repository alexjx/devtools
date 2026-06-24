const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64Map = new Int16Array(128).fill(-1);

for (let index = 0; index < base64Chars.length; index += 1) {
  base64Map[base64Chars.charCodeAt(index)] = index;
}
base64Map["=".charCodeAt(0)] = -2;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function fail(): never {
  throw new Error("Invalid base64 input.");
}

function decodeValue(code: number): number {
  if (code < 0 || code >= base64Map.length) {
    return -1;
  }

  return base64Map[code] ?? -1;
}

function normalizeBase64(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, "");

  if (trimmed.length === 0) {
    return "";
  }

  const normalized = trimmed.replace(/-/g, "+").replace(/_/g, "/");

  if (!/^[A-Za-z0-9+/=]*$/.test(normalized)) {
    fail();
  }

  const firstPad = normalized.indexOf("=");
  if (firstPad !== -1 && /[^=]/.test(normalized.slice(firstPad))) {
    fail();
  }

  if (normalized.length % 4 === 1) {
    fail();
  }

  return normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
}

function bytesToBase64(bytes: Uint8Array): string {
  let output = "";

  for (let index = 0; index < bytes.length; index += 3) {
    const a = bytes[index]!;
    const b = bytes[index + 1];
    const c = bytes[index + 2];
    const value = (a << 16) | ((b ?? 0) << 8) | (c ?? 0);

    output += base64Chars[(value >> 18) & 63];
    output += base64Chars[(value >> 12) & 63];
    output += b === undefined ? "=" : base64Chars[(value >> 6) & 63];
    output += c === undefined ? "=" : base64Chars[value & 63];
  }

  return output;
}

function base64ToBytes(input: string): Uint8Array {
  const normalized = normalizeBase64(input);

  if (normalized.length === 0) {
    return new Uint8Array();
  }

  const bytes: number[] = [];

  for (let index = 0; index < normalized.length; index += 4) {
    const v1 = decodeValue(normalized.charCodeAt(index));
    const v2 = decodeValue(normalized.charCodeAt(index + 1));
    const v3 = decodeValue(normalized.charCodeAt(index + 2));
    const v4 = decodeValue(normalized.charCodeAt(index + 3));

    if (v1 < 0 || v2 < 0) {
      fail();
    }

    if (v3 === -2) {
      if (v4 !== -2) {
        fail();
      }

      const value = (v1 << 18) | (v2 << 12);
      bytes.push((value >> 16) & 255);
      continue;
    }

    if (v4 === -2) {
      if (v3 < 0) {
        fail();
      }

      const value = (v1 << 18) | (v2 << 12) | (v3 << 6);
      bytes.push((value >> 16) & 255, (value >> 8) & 255);
      continue;
    }

    if (v3 < 0 || v4 < 0) {
      fail();
    }

    const value = (v1 << 18) | (v2 << 12) | (v3 << 6) | v4;
    bytes.push((value >> 16) & 255, (value >> 8) & 255, value & 255);
  }

  return Uint8Array.from(bytes);
}

export function encodeBase64(text: string): string {
  return bytesToBase64(textEncoder.encode(text));
}

export function decodeBase64(text: string): string {
  return textDecoder.decode(base64ToBytes(text));
}

export function encodeBase64Url(text: string): string {
  return encodeBase64(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeBase64Url(text: string): string {
  return decodeBase64(text);
}

export function encodeUrl(text: string): string {
  return encodeURIComponent(text);
}

export function decodeUrl(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    throw new Error("Invalid URL-encoded input.");
  }
}

export const base64Encode = encodeBase64;
export const base64Decode = decodeBase64;
export const urlEncode = encodeUrl;
export const urlDecode = decodeUrl;
