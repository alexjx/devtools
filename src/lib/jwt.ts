import { decodeBase64 } from "./codec";

export type JwtData = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  rawHeader: string;
  rawPayload: string;
  rawSignature: string;
};

function fail(message: string): never {
  throw new Error(message);
}

function jsonObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(`Invalid JWT ${label}.`);
  }

  return value as Record<string, unknown>;
}

function decodePart(segment: string, label: string): Record<string, unknown> {
  let text: string;

  try {
    text = decodeBase64(segment);
  } catch {
    fail(`Invalid JWT ${label} encoding.`);
  }

  try {
    return jsonObject(JSON.parse(text), label);
  } catch {
    fail(`Invalid JWT ${label} JSON.`);
  }
}

export function decodeJwt(token: string): JwtData {
  const trimmed = token.trim();
  if (trimmed.length === 0) {
    fail("JWT is empty.");
  }

  const segments = trimmed.split(".");
  if (segments.length !== 3) {
    fail("JWT must have three segments.");
  }

  const [rawHeader, rawPayload, rawSignature] = segments;
  if (!rawHeader || !rawPayload) {
    fail("JWT header and payload are required.");
  }

  return {
    header: decodePart(rawHeader, "header"),
    payload: decodePart(rawPayload, "payload"),
    signature: rawSignature,
    rawHeader,
    rawPayload,
    rawSignature,
  };
}
