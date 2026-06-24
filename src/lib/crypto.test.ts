import { describe, expect, it } from "vitest";
import { digest, hashText, uuid } from "./crypto";

describe("crypto", () => {
  it("hashes text with web crypto", async () => {
    const expected =
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

    await expect(hashText("abc", "sha-256")).resolves.toBe(expected);
    await expect(digest("abc", "SHA-256")).resolves.toBe(expected);
  });

  it("generates a v4 uuid", () => {
    const value = uuid();

    expect(value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
