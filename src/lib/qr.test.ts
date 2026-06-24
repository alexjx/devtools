import { describe, expect, it } from "vitest";
import { buildQrPayload, defaultQrForm, sampleQrForm, type QrForm } from "./qr";

function form(values: Partial<QrForm>): QrForm {
  return { ...defaultQrForm, ...values };
}

describe("qr payloads", () => {
  it("starts with empty user content but keeps sample values separate", () => {
    expect(defaultQrForm.url).toBe("");
    expect(sampleQrForm.url).toBe("https://example.com");
  });

  it("uses URL and text values directly", () => {
    expect(buildQrPayload("url", form({ url: " https://example.com/a?b=1 " }))).toBe("https://example.com/a?b=1");
    expect(buildQrPayload("text", form({ text: "hello\nworld" }))).toBe("hello\nworld");
  });

  it("builds mailto payloads with encoded optional fields", () => {
    expect(
      buildQrPayload(
        "email",
        form({
          email: "team@example.com",
          subject: "Hello QR",
          message: "Line one & two",
        }),
      ),
    ).toBe("mailto:team@example.com?subject=Hello+QR&body=Line+one+%26+two");
  });

  it("builds phone, sms, and WhatsApp payloads", () => {
    const values = form({ phone: "+1 (415) 555-0100", message: "Ship it" });

    expect(buildQrPayload("phone", values)).toBe("tel:+14155550100");
    expect(buildQrPayload("sms", values)).toBe("sms:+14155550100?body=Ship+it");
    expect(buildQrPayload("whatsapp", values)).toBe("https://wa.me/14155550100?text=Ship+it");
  });

  it("escapes Wi-Fi delimiters", () => {
    expect(
      buildQrPayload(
        "wifi",
        form({
          ssid: "lab;main",
          password: String.raw`a:b,c\"`,
          encryption: "WPA",
          hidden: true,
        }),
      ),
    ).toBe(String.raw`WIFI:T:WPA;S:lab\;main;P:a\:b\,c\\\";H:true;;`);
  });

  it("builds vCard payloads", () => {
    expect(
      buildQrPayload(
        "vcard",
        form({
          firstName: "Ada",
          lastName: "Lovelace",
          company: "Analytical Engines, Inc.",
          title: "Engineer",
          phone: "+44 20 0000 0000",
          email: "ada@example.com",
          website: "https://example.com",
          address: "1 Loop; Floor 2",
          city: "London",
          postalCode: "SW1A",
          country: "UK",
        }),
      ),
    ).toContain("FN:Ada Lovelace\nORG:Analytical Engines\\, Inc.\nTITLE:Engineer");
  });
});
