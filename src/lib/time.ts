export type TimeView = {
  date: Date;
  epochMs: number;
  epochSec: number;
  iso: string;
  utc: string;
  local: string;
};

export type UnixView = {
  date: Date;
  iso: string;
  seconds: number;
  milliseconds: number;
};

export type ZoneParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  offsetMinutes: number;
};

export type SourceZone = "auto" | "utc" | "china";
export type OutputFormat = "log" | "iso" | "unix-seconds" | "unix-milliseconds" | "all";

export type ParsedLogTime = {
  input: string;
  parsedText: string;
  date: Date;
  source: string;
  epochMs: number;
  epochSec: number;
  utc: string;
  china: string;
};

const naiveDateTime = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/;
const zonedInput = /(?:Z|[+-]\d{2}:?\d{2}|GMT)$/i;
const chinaTimeZone = "Asia/Shanghai";
const datePatterns = [
  /\b\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:[\.,]\d{1,9})?(?:Z|[+-]\d{2}:?\d{2})?\b/i,
  /\b\d{4}\/\d{2}\/\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:[\.,]\d{1,9})?(?:Z|[+-]\d{2}:?\d{2})?\b/i,
  /\b\d{8}[T\s]?\d{2}:?\d{2}:?\d{2}(?:[\.,]\d{1,9})?(?:Z|[+-]\d{2}:?\d{2})?\b/i,
  /\b[A-Z][a-z]{2},\s+\d{2}\s+[A-Z][a-z]{2}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+GMT\b/,
  /\b\d{10}(?:\.\d+)?\b/,
  /\b\d{13}\b/,
];

function pad(value: number, size: number): string {
  return String(Math.trunc(Math.abs(value))).padStart(size, "0");
}

function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hours = Math.trunc(abs / 60);
  const mins = abs % 60;

  return `${sign}${pad(hours, 2)}:${pad(mins, 2)}`;
}

function numericTimestamp(text: string): number | null {
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(text)) {
    return null;
  }

  const value = Number(text);
  if (!Number.isFinite(value)) {
    throw new Error("Invalid timestamp input.");
  }

  const digits = text.replace(/^[+-]/, "").split(".")[0].length;
  return text.includes(".") || digits <= 10 ? value * 1000 : value;
}

function parseDate(text: string): Date {
  const normalized = normalizeInput(text);

  if (zonedInput.test(normalized)) {
    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid timestamp input.");
    }

    return date;
  }

  const numeric = numericTimestamp(normalized);
  if (numeric !== null) {
    const date = new Date(numeric);

    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid timestamp input.");
    }

    return date;
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid timestamp input.");
  }

  return date;
}

function dateOnly(value: string | number | Date): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error("Invalid timestamp input.");
    }

    return new Date(value.getTime());
  }

  if (typeof value === "number") {
    const ms = Math.abs(value) < 1e11 ? value * 1000 : value;
    const date = new Date(ms);

    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid timestamp input.");
    }

    return date;
  }

  const text = value.trim();
  if (text.length === 0) {
    throw new Error("Invalid timestamp input.");
  }

  return parseDate(text);
}

function parts(date: Date, timeZone: string): ZoneParts {
  let formatter: Intl.DateTimeFormat;

  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
  } catch (error) {
    if (error instanceof RangeError) {
      throw new Error(`Invalid time zone: ${timeZone}`);
    }

    throw error;
  }

  const map = new Map(
    formatter.formatToParts(date).map((entry) => [entry.type, entry.value]),
  );

  const year = Number(map.get("year"));
  const month = Number(map.get("month"));
  const day = Number(map.get("day"));
  const hour = Number(map.get("hour"));
  const minute = Number(map.get("minute"));
  const second = Number(map.get("second"));
  const millisecond = 0;
  const wallClock = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  const offsetMinutes = Math.round((wallClock - date.getTime()) / 60000);

  return { year, month, day, hour, minute, second, millisecond, offsetMinutes };
}

function parseWallClock(text: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
} {
  const match = normalizeInput(text).match(naiveDateTime);
  if (!match) {
    throw new Error("Expected YYYY-MM-DD or YYYY-MM-DD HH:mm[:ss[.SSS]].");
  }

  const [, year, month, day, hour = "00", minute = "00", second = "00", fraction = "0"] = match;

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    millisecond: Number(fraction.padEnd(3, "0")),
  };
}

export function toDate(value: string | number | Date): Date {
  return dateOnly(value);
}

export function dateFromUnix(value: string | number, unit: "seconds" | "milliseconds" = "seconds"): Date {
  const text = typeof value === "number" ? String(value) : value.trim();
  if (text.length === 0) {
    throw new Error("Invalid timestamp input.");
  }

  const numeric = Number(text);
  if (!Number.isFinite(numeric)) {
    throw new Error("Invalid timestamp input.");
  }

  const milliseconds = unit === "seconds" ? numeric * 1000 : numeric;
  const date = new Date(milliseconds);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid timestamp input.");
  }

  return date;
}

export function unixFromDate(value: string | number | Date): UnixView {
  const date = toDate(value);
  const milliseconds = date.getTime();

  return {
    date,
    iso: date.toISOString(),
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
  };
}

export function describeTime(value: string | number | Date): TimeView {
  const date = toDate(value);

  return {
    date,
    epochMs: date.getTime(),
    epochSec: Math.floor(date.getTime() / 1000),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString(),
  };
}

export function zoneParts(value: string | number | Date, timeZone: string): ZoneParts {
  return parts(toDate(value), timeZone);
}

export function zoneOffsetMinutes(value: string | number | Date, timeZone: string): number {
  return zoneParts(value, timeZone).offsetMinutes;
}

export function formatZone(value: string | number | Date, timeZone: string): string {
  const part = zoneParts(value, timeZone);
  return `${pad(part.year, 4)}-${pad(part.month, 2)}-${pad(part.day, 2)} ${pad(part.hour, 2)}:${pad(part.minute, 2)}:${pad(part.second, 2)} UTC${formatOffset(part.offsetMinutes)}`;
}

export function parseZoned(text: string, timeZone: string): Date {
  const trimmed = normalizeInput(text);
  if (trimmed.length === 0) {
    throw new Error("Invalid timestamp input.");
  }

  if (zonedInput.test(trimmed)) {
    return toDate(trimmed);
  }

  const wallClock = parseWallClock(trimmed);
  const utc = Date.UTC(
    wallClock.year,
    wallClock.month - 1,
    wallClock.day,
    wallClock.hour,
    wallClock.minute,
    wallClock.second,
    wallClock.millisecond,
  );

  let guess = new Date(utc);
  for (let index = 0; index < 3; index += 1) {
    const offset = zoneOffsetMinutes(guess, timeZone);
    const next = utc - offset * 60_000;

    if (next === guess.getTime()) {
      return guess;
    }

    guess = new Date(next);
  }

  return guess;
}

export function convertZone(text: string, fromTimeZone: string, toTimeZone: string): string {
  return formatZone(parseZoned(text, fromTimeZone), toTimeZone);
}

export function parseLogTime(input: string, sourceZone: SourceZone): ParsedLogTime {
  const raw = input.trim();
  if (!raw) {
    throw new Error("Paste a timestamp or log time.");
  }

  const text = extractTimeText(raw);
  const numeric = numericTimestamp(text);
  if (numeric !== null) {
    const date = new Date(numeric);
    if (Number.isNaN(date.getTime())) {
      throw new Error("Invalid timestamp input.");
    }

    return describeLogTime(raw, text, date, "Unix timestamp");
  }

  if (zonedInput.test(text)) {
    return describeLogTime(raw, text, toDate(text), "Explicit offset");
  }

  if (sourceZone === "auto") {
    return describeLogTime(raw, text, parseZoned(text, chinaTimeZone), "China time (auto for no offset)");
  }

  if (sourceZone === "utc") {
    return describeLogTime(raw, text, parseZoned(text, "UTC"), "UTC");
  }

  return describeLogTime(raw, text, parseZoned(text, chinaTimeZone), "China time");
}

export function formatLogOutput(parsed: ParsedLogTime, timeZone: string, format: OutputFormat): string {
  switch (format) {
    case "log":
      return formatZone(parsed.date, timeZone);
    case "iso":
      return timeZone === "UTC" ? parsed.date.toISOString() : formatZoneIso(parsed.date, timeZone);
    case "unix-seconds":
      return String(parsed.epochSec);
    case "unix-milliseconds":
      return String(parsed.epochMs);
    case "all":
      return [
        `Log: ${formatZone(parsed.date, timeZone)}`,
        `ISO: ${timeZone === "UTC" ? parsed.date.toISOString() : formatZoneIso(parsed.date, timeZone)}`,
      ].join("\n");
  }
}

function describeLogTime(input: string, parsedText: string, date: Date, source: string): ParsedLogTime {
  return {
    input,
    parsedText,
    date,
    source,
    epochMs: date.getTime(),
    epochSec: Math.floor(date.getTime() / 1000),
    utc: formatZone(date, "UTC"),
    china: formatZone(date, chinaTimeZone),
  };
}

function extractTimeText(input: string): string {
  const trimmed = input.trim();

  for (const pattern of datePatterns) {
    const match = trimmed.match(pattern);
    if (match?.[0]) {
      return normalizeInput(match[0]);
    }
  }

  return normalizeInput(trimmed);
}

function normalizeInput(input: string): string {
  const text = input.trim();
  const normalizedSeparator = text.replace(",", ".");
  const compact = normalizedSeparator.match(/^(\d{4})(\d{2})(\d{2})[T\s]?(\d{2}):?(\d{2}):?(\d{2})(\.\d{1,9})?(Z|[+-]\d{2}:?\d{2})?$/i);
  if (compact) {
    const [, year, month, day, hour, minute, second, fraction = "", zone = ""] = compact;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}${fraction.slice(0, 4)}${zone}`;
  }

  return normalizedSeparator.replace(/^(\d{4})\/(\d{2})\/(\d{2})/, "$1-$2-$3").replace(/(\.\d{3})\d+/, "$1");
}

function formatZoneIso(date: Date, timeZone: string): string {
  const part = zoneParts(date, timeZone);
  return `${pad(part.year, 4)}-${pad(part.month, 2)}-${pad(part.day, 2)}T${pad(part.hour, 2)}:${pad(part.minute, 2)}:${pad(part.second, 2)}${formatOffset(part.offsetMinutes)}`;
}

export const parseTimestamp = toDate;
export const formatTimestamp = describeTime;
export const offsetMinutes = zoneOffsetMinutes;
export const formatInZone = formatZone;
