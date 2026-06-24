import { describe, expect, it } from "vitest";
import {
  convertZone,
  dateFromUnix,
  describeTime,
  formatLogOutput,
  formatInZone,
  formatZone,
  parseLogTime,
  parseZoned,
  toDate,
  unixFromDate,
  zoneOffsetMinutes,
  zoneParts,
} from "./time";

describe("time", () => {
  it("describes timestamp inputs", () => {
    const view = describeTime("2024-01-15T12:34:56Z");

    expect(view.epochMs).toBe(Date.parse("2024-01-15T12:34:56Z"));
    expect(view.iso).toBe("2024-01-15T12:34:56.000Z");
    expect(view.date).toBeInstanceOf(Date);
  });

  it("parses seconds and milliseconds", () => {
    expect(dateFromUnix("1700000000", "seconds").toISOString()).toBe("2023-11-14T22:13:20.000Z");
    expect(toDate(1_700_000_000).toISOString()).toBe("2023-11-14T22:13:20.000Z");
    expect(toDate(1_700_000_000_000).toISOString()).toBe("2023-11-14T22:13:20.000Z");
    expect(unixFromDate("2023-11-14T22:13:20.000Z")).toMatchObject({
      iso: "2023-11-14T22:13:20.000Z",
      seconds: 1_700_000_000,
      milliseconds: 1_700_000_000_000,
    });
  });

  it("converts wall-clock time between zones", () => {
    const date = parseZoned("2024-01-15 07:00:00", "America/New_York");

    expect(date.toISOString()).toBe("2024-01-15T12:00:00.000Z");
    expect(zoneParts(date, "America/New_York")).toMatchObject({
      year: 2024,
      month: 1,
      day: 15,
      hour: 7,
      minute: 0,
      second: 0,
      offsetMinutes: -300,
    });
    expect(zoneOffsetMinutes(date, "UTC")).toBe(0);
    expect(formatZone(date, "America/New_York")).toBe("2024-01-15 07:00:00 UTC-05:00");
    expect(formatInZone(date, "UTC")).toBe("2024-01-15 12:00:00 UTC+00:00");
    expect(convertZone("2024-01-15 07:00:00", "America/New_York", "UTC")).toBe("2024-01-15 12:00:00 UTC+00:00");
  });

  it("parses pasted China log time and displays UTC and China time", () => {
    const parsed = parseLogTime("2026-06-24 12:00:00", "china");

    expect(parsed.source).toBe("China time");
    expect(parsed.utc).toBe("2026-06-24 04:00:00 UTC+00:00");
    expect(parsed.china).toBe("2026-06-24 12:00:00 UTC+08:00");
    expect(formatLogOutput(parsed, "UTC", "log")).toBe("2026-06-24 04:00:00 UTC+00:00");
    expect(formatLogOutput(parsed, "Asia/Shanghai", "iso")).toBe("2026-06-24T12:00:00+08:00");
    expect(formatLogOutput(parsed, "Asia/Tokyo", "log")).toBe("2026-06-24 13:00:00 UTC+09:00");
    expect(formatLogOutput(parsed, "Asia/Tokyo", "all")).toBe(
      ["Log: 2026-06-24 13:00:00 UTC+09:00", "ISO: 2026-06-24T13:00:00+09:00"].join("\n"),
    );
  });

  it("parses pasted UTC log time when selected as UTC", () => {
    const parsed = parseLogTime("2026-06-24 12:00:00", "utc");

    expect(parsed.source).toBe("UTC");
    expect(parsed.utc).toBe("2026-06-24 12:00:00 UTC+00:00");
    expect(parsed.china).toBe("2026-06-24 20:00:00 UTC+08:00");
  });

  it("treats explicit offsets as authoritative", () => {
    const parsed = parseLogTime("2026-06-24T12:00:00Z", "china");

    expect(parsed.source).toBe("Explicit offset");
    expect(parsed.utc).toBe("2026-06-24 12:00:00 UTC+00:00");
    expect(parsed.china).toBe("2026-06-24 20:00:00 UTC+08:00");
  });

  it("extracts timestamps from log lines and normalizes common formats", () => {
    expect(parseLogTime("2026-06-24 01:53:37,918", "china")).toMatchObject({
      parsedText: "2026-06-24 01:53:37.918",
      utc: "2026-06-23 17:53:37 UTC+00:00",
    });

    expect(parseLogTime("INFO 2026/06/24 12:00:00,123 request done", "china")).toMatchObject({
      parsedText: "2026-06-24 12:00:00.123",
      utc: "2026-06-24 04:00:00 UTC+00:00",
    });

    expect(parseLogTime("ts=20260624T120000+0800 level=info", "utc")).toMatchObject({
      parsedText: "2026-06-24 12:00:00+0800",
      source: "Explicit offset",
      utc: "2026-06-24 04:00:00 UTC+00:00",
    });

    expect(parseLogTime("Wed, 24 Jun 2026 04:00:00 GMT", "china")).toMatchObject({
      source: "Explicit offset",
      china: "2026-06-24 12:00:00 UTC+08:00",
    });

    expect(parseLogTime("epoch_ms=1782273600000", "china")).toMatchObject({
      parsedText: "1782273600000",
      source: "Unix timestamp",
      utc: "2026-06-24 04:00:00 UTC+00:00",
    });
  });
});
