import { describe, expect, it } from "vitest";
import { encodeBase64Url } from "./codec";
import { decodeJwt } from "./jwt";

describe("jwt", () => {
  function token(header: unknown, payload: unknown, signature = "sig"): string {
    return [
      encodeBase64Url(JSON.stringify(header)),
      encodeBase64Url(JSON.stringify(payload)),
      signature,
    ].join(".");
  }

  it("decodes header and payload without verifying the signature", () => {
    const decoded = decodeJwt(
      token(
        { alg: "HS256", typ: "JWT" },
        { sub: "1234567890", name: "Jane Doe", admin: true },
      ),
    );

    expect(decoded.header).toEqual({ alg: "HS256", typ: "JWT" });
    expect(decoded.payload).toEqual({
      sub: "1234567890",
      name: "Jane Doe",
      admin: true,
    });
    expect(decoded.signature).toBe("sig");
  });

  it("allows an empty signature segment", () => {
    const decoded = decodeJwt(token({ alg: "none" }, { ok: true }, ""));

    expect(decoded.signature).toBe("");
  });

  it("rejects malformed tokens", () => {
    expect(() => decodeJwt("a.b")).toThrow("JWT must have three segments.");
    expect(() => decodeJwt("!.eyJmb28iOiJiYXIifQ.sig")).toThrow("Invalid JWT header encoding.");
    expect(() => decodeJwt(`${encodeBase64Url(JSON.stringify({ alg: "HS256" }))}.${encodeBase64Url("not-json")}.sig`)).toThrow(
      "Invalid JWT payload JSON.",
    );
  });
});
