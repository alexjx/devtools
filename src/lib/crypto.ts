export type HashAlg = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
export type HashAlgorithm = HashAlg;

const HEX = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));

function cryptoApi(): Crypto {
  const api = globalThis.crypto;

  if (!api) {
    throw new Error("Web Crypto is not available.");
  }

  return api;
}

function normalizeAlgo(value: HashAlg | string): HashAlg {
  const key = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  switch (key) {
    case "SHA1":
      return "SHA-1";
    case "SHA256":
      return "SHA-256";
    case "SHA384":
      return "SHA-384";
    case "SHA512":
      return "SHA-512";
    default:
      throw new Error(`Unsupported hash algorithm: ${value}`);
  }
}

function toHex(bytes: Uint8Array): string {
  let output = "";

  for (const byte of bytes) {
    output += HEX[byte]!;
  }

  return output;
}

function randomBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size);
  cryptoApi().getRandomValues(bytes);
  return bytes;
}

function uuidFromBytes(bytes: Uint8Array): string {
  bytes[6] = (bytes[6]! & 15) | 64;
  bytes[8] = (bytes[8]! & 63) | 128;

  const hex = toHex(bytes);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

export async function hashText(text: string, algo: HashAlg | string = "SHA-256"): Promise<string> {
  const api = cryptoApi();
  const digest = await api.subtle.digest(normalizeAlgo(algo), new TextEncoder().encode(text));
  return toHex(new Uint8Array(digest));
}

export function uuid(): string {
  const api = cryptoApi();

  if (typeof api.randomUUID === "function") {
    return api.randomUUID();
  }

  return uuidFromBytes(randomBytes(16));
}

export const digest = hashText;
export const createUuid = uuid;
