# QR Generator Review

## Sources

- QR.io public home page and live generator inspected on 2026-06-24.
- QR.io public pages: `/`, `/qr-codes`, `/features`, `/dynamic`, `/pricing`, `/faq`, `/blog/static-vs-dynamic-qr-codes`.
- Live Playwright snapshots saved to `.agents/research/qrio-home.png` and `.agents/research/qrio-download-click.png`.
- npm metadata checked for `qrcode`, `@types/qrcode`, `qr-code-styling`, and `qrcode.react`.

## QR.io Behavior

- Public generator has a three-step workflow: content, design, download.
- Field-based static formats exposed in the live form:
  - Link: `url`
  - Text: `text`
  - E-mail: `email`, `subject`, `message`
  - Call: `country_code`, `phone_number`
  - SMS: `country_code`, `phone_number`, `message`
  - V-card: first name, last name, phone, mobile, email, website, company, title, fax, address, city, post code, country
  - WhatsApp: country code, phone number, message
  - Wi-Fi: SSID, encryption, password, hidden flag
- Account/dynamic formats advertised:
  - PDF, App, Images, Video, Social Media, Event, Menu, MP3, Multiple Links, Business Page, Profile Card, Coupons, Feedback.
- Download is account-gated. The live page posts to `https://qr.io/generator2/ajax/process-index.php`, receives SVG, then opens a signup modal to download.
- The posted style model includes background, foreground, gradient, marker colors/shapes, body pattern, logo option, frame option, and frame label.

## Local Replication Fit

- Good fit:
  - Local static QR generation.
  - Payload preview/copy.
  - SVG and PNG download.
  - Error correction level and margin/size controls.
  - Basic foreground/background colors.
- Poor fit without backend:
  - Editable dynamic QR destinations.
  - Scan analytics.
  - Hosted landing pages.
  - File uploads for PDF/images/video/audio.
  - Team/account/API/bulk management.

## Dependency Options

- `qrcode@1.5.4`, MIT: small QR encoder with SVG/canvas/data URL output. Best lean fit.
- `@types/qrcode@1.5.6`, MIT: TypeScript definitions.
- `qr-code-styling@1.9.2`, MIT: closer to QR.io custom styling but heavier UI/API surface.
- `qrcode.react@4.2.0`, ISC: React component; useful for render-only, less direct for export/workflow helpers.

## Recommended V1

- Add one `QR Code` tool under Generators.
- Support local static formats: URL, Text, Email, Phone, SMS, WhatsApp, Wi-Fi, vCard, Event.
- Show generated payload string in a read-only output area for transparency.
- Render QR preview as SVG.
- Provide Copy payload, Download SVG, Download PNG.
- Controls: type, error correction level, size, margin, dark color, light color, transparent background.
- Defer: logos, gradients, custom finder/body shapes, frames, hosted files, analytics, dynamic redirects.

## Verification Plan

- Unit tests for payload builders:
  - URL and raw text passthrough.
  - `mailto:` query encoding.
  - `tel:`, `sms:`, WhatsApp URL formatting.
  - Wi-Fi escaping for `;`, `,`, `:`, `\`, and quotes where needed.
  - vCard escaping and line layout.
  - iCalendar event date formatting if included.
- Component/e2e tests:
  - Tool appears in registry/search.
  - Changing format updates visible fields and payload.
  - SVG preview renders for sample URL.
  - Download buttons produce non-empty SVG/PNG artifacts.
