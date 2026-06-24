import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { buildQrPayload, defaultQrForm, sampleQrForm, type QrPayloadKind, type QrForm, type WifiEncryption } from "../../lib/qr";
import { ClearButton, CopyButton, Output, ToolLayout } from "../shared";

const payloadKinds: Array<{ value: QrPayloadKind; label: string }> = [
  { value: "url", label: "URL" },
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "vcard", label: "vCard" },
];

type RenderedQr = {
  svg: string;
  png: string;
  error: string;
};

function updateField<K extends keyof QrForm>(form: QrForm, key: K, value: QrForm[K]): QrForm {
  return { ...form, [key]: value };
}

function downloadText(filename: string, value: string, type: string) {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadDataUrl(filename: string, value: string) {
  const link = document.createElement("a");
  link.href = value;
  link.download = filename;
  link.click();
}

function DownloadButton({
  disabled,
  label,
  onClick,
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="secondary-button" type="button" disabled={disabled} onClick={onClick}>
      <Download size={16} />
      {label}
    </button>
  );
}

export default function QrTool() {
  const [kind, setKind] = useState<QrPayloadKind>("url");
  const [form, setForm] = useState<QrForm>(defaultQrForm);
  const [rendered, setRendered] = useState<RenderedQr>({ svg: "", png: "", error: "" });

  const payload = useMemo(() => buildQrPayload(kind, form), [kind, form]);
  const trimmedPayload = payload.trim();

  useEffect(() => {
    let cancelled = false;

    if (!trimmedPayload) {
      setRendered({ svg: "", png: "", error: "" });
      return;
    }

    Promise.all([
      QRCode.toString(payload, {
        errorCorrectionLevel: "M",
        margin: 2,
        type: "svg",
        width: 320,
      }),
      QRCode.toDataURL(payload, {
        errorCorrectionLevel: "M",
        margin: 2,
        type: "image/png",
        width: 640,
      }),
    ])
      .then(([svg, png]) => {
        if (!cancelled) {
          setRendered({ svg, png, error: "" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRendered({ svg: "", png: "", error: "Unable to generate QR code for this content." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [payload, trimmedPayload]);

  const setValue = <K extends keyof QrForm>(key: K, value: QrForm[K]) => {
    setForm((current) => updateField(current, key, value));
  };

  return (
    <ToolLayout
      output={
        <>
          <div className="qr-preview" aria-label="QR preview">
            {rendered.svg ? (
              <img alt="Generated QR code" src={`data:image/svg+xml;base64,${btoa(rendered.svg)}`} />
            ) : (
              <span>Enter content to generate a QR code.</span>
            )}
          </div>
          <div className="field mt-3">
            <label htmlFor="qr-payload">Payload</label>
            <Output value={payload} />
          </div>
          {rendered.error ? <p className="error">{rendered.error}</p> : null}
          <div className="actions mt-3">
            <CopyButton value={payload} />
            <DownloadButton
              disabled={!rendered.svg}
              label="SVG"
              onClick={() => downloadText("qr-code.svg", rendered.svg, "image/svg+xml")}
            />
            <DownloadButton disabled={!rendered.png} label="PNG" onClick={() => downloadDataUrl("qr-code.png", rendered.png)} />
          </div>
        </>
      }
    >
      <h2>QR Code</h2>
      <div className="field">
        <span className="field-label" id="qr-kind-label">
          Payload template
        </span>
        <div className="format-buttons" role="group" aria-labelledby="qr-kind-label">
          {payloadKinds.map((item) => (
            <button
              key={item.value}
              className="format-button"
              type="button"
              aria-pressed={kind === item.value}
              onClick={() => setKind(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <QrFields kind={kind} form={form} setValue={setValue} />
      <div className="actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setKind("url");
            setForm(sampleQrForm);
          }}
        >
          Sample URL
        </button>
        <ClearButton onClick={() => setForm(defaultQrForm)} />
      </div>
    </ToolLayout>
  );
}

function QrFields({
  kind,
  form,
  setValue,
}: {
  kind: QrPayloadKind;
  form: QrForm;
  setValue: <K extends keyof QrForm>(key: K, value: QrForm[K]) => void;
}) {
  switch (kind) {
    case "url":
      return (
        <div className="field">
          <label htmlFor="qr-url">URL</label>
          <input id="qr-url" type="url" value={form.url} onChange={(event) => setValue("url", event.target.value)} />
        </div>
      );
    case "text":
      return (
        <div className="field">
          <label htmlFor="qr-text">Text</label>
          <textarea id="qr-text" rows={10} value={form.text} onChange={(event) => setValue("text", event.target.value)} />
        </div>
      );
    case "email":
      return (
        <>
          <div className="field">
            <label htmlFor="qr-email">Email</label>
            <input id="qr-email" type="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="qr-subject">Subject</label>
            <input id="qr-subject" value={form.subject} onChange={(event) => setValue("subject", event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="qr-message">Message</label>
            <textarea id="qr-message" rows={6} value={form.message} onChange={(event) => setValue("message", event.target.value)} />
          </div>
        </>
      );
    case "phone":
      return (
        <div className="field">
          <label htmlFor="qr-phone">Phone number</label>
          <input id="qr-phone" type="tel" value={form.phone} onChange={(event) => setValue("phone", event.target.value)} />
        </div>
      );
    case "sms":
    case "whatsapp":
      return (
        <>
          <div className="field">
            <label htmlFor="qr-phone">Phone number</label>
            <input id="qr-phone" type="tel" value={form.phone} onChange={(event) => setValue("phone", event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="qr-message">Message</label>
            <textarea id="qr-message" rows={6} value={form.message} onChange={(event) => setValue("message", event.target.value)} />
          </div>
        </>
      );
    case "wifi":
      return (
        <>
          <div className="field">
            <label htmlFor="qr-ssid">Network name</label>
            <input id="qr-ssid" value={form.ssid} onChange={(event) => setValue("ssid", event.target.value)} />
          </div>
          <div className="control-grid two">
            <div className="field">
              <label htmlFor="qr-encryption">Encryption</label>
              <select
                id="qr-encryption"
                value={form.encryption}
                onChange={(event) => setValue("encryption", event.target.value as WifiEncryption)}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <label className="check-field" htmlFor="qr-hidden">
              <input
                id="qr-hidden"
                type="checkbox"
                checked={form.hidden}
                onChange={(event) => setValue("hidden", event.target.checked)}
              />
              Hidden network
            </label>
          </div>
          <div className="field">
            <label htmlFor="qr-password">Password</label>
            <input id="qr-password" value={form.password} onChange={(event) => setValue("password", event.target.value)} />
          </div>
        </>
      );
    case "vcard":
      return (
        <>
          <div className="control-grid two">
            <div className="field">
              <label htmlFor="qr-first-name">First name</label>
              <input id="qr-first-name" value={form.firstName} onChange={(event) => setValue("firstName", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="qr-last-name">Last name</label>
              <input id="qr-last-name" value={form.lastName} onChange={(event) => setValue("lastName", event.target.value)} />
            </div>
          </div>
          <div className="control-grid two">
            <div className="field">
              <label htmlFor="qr-company">Company</label>
              <input id="qr-company" value={form.company} onChange={(event) => setValue("company", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="qr-title">Title</label>
              <input id="qr-title" value={form.title} onChange={(event) => setValue("title", event.target.value)} />
            </div>
          </div>
          <div className="control-grid two">
            <div className="field">
              <label htmlFor="qr-phone">Phone number</label>
              <input id="qr-phone" type="tel" value={form.phone} onChange={(event) => setValue("phone", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="qr-email">Email</label>
              <input id="qr-email" type="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="qr-website">Website</label>
            <input id="qr-website" type="url" value={form.website} onChange={(event) => setValue("website", event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="qr-address">Address</label>
            <input id="qr-address" value={form.address} onChange={(event) => setValue("address", event.target.value)} />
          </div>
          <div className="control-grid two">
            <div className="field">
              <label htmlFor="qr-city">City</label>
              <input id="qr-city" value={form.city} onChange={(event) => setValue("city", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="qr-postal-code">Postal code</label>
              <input id="qr-postal-code" value={form.postalCode} onChange={(event) => setValue("postalCode", event.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="qr-country">Country</label>
            <input id="qr-country" value={form.country} onChange={(event) => setValue("country", event.target.value)} />
          </div>
        </>
      );
  }
}
