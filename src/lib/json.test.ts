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

  it("validates malformed json", () => {
    const result = validateJson("{");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Invalid JSON");
    }
    expect(isJsonValid("{")).toBe(false);
  });
});
