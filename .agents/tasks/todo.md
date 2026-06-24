# Devtools Static SPA Implementation

## Plan

- [x] Review and challenge the product plan.
- [x] Revise regex scope to a Regex101 handoff instead of local multi-engine matching.
- [x] Create implementation branch.
- [x] Scaffold Vite React TypeScript static SPA.
- [x] Implement app shell, hash routing, registry, sidebar, and command palette.
- [x] Implement v1 tool modules.
- [x] Add helper APIs and focused unit tests.
- [x] Add GitHub Pages publishing workflow.
- [x] Add README with dev, test, build, and deploy notes.
- [x] Add Playwright smoke coverage.
- [x] Run final build/test verification.

## Dependency Graph

- [A] Scaffold project config and base files: deps=[] status=done
- [B] App shell, routing, registry, command palette: deps=[A] status=done
- [C] Tool modules: deps=[A,B] status=done
- [D] Tests and GitHub Pages workflow/docs: deps=[A,B,C] status=done
- [E] Final verification: deps=[A,B,C,D] status=done

## Review

Implementation completed on `feature/static-devtools-spa`.

V1 includes a dense developer-tool SPA shell with command palette search, modular registry-driven tools, transient per-tool inputs, and a GitHub Pages workflow. Tools implemented: Regex101 handoff, Base64, URL, JSON, timestamp, timezone, UUID, hash, and JWT decoder.

Verification:

- `npm run test` passed: 5 files, 16 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed on desktop Chromium and mobile Pixel 7.

## Timestamp Flexibility Update

- [x] Plan scoped timestamp/log-time parsing workflow.
- [x] Add parser helpers for UTC/China pasted log timestamps.
- [x] Replace timestamp UI with separate source interpretation and output format controls.
- [x] Add tests for UTC and China-time log inputs.
- [x] Run build/test/e2e verification.

## Timestamp Review

- Timestamp now accepts pasted log times with explicit offsets, Unix timestamps, and plain wall-clock strings.
- Explicit offsets such as `Z`, `+00:00`, and `+08:00` are authoritative.
- Plain log times use the selected source timezone: China time, UTC, or auto.
- The UI clearly displays the parsed point-in-time as UTC, China time, and Unix seconds/milliseconds before the chosen output.
- Output timezone and output format are independent controls.

Verification:

- `npm run test` passed: 5 files, 19 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 4 browser tests across desktop Chromium and mobile Pixel 7.

## Single Time Tool Update

- [x] Plan scoped consolidation of Timestamp and Timezones.
- [x] Remove standalone Timezones tool from navigation/search.
- [x] Support dynamic add/remove output time zones in Timestamp.
- [x] Generalize time formatting helpers to arbitrary IANA time zones.
- [x] Add tests and browser coverage for dynamic zones.
- [x] Run build/test/e2e verification.

## Single Time Tool Review

- The standalone Timezones tool was removed from the registry.
- The remaining Time tool parses pasted log times and manages a dynamic output timezone list.
- Users can add any valid IANA timezone, remove zones, and keep at least one output zone.
- Time formatting now supports arbitrary IANA zones instead of only UTC/China.

Verification:

- `npm run test` passed: 5 files, 19 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 6 browser tests across desktop Chromium and mobile Pixel 7.

## Adaptive Time Input Update

- [x] Plan adaptive pasted-time parser and user hints.
- [x] Support clean timestamps and timestamps embedded in log lines.
- [x] Support ISO, slash date, compact date, RFC-like date, Unix seconds, and Unix milliseconds.
- [x] Show accepted input examples near the pasted time field.
- [x] Add parser tests and e2e coverage.
- [x] Run build/test/e2e verification.

## Adaptive Time Input Review

- The Time tool now extracts the first supported timestamp from a pasted log line.
- Supported examples include `2026-06-24 01:53:37,918`, ISO timestamps with offsets, slash dates, compact dates, RFC `GMT` dates, Unix seconds, and Unix milliseconds.
- The parsed summary displays the exact extracted timestamp so the user can verify what was interpreted.
- Fixed an accessibility label collision in the examples region.

Verification:

- `npm run test` passed: 5 files, 20 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 8 browser tests across desktop Chromium and mobile Pixel 7.

## Delicate UI Refinement

- [x] Review current app shell density and visual weight.
- [x] Tighten desktop spacing, borders, panels, form fields, and buttons.
- [x] Preserve mobile touch target size and accessibility.
- [x] Verify with tests, build, and browser checks.

## Delicate UI Review

- Refined the app shell with a slimmer sidebar, lighter surfaces, hairline borders, smaller desktop controls, quieter nav states, and more precise output/form styling.
- Kept mobile touch targets at 44px minimum while allowing desktop controls to be more compact.
- Captured visual checks in `.agents/research/ui-refined-desktop.png` and `.agents/research/ui-refined-mobile.png`.

Verification:

- `npm run test` passed: 5 files, 20 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 8 browser tests across desktop Chromium and mobile Pixel 7.

## Wide Screen Layout Update

- [x] Review current max-width behavior on large displays.
- [x] Expand the tool workspace on 1920px+ and 2400px+ displays without stretching to full viewport.
- [x] Preserve readable panel proportions and existing mobile/tablet behavior.
- [x] Capture 2560px visual check and run verification.

## Wide Screen Layout Review

- Added responsive content width caps for large monitors: default remains compact, 1600px+ expands to a wider workspace, and 2200px+ caps around a 1960px working area.
- Balanced the Time tool columns on wide screens so input and output both benefit from extra space without stretching to the full 2560px viewport.
- Captured the 2560px visual check at `.agents/research/ui-wide-2560.png`.

Verification:

- `npm run test` passed: 5 files, 20 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 8 browser tests across desktop Chromium and mobile Pixel 7.

## Time Settings Persistence

- [x] Define low-risk settings to persist and exclude pasted log input.
- [x] Add scoped local-storage persistence for source mode, output format, timezone list, and add-timezone draft.
- [x] Validate stored values before using them.
- [x] Add browser coverage for persistence across reloads.
- [x] Run build/test/e2e verification.

## Time Settings Persistence Review

- Persisted Time tool settings under scoped `devtools.time.*` local-storage keys.
- Persisted source mode, output format, output timezone list, and add-timezone draft.
- Pasted time/log input remains transient and is not stored.
- Stored values are validated before use, including IANA timezone validation for the saved zone list.

Verification:

- `npm run test` passed: 5 files, 20 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 10 browser tests across desktop Chromium and mobile Pixel 7.

## Time Output Deduplication

- [x] Identify duplicated invariant Unix values in per-timezone copy output.
- [x] Remove Unix seconds/milliseconds from each timezone block in `all` output.
- [x] Keep Unix values visible only in parsed summary or epoch-only copy modes.
- [x] Update tests and run verification.

## Time Output Deduplication Review

- Per-timezone copy output now contains only timezone-specific values: log time and ISO time.
- Unix seconds/milliseconds remain visible once in the parsed summary.
- Selecting `Unix seconds` or `Unix milliseconds` as the output format copies the invariant epoch value once, not once per timezone.

Verification:

- `npm run test` passed: 5 files, 20 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 12 browser tests across desktop Chromium and mobile Pixel 7.

## Time Copy Card Update

- [x] Decide to remove the generic Time output textbox and bottom copy action.
- [x] Split Unix seconds and Unix milliseconds into separate copyable value cards.
- [x] Add top-right copy controls to parsed and timezone output cards.
- [x] Update e2e assertions and run verification.

## Time Copy Card Review

- Removed the generic Time output textbox and bottom copy action.
- Split Unix seconds and Unix milliseconds into separate parsed-summary cards.
- Added top-right copy buttons inside parsed and timezone output cards without affecting card layout.
- Kept timezone output cards focused on timezone-specific formatted values.

Verification:

- `npm run test` passed: 5 files, 20 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 14 browser tests across desktop Chromium and mobile Pixel 7.

## QR Generator Review

- [x] Inspect local tool architecture and dependency constraints.
- [x] Review `qr.io` visible QR workflows and supported content formats.
- [x] Identify what can be replicated locally without account-backed dynamic QR infrastructure.
- [x] Recommend lean scope, data model, dependencies, tests, and verification plan.

## QR Generator Review Notes

QR.io uses a content -> design -> download workflow. The public live form supports field-based static content for Link, Text, E-mail, Call, SMS, V-card, WhatsApp, and WI-FI. Its public navigation also advertises PDF, App, Images, Video, Social Media, Event, 2D Barcode, and more dynamic/hosted formats, but those are account or backend-backed workflows rather than self-contained local encodings.

Download is account-gated: clicking Download QR Code posts payload/style data to `https://qr.io/generator2/ajax/process-index.php`, receives SVG, and then opens a signup modal. Dynamic QR codes, editable destinations, scan analytics, hosted landing pages, file uploads, team/API/bulk features, and dashboards do not fit this static SPA without adding backend state.

Recommended v1 is a local static QR generator with URL, Text, Email, Phone, SMS, WhatsApp, Wi-Fi, vCard, and optionally Event payload builders; SVG preview; PNG/SVG downloads; copyable payload; error correction, size, margin, dark/light color, and transparent background controls.

Detailed notes are in `.agents/research/qr-generator-review.md`.

## Basic Local QR Generator

- [x] Add lean QR encoding dependency.
- [x] Implement local static payload builders for common formats.
- [x] Add QR Code tool UI with simple format fields and preview.
- [x] Register the tool in navigation/search.
- [x] Add unit and e2e coverage.
- [x] Run build/test/e2e verification.

## Basic Local QR Generator Review

Implemented a local static QR Code tool under Generators. Supported formats: URL, Text, Email, Phone, SMS, WhatsApp, Wi-Fi, and vCard. The tool renders an in-browser QR preview, shows the exact encoded payload, and supports copying the payload plus downloading SVG or PNG.

Dependency added: `qrcode` with `@types/qrcode`.

Verification:

- `npm run test` passed: 6 files, 25 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 16 browser tests across desktop Chromium and mobile Pixel 7.
- Visual checks captured: `.agents/research/qr-desktop.png` and `.agents/research/qr-mobile.png`.

Audit note:

- `npm audit` reports 5 vulnerabilities through the existing `vitest` 2.x toolchain and nested Vite/esbuild packages. The available fix is a major Vitest upgrade to 4.x, so it was not bundled into this QR feature.

## QR Category Buttons

- [x] Replace the QR format dropdown with quick-select buttons.
- [x] Keep keyboard and screen-reader semantics clear.
- [x] Update browser coverage and rerun verification.

## QR Category Buttons Review

Replaced the QR format dropdown with a quick-select button grid. The selected format uses `aria-pressed`, and the group is labelled by the Format label for assistive tech. Desktop uses a 4x2 grid; mobile uses a 2-column grid with touch-size buttons.

Verification:

- `npm run test` passed: 6 files, 25 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 16 browser tests across desktop Chromium and mobile Pixel 7.
- Visual checks captured: `.agents/research/qr-buttons-desktop.png` and `.agents/research/qr-buttons-mobile.png`.

Test fix:

- Tightened existing heading assertions to `level: 1` after e2e exposed ambiguous selectors matching both page `h1` and panel `h2`.

## QR Empty Default URL

- [x] Start the QR URL field empty instead of prefilled.
- [x] Keep `Sample URL` as the explicit way to populate `https://example.com`.
- [x] Update regression coverage for empty initial state.
- [x] Run verification.

## QR Empty Default URL Review

Updated the QR tool so user-editable URL content starts empty. `Sample URL` now uses a separate sample form state to populate `https://example.com` only when requested. Clear resets back to the empty default.

Verification:

- `npm run test` passed: 6 files, 26 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 16 browser tests across desktop Chromium and mobile Pixel 7.
- Visual check captured: `.agents/research/qr-empty-default-mobile.png`.

## UUID Version Selector

- [x] Confirm UUID standard/package support and choose the lean implementation.
- [x] Add UUID generation helpers for selectable versions.
- [x] Update the UUID tool UI with a version selector and name/namespace inputs where needed.
- [x] Add unit and e2e coverage for selected versions.
- [x] Run build/test/e2e verification.

## UUID Version Selector Review

Implemented selectable UUID generation using `uuid@14.0.1`, which targets RFC 9562 UUIDs. The UUID tool now supports v1, v3, v4, v5, v6, and v7. v4 remains the default. v3 and v5 expose name and namespace controls because they are deterministic name-based UUIDs; `Generate ten` is disabled for those versions to avoid duplicate deterministic output.

Verification:

- `npm run test` passed: 6 files, 29 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 18 browser tests across desktop Chromium and mobile Pixel 7.
- Visual checks captured: `.agents/research/uuid-versions-desktop.png` and `.agents/research/uuid-versions-mobile.png`.

Reference:

- RFC 9562: `https://www.rfc-editor.org/info/rfc9562`

## UUID Version Descriptions

- [x] Replace ambiguous version labels with ID-first labels.
- [x] Add short descriptions explaining what each UUID version does.
- [x] Update coverage and run verification.

## UUID Version Descriptions Review

Updated UUID version choices to show the ID and a short description for each version:

- `v1 Time + Node`: timestamp, clock sequence, and node identifier.
- `v3 Name MD5`: deterministic namespace + name UUID using MD5.
- `v4 Random`: random UUID and the default.
- `v5 Name SHA-1`: deterministic namespace + name UUID using SHA-1.
- `v6 Ordered Time`: v1-style time UUID reordered for better sorting.
- `v7 Unix Time`: Unix timestamp plus randomness for modern sortable IDs.

Verification:

- `npm run test` passed: 6 files, 29 tests.
- `npm run build` passed.
- `GITHUB_PAGES=true npm run build` passed.
- `npm run e2e` passed: 18 browser tests across desktop Chromium and mobile Pixel 7.
- Visual checks captured: `.agents/research/uuid-descriptions-desktop.png` and `.agents/research/uuid-descriptions-mobile.png`.

## App Icon Configuration

- [x] Generate an initial project app icon with the image generation skill.
- [x] Replace the complex generated icon with a simplified single-color SVG source.
- [x] Create favicon, PNG icon, Apple touch icon, and web manifest assets from the simplified source.
- [x] Configure `index.html` icon and manifest links for the GitHub Pages base path.
- [x] Run test and Pages-mode build verification.

## App Icon Configuration Review

Configured a single-color developer-tools app icon and browser/mobile icon references. The final source is a simple SVG terminal mark in one blue color, with PNG/ICO variants generated from that source.

Assets added under `public/`:

- `icon.svg`
- `favicon.ico`
- `favicon-16.png`
- `favicon-32.png`
- `apple-touch-icon.png`
- `icon-192.png`
- `icon-512.png`
- `site.webmanifest`

Verification:

- `npm run test` passed: 6 files, 29 tests.
- `GITHUB_PAGES=true npm run build` passed.
- Built `dist/index.html` references icons under `/devtools/`.

## QR URL Payload Type Check

- [x] Inspect QR tool UI and library wrapper to understand how URL/text types are represented.
- [x] Check dependency/library behavior for generated QR payloads and available metadata/type support.
- [x] Reproduce current generated results for text and URL inputs.
- [x] Fix the type handling so URL and text do not collapse for scheme-less addresses.
- [x] Add tests that prove the behavior.
- [x] Run verification and document results.

## QR URL Payload Type Review

The `qrcode` package does not encode semantic content types such as URL vs text. Its `type` option controls output rendering like SVG or PNG. QR scanners infer URL behavior from the payload string itself.

Before this change, URL mode with `example.com` produced the same payload as Text mode with `example.com`. URL mode now normalizes scheme-less addresses to `https://example.com`, while Text mode preserves the literal value.

Verification:

- `npm test -- --run src/lib/qr.test.ts` passed.
- `npm test` passed: 6 files, 29 tests.
- `npm run build` passed.
- Runtime QR library check: Text `example.com` generated version 1 / 21 modules; URL `https://example.com` generated version 2 / 25 modules; matrix equality was `false`.

## QR Type Research

- [x] Verify QR standard fields from primary or implementation references.
- [x] Verify how scanner libraries classify URL vs text results.
- [x] Compare current `qrcode` output against decoder behavior.
- [x] Decide whether to keep, revise, or replace the QR generation approach.
- [x] Update code/tests based on the researched result.

## QR Type Research Review

QR Code symbols have standard data encoding modes, not application-level URL/Text fields. DENSO WAVE's outline lists data types such as Numeric, Alphanumeric, 8-bit bytes, and Kanji. ZXing's QR decoder mode enum similarly maps QR mode bits to `NUMERIC`, `ALPHANUMERIC`, `BYTE`, `KANJI`, `ECI`, `FNC1`, and related QR modes.

Scanner result types such as URI, TEXT, EMAIL, and WIFI are post-decode parser classifications. ZXing's `ResultParser.parseResult` takes raw decoded text and returns the first matching structured result; otherwise it falls back to `TextParsedResult`.

Temporary decoder verification using QR images generated by our installed `qrcode` package and decoded through ZXing Java:

- `hello world` -> raw `hello world`, parsed type `TEXT`.
- `example.com` -> raw `example.com`, parsed type `URI`, display `http://example.com`.
- `https://example.com` -> raw `https://example.com`, parsed type `URI`.
- `URL:https://example.com` -> raw `URL:https://example.com`, parsed type `URI`.
- `mailto:team@example.com` -> raw `mailto:team@example.com`, parsed type `EMAIL_ADDRESS`.
- `WIFI:T:WPA;S:lab;P:secret;;` -> raw Wi-Fi payload, parsed type `WIFI`.

Conclusion: the `qrcode` library is not broken for missing a URL/Text type field. It correctly encodes QR symbols. Application-level result type depends on payload conventions and decoder inference. The URL normalization change is still useful because URL mode should emit an explicit URI payload, but Text mode cannot force scanners to treat URL-looking text as text without changing the literal data.

## QR Payload Terminology Alignment

- [x] Rename code-level QR format selection to payload kind.
- [x] Change the UI selector label from `Format` to `Payload template`.
- [x] Document in `src/lib/qr.ts` that URL/email/Wi-Fi/contact are scanner-side classifications inferred from payload conventions.
- [x] Run verification.

Verification:

- `npm test -- --run src/lib/qr.test.ts` passed.
- `npm test` passed: 6 files, 29 tests.
- `npm run build` passed.
- `npm run e2e` passed: 18 browser tests across desktop Chromium and mobile Pixel 7.
