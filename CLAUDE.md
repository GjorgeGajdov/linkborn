# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, http://localhost:5173)
npm run build      # Type-check then bundle for production (output: dist/)
npm run preview    # Serve the production build locally
```

There are no test or lint scripts — TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) is the primary code quality gate, enforced during `build`.

## Architecture

Linkborn is a fully client-side note-taking app. All state lives in the URL hash, compressed with LZ-String. No backend, no auth, no database.

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

### Dark mode

Implemented via `[data-theme="dark"]` attribute on `document.documentElement`. All colors are CSS custom properties defined in `:root` and overridden in `[data-theme="dark"]`. Never use hardcoded color values — always add a token.

### Mobile sidebar

On screens `< 640px`, the sidebar is `position: absolute` and overlays the editor. A `sidebar-backdrop` div (semi-transparent dark overlay) is rendered when the sidebar is open; clicking it closes the sidebar. The backdrop starts at `--header-height` to leave the header unaffected.
