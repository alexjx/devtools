import { describe, expect, it } from "vitest";
import {
  decodeBase64,
  decodeBase64Url,
  decodeUrl,
  encodeBase64,
  encodeBase64Url,
  encodeUrl,
} from "./codec";

describe("codec", () => {
  it("round-trips base64 text", () => {
    const text = "Hi, 🌍";
    const encoded = encodeBase64(text);

    expect(encoded).toBe("SGksIPCfjI0=");
    expect(decodeBase64(encoded)).toBe(text);
  });

  it("accepts base64url input", () => {
    const text = "JWT payload";
    const encoded = encodeBase64Url(text);

    expect(encoded).not.toContain("=");
    expect(decodeBase64Url(encoded)).toBe(text);
  });

  it("encodes and decodes url text", () => {
    const text = "a b/?=+";
    const encoded = encodeUrl(text);

    expect(encoded).toBe("a%20b%2F%3F%3D%2B");
    expect(decodeUrl(encoded)).toBe(text);
  });

  it("rejects malformed base64", () => {
    expect(() => decodeBase64("abc$")).toThrow("Invalid base64 input.");
  });

  it("rejects malformed url encoding", () => {
    expect(() => decodeUrl("%E0%A4")).toThrow("Invalid URL-encoded input.");
  });
});
