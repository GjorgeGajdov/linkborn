# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, http://localhost:5173)
npm run build      # Type-check then bundle for production (output: dist/)
npm run preview    # Serve the production build locally
```

There are no test, lint, or format scripts. TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) is the primary code quality gate, enforced during `build`. Do not attempt to run `eslint`, `prettier`, or `biome` — they are not installed.

## Architecture

Linkborn is a fully client-side note-taking app. All state lives in the URL hash, compressed with LZ-String. No backend, no auth, no database.

### Folder structure

```
src/
├── components/     # React components (one per file)
├── hooks/          # Custom React hooks
├── utils/          # Pure functions (no React)
├── styles/
│   └── index.css   # All styles, single file
└── types.ts        # Shared TypeScript types
```

### State flow

1. On load, `useUrlState` reads the URL hash → decompresses → returns `AppState | null`
2. `null` renders `LandingPage`; a valid state renders `AppLayout`
3. All note mutations go through `useNotes`, which produces a new `AppState` and calls `setState`
4. `useUrlState` debounces writes to the hash (400ms) and simultaneously writes a backup to `localStorage`
5. `LandingPage` offers recovery from localStorage if no hash is present

### Key types

```ts
AppState = { notes: Record<string, Note>; current: string }
Note     = { title: string; content: string }
```

### Key files

| File | Role |
|------|------|
| `src/hooks/useUrlState.ts` | Core: hash ↔ state sync with localStorage backup |
| `src/hooks/useNotes.ts` | CRUD for notes; calls `setState(null)` when last note is deleted |
| `src/utils/urlState.ts` | `readStateFromHash` / `writeStateToHash` |
| `src/utils/compression.ts` | LZ-String compress/decompress wrappers |
| `src/styles/index.css` | All styles — uses CSS custom properties for theming |

### Navigating to the landing page

Calling `setState(null)` from anywhere returns the user to `LandingPage`. This is used by the home button in the header and by `useNotes` when the last note is deleted.

### Styling conventions

All styles live in `src/styles/index.css` — no CSS modules or styled-components. Class names follow a BEM-ish pattern (`block`, `block-element`, `block--modifier`). Add new component styles at the bottom of the relevant section, grouped by component.

### URL size constraint

State is compressed but still URL-bound. Very large note content can exceed browser URL limits (~2000 chars in some environments before compression, more in practice). Avoid features that would dramatically increase state size without also improving compression.

### Dark mode

Implemented via `[data-theme="dark"]` attribute on `document.documentElement`. All colors are CSS custom properties defined in `:root` and overridden in `[data-theme="dark"]`. Never use hardcoded color values — always add a token.

### Keeping docs in sync

After any significant change (new feature, new component, new pattern, behavior change), update:
- **CLAUDE.md** — add or revise the relevant section so future Claude instances have accurate context
- **README.md** — update the Features list, Important note, or How it works section if user-facing behavior changed

Skip doc updates for small fixes, style tweaks, or refactors that don't change behavior.

### Mobile sidebar

On screens `< 640px`, the sidebar is `position: absolute` and overlays the editor. A `sidebar-backdrop` div (semi-transparent dark overlay) is rendered when the sidebar is open; clicking it closes the sidebar. The backdrop starts at `--header-height` to leave the header unaffected.
