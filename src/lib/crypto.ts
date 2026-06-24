import {
  v1 as uuidV1,
  v3 as uuidV3,
  v4 as uuidV4,
  v5 as uuidV5,
  v6 as uuidV6,
  v7 as uuidV7,
  validate as validateUuid,
} from "uuid";

export type HashAlg = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
export type HashAlgorithm = HashAlg;
export type UuidVersion = "v1" | "v3" | "v4" | "v5" | "v6" | "v7";
export type UuidNamespace = "dns" | "url" | "custom";

export type UuidOptions = {
  version?: UuidVersion;
  name?: string;
  namespace?: UuidNamespace;
  customNamespace?: string;
};

export const uuidVersions: UuidVersion[] = ["v1", "v3", "v4", "v5", "v6", "v7"];

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

export async function hashText(text: string, algo: HashAlg | string = "SHA-256"): Promise<string> {
  const api = cryptoApi();
  const digest = await api.subtle.digest(normalizeAlgo(algo), new TextEncoder().encode(text));
  return toHex(new Uint8Array(digest));
}

export function isNameBasedUuid(version: UuidVersion): boolean {
  return version === "v3" || version === "v5";
}

function uuidNamespace(options: UuidOptions): string {
  switch (options.namespace ?? "dns") {
    case "dns":
      return uuidV5.DNS;
    case "url":
      return uuidV5.URL;
    case "custom": {
      const namespace = options.customNamespace?.trim() ?? "";
      if (!validateUuid(namespace)) {
        throw new Error("Enter a valid namespace UUID.");
      }
      return namespace;
    }
  }
}

function uuidName(options: UuidOptions): string {
  const name = options.name ?? "";

  if (!name) {
    throw new Error("Enter a name for UUID v3/v5.");
  }

  return name;
}

export function uuid(options: UuidOptions = {}): string {
  switch (options.version ?? "v4") {
    case "v1":
      return uuidV1();
    case "v3":
      return uuidV3(uuidName(options), uuidNamespace(options));
    case "v4":
      return uuidV4();
    case "v5":
      return uuidV5(uuidName(options), uuidNamespace(options));
    case "v6":
      return uuidV6();
    case "v7":
      return uuidV7();
  }
}

export const digest = hashText;
export const createUuid = uuid;
