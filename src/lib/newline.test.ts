import { describe, expect, it } from "vitest";
import { formatEscapedNewlines } from "./newline";

describe("newline", () => {
  it("turns escaped newline markers into visible line breaks", () => {
    expect(formatEscapedNewlines("first\\nsecond\\nthird")).toBe("first\nsecond\nthird");
  });

  it("normalizes escaped CRLF and CR markers", () => {
    expect(formatEscapedNewlines("first\\r\\nsecond\\rthird")).toBe("first\nsecond\nthird");
  });

  it("leaves existing line breaks intact", () => {
    expect(formatEscapedNewlines("first\nsecond\\nthird")).toBe("first\nsecond\nthird");
  });
});
