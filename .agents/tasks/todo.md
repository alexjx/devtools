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
