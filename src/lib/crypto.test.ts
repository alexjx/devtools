import { describe, expect, it } from "vitest";
import { validate as validateUuid, version as uuidVersion } from "uuid";
import { digest, hashText, uuid, type UuidVersion } from "./crypto";

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

  it("generates selectable uuid versions", () => {
    const versions: Array<[UuidVersion, number]> = [
      ["v1", 1],
      ["v4", 4],
      ["v6", 6],
      ["v7", 7],
    ];

    for (const [selected, expected] of versions) {
      const value = uuid({ version: selected });

      expect(validateUuid(value)).toBe(true);
      expect(uuidVersion(value)).toBe(expected);
    }
  });

  it("generates deterministic name-based uuids", () => {
    const first = uuid({ version: "v5", name: "example.com", namespace: "dns" });
    const second = uuid({ version: "v5", name: "example.com", namespace: "dns" });
    const different = uuid({ version: "v3", name: "example.com", namespace: "dns" });

    expect(first).toBe(second);
    expect(uuidVersion(first)).toBe(5);
    expect(uuidVersion(different)).toBe(3);
    expect(different).not.toBe(first);
  });

  it("validates name-based uuid inputs", () => {
    expect(() => uuid({ version: "v5" })).toThrow("Enter a name for UUID v3/v5.");
    expect(() =>
      uuid({ version: "v5", name: "example.com", namespace: "custom", customNamespace: "nope" }),
    ).toThrow("Enter a valid namespace UUID.");
  });
});
