import { describe, expect, it } from "vitest";
import { formatJson, isJsonValid, minifyJson, parseJson, validateJson } from "./json";

describe("json", () => {
  const input = '{"b":2,"a":[1,2]}';

  it("parses and formats json", () => {
    expect(parseJson(input)).toEqual({ b: 2, a: [1, 2] });
    expect(formatJson(input)).toBe(`{
  "b": 2,
  "a": [
    1,
    2
  ]
}`);
  });

  it("minifies json", () => {
    expect(minifyJson(input)).toBe('{"b":2,"a":[1,2]}');
  });

  it("formats json object pasted from a log line", () => {
    expect(formatJson('INFO request payload={"ok":true,"count":2} done')).toBe(`{
  "ok": true,
  "count": 2
}`);
  });

  it("skips non-json log prefixes before the payload", () => {
    expect(formatJson('[INFO] request payload={"ok":true}')).toBe(`{
  "ok": true
}`);
  });

  it("repairs missing closing braces and trailing commas while formatting", () => {
    expect(formatJson('{"ok":true,"items":[1,2,')).toBe(`{
  "ok": true,
  "items": [
    1,
    2
  ]
}`);
  });

  it("repairs an unfinished string while formatting", () => {
    expect(formatJson('{"message":"hello')).toBe(`{
  "message": "hello"
}`);
  });

  it("keeps unrepairable json invalid", () => {
    expect(() => formatJson('INFO payload={"a":')).toThrow("Invalid JSON");
  });

  it("validates malformed json", () => {
    const result = validateJson("{");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Invalid JSON");
    }
    expect(isJsonValid("{")).toBe(false);
  });
});
