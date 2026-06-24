export type JsonCheck = {
  ok: true;
} | {
  ok: false;
  error: string;
};

function message(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Invalid JSON.";
}

export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON: ${message(error)}`);
  }
}

export function validateJson(text: string): JsonCheck {
  try {
    parseJson(text);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export function formatJson(text: string, indent = 2): string {
  return JSON.stringify(parseJson(text), null, indent);
}

export function minifyJson(text: string): string {
  return JSON.stringify(parseJson(text));
}

export const isJsonValid = (text: string): boolean => validateJson(text).ok;
