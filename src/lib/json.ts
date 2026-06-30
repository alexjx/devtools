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

function closeFor(char: string): string {
  return char === "{" ? "}" : "]";
}

function openingFor(char: string): string {
  return char === "}" ? "{" : "[";
}

function sliceCandidate(text: string, start: number): string {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      if (stack.at(-1) !== openingFor(char)) {
        continue;
      }

      stack.pop();
      if (stack.length === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return text.slice(start);
}

function* candidates(text: string): Generator<string> {
  const source = text.trim();

  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === "{" || source[index] === "[") {
      yield sliceCandidate(source, index);
    }
  }
}

function repairJson(source: string): string {
  const stack: string[] = [];
  const output: string[] = [];
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        output.push(char);
        escaped = false;
        continue;
      }

      if (char === "\\") {
        output.push(char);
        escaped = true;
        continue;
      }

      if (char === "\"") {
        output.push(char);
        inString = false;
        continue;
      }

      const closesCurrent = (char === "}" || char === "]") && stack.at(-1) === openingFor(char);
      if (closesCurrent && source.slice(index + 1).trim() === "") {
        output.push("\"");
        inString = false;
      } else if (char === "\n") {
        output.push("\\n");
        continue;
      } else if (char === "\r") {
        output.push("\\r");
        continue;
      } else if (char === "\t") {
        output.push("\\t");
        continue;
      } else {
        output.push(char);
        continue;
      }
    }

    if (char === "\"") {
      output.push(char);
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      output.push(char);
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      if (stack.at(-1) !== openingFor(char)) {
        continue;
      }

      output.push(char);
      stack.pop();
      continue;
    }

    output.push(char);
  }

  if (inString) {
    output.push("\"");
  }

  while (stack.length > 0) {
    output.push(closeFor(stack.pop() ?? "{"));
  }

  return output.join("").replace(/,\s*([}\]])/g, "$1");
}

function readJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    for (const candidate of candidates(text)) {
      try {
        return JSON.parse(repairJson(candidate));
      } catch {
        // Keep trying later payload-like candidates in pasted log text.
      }
    }

    throw new Error(`Invalid JSON: ${message(error)}`);
  }
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
  return JSON.stringify(readJson(text), null, indent);
}

export function minifyJson(text: string): string {
  return JSON.stringify(readJson(text));
}

export const isJsonValid = (text: string): boolean => validateJson(text).ok;
