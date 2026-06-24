export type QrFormat = "url" | "text" | "email" | "phone" | "sms" | "whatsapp" | "wifi" | "vcard";

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

export function buildQrPayload(format: QrFormat, form: QrForm): string {
  switch (format) {
    case "url":
      return form.url.trim();
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
