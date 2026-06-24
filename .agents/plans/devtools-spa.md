# Devtools Static SPA Plan

## Product Direction

Build a personal, static, modular developer toolbox hosted on GitHub Pages. The app is optimized for fast local workflows, keyboard search, and tool-specific forms. It is not a public multi-user service and does not share data between users or tools.

## Core Constraints

- Static SPA deployable to GitHub Pages.
- All processing happens client-side.
- Inputs are transient by default.
- No cross-tool shared user data.
- Individual tools may use local storage only for low-risk convenience settings.
- Avoid Monaco/editor-heavy dependencies.
- Use WASM only when a future tool clearly needs it for performance or capability.
- Keep tool modules independent and registry-driven.

## Recommended Stack

- Vite + React + TypeScript for static SPA architecture.
- React Router with hash routing for GitHub Pages reliability.
- Fuse.js or similar small fuzzy-search library for command palette search.
- Tailwind CSS plus a small component library where it clearly saves work.
- Prefer accessible, composable primitives such as Radix UI / shadcn-style components for dialogs, command palette, menus, tabs, switches, and tooltips.
- Use Lucide React for consistent SVG icons.
- Vitest for logic tests.
- Playwright for a small smoke test once UI exists.

Reasoning: Vite produces simple static assets, React fits modular interactive tools, TypeScript keeps tool contracts clear, and hash routing avoids GitHub Pages fallback problems. A component library is acceptable because this is an app shell with many repeated controls; using accessible primitives avoids rebuilding common interactions.

## UX Model

- App-shell layout inspired by developer tools, not a strict DevToys clone:
  - Persistent left navigation grouped by tool category on desktop.
  - Compact top command/search entry on small screens.
  - Main tool workspace with form-first controls.
  - Right-side or inline output panel depending on viewport width.
  - Command palette opened by `Ctrl+K` / `Cmd+K`.
  - Search aliases for tools and common intents.
- Each tool page includes:
  - Tool-specific input controls.
  - Output/result area.
  - Copy action.
  - Clear/reset action.
  - Inline validation/error state.
  - Optional sample input.
- No cross-tool shared clipboard/history/store.
- Visual direction:
  - Dense, quiet, productivity-focused interface.
  - Flat design with restrained color, high contrast, and visible focus states.
  - Avoid landing-page bento/showcase patterns inside the app workspace.
  - Use monospaced text selectively for code/data fields; do not force monospace for every UI label if readability suffers.
- Accessibility baseline:
  - Keyboard navigation for sidebar, command palette, forms, and copy actions.
  - Visible labels on every input.
  - Inline validation close to the affected field.
  - Touch targets at least 44px.
  - Reduced-motion support for transitions.

## V1 Tool Set

- Regex101 launcher/reference
- Base64 encode/decode
- URL encode/decode
- JSON format/validate/minify
- Timestamp converter
- Multi-timezone converter
- UUID generator
- Hash generator
- JWT decoder

## Regex Scope

Do not build a local regex tester in v1. Use regex101 as the primary regex workflow.

- Provide a tool entry named "Regex" or "Regex101".
- Let the user choose flavor/intention where useful, then open regex101 in a new tab.
- Optionally provide quick links to regex101 with common flavors or documentation.
- Do not persist regex patterns or test strings locally.
- Do not introduce RE2, Pyodide, or custom regex WASM until there is a concrete personal workflow regex101 cannot cover.

Reasoning: regex101 already handles the hard parts: explanations, flavor differences, matching, substitutions, and debugging. A local clone would increase bundle and maintenance cost while likely being less correct. For a personal toolbox, the better v1 behavior is fast discovery and handoff to the specialized tool.

## Data Model

Define a tool registry:

```ts
type Tool = {
  id: string;
  title: string;
  category: string;
  description: string;
  aliases: string[];
  route: string;
  component: React.LazyExoticComponent<React.ComponentType>;
};
```

Each tool owns its own state. Shared app state is limited to navigation, command palette visibility, theme, and current route.

Local storage policy:

- Inputs are transient by default.
- Do not persist pasted payloads globally.
- Use local storage only for explicit low-risk convenience settings such as selected theme, last selected regex flavor, preferred timezone list, or collapsed sidebar state.
- Keep storage keys scoped by tool id.
- Do not read another tool's storage from a tool module.

## Acceptance Criteria

- App builds as static assets.
- GitHub Pages deployment path is documented and configured.
- Command palette finds and opens every v1 tool.
- Each v1 tool works fully offline after page load.
- Inputs are not persisted globally.
- No tool can read another tool's local state.
- Local storage, when used, is limited to low-risk per-tool settings.
- Basic tests cover core conversion/parsing logic.
- Smoke test confirms routing and command palette work.
- Regex entry opens or guides the user to regex101 instead of implementing local matching.

## Open Decisions

- Exact component library choice after scaffolding dependency review.
- Whether a future local regex tool is ever needed after using the regex101 handoff in practice.
