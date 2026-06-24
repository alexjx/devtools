export type QrPayloadKind = "url" | "text" | "email" | "phone" | "sms" | "whatsapp" | "wifi" | "vcard";

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export type QrForm = {
  url: string;
  text: string;
  email: string;
  subject: string;
  message: string;
  phone: string;
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  website: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export const defaultQrForm: QrForm = {
  url: "",
  text: "",
  email: "",
  subject: "",
  message: "",
  phone: "",
  ssid: "",
  password: "",
  encryption: "WPA",
  hidden: false,
  firstName: "",
  lastName: "",
  company: "",
  title: "",
  website: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

export const sampleQrForm: QrForm = {
  ...defaultQrForm,
  url: "https://example.com",
};

function cleanPhone(value: string): string {
  return value.trim().replace(/[^\d+]/g, "");
}

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  return trimmed && !/^[a-z][a-z\d+.-]*:/i.test(trimmed) ? `https://${trimmed}` : trimmed;
}

function withQuery(base: string, params: Record<string, string>): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value.trim()) {
      query.set(key, value.trim());
    }
  }

  const value = query.toString();
  return value ? `${base}?${value}` : base;
}

function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function escapeVcard(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function vcardLine(name: string, value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? `${name}:${escapeVcard(trimmed)}` : null;
}

/**
 * Builds the text encoded into the QR symbol.
 *
 * QR Code itself stores data using encoding modes such as numeric, alphanumeric,
 * byte, Kanji, ECI, and FNC1. URL, email, Wi-Fi, and contact "types" are
 * scanner-side classifications inferred from payload conventions after decode.
 */
export function buildQrPayload(kind: QrPayloadKind, form: QrForm): string {
  switch (kind) {
    case "url":
      return normalizeUrl(form.url);
    case "text":
      return form.text;
    case "email":
      return withQuery(`mailto:${form.email.trim()}`, {
        subject: form.subject,
        body: form.message,
      });
    case "phone":
      return `tel:${cleanPhone(form.phone)}`;
    case "sms":
      return withQuery(`sms:${cleanPhone(form.phone)}`, { body: form.message });
    case "whatsapp":
      return withQuery(`https://wa.me/${cleanPhone(form.phone).replace(/^\+/, "")}`, {
        text: form.message,
      });
    case "wifi": {
      const encryption = form.encryption === "nopass" ? "nopass" : form.encryption;
      return `WIFI:T:${encryption};S:${escapeWifi(form.ssid.trim())};P:${escapeWifi(form.password)};H:${form.hidden ? "true" : "false"};;`;
    }
    case "vcard": {
      const fullName = [form.firstName, form.lastName].map((part) => part.trim()).filter(Boolean).join(" ");
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${escapeVcard(form.lastName.trim())};${escapeVcard(form.firstName.trim())};;;`,
        vcardLine("FN", fullName),
        vcardLine("ORG", form.company),
        vcardLine("TITLE", form.title),
        vcardLine("TEL;TYPE=CELL", form.phone),
        vcardLine("EMAIL", form.email),
        vcardLine("URL", form.website),
        form.address.trim() || form.city.trim() || form.postalCode.trim() || form.country.trim()
          ? `ADR;TYPE=WORK:;;${escapeVcard(form.address.trim())};${escapeVcard(form.city.trim())};;${escapeVcard(form.postalCode.trim())};${escapeVcard(form.country.trim())}`
          : null,
        "END:VCARD",
      ];

      return lines.filter((line): line is string => Boolean(line)).join("\n");
    }
  }
}
