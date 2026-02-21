<p align="center">
  <img src="public/logo.png" alt="Linkborn" width="96" />
</p>

<h1 align="center">Linkborn</h1>

<p align="center"><em>Your notes, born in a link.</em></p>

Linkborn is a fully client-side note-taking app where your notes live entirely in the URL. No accounts, no servers, no databases — just a link you can bookmark and share.

## How it works

When you create a note directory, the entire state (all your notes and their content) is compressed and encoded into the URL hash (`#...`). Sharing the URL shares your notes. Losing the URL means losing your notes.

- **No backend** — everything runs in the browser
- **No login** — open the link, start writing
- **Shareable** — copy the URL to share your note directory with anyone
- **Persistent** — your last session is backed up in `localStorage` so you can recover it if you navigate away

## Tech stack

- [React 19](https://react.dev/) — UI
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Vite](https://vite.dev/) — build tool
- [lz-string](https://github.com/pieroxy/lz-string) — URL compression

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is in the `dist/` folder. Deploy it to any static host (Vercel, Netlify, GitHub Pages, etc.).

### Preview the production build

```bash
npm run preview
```

## Project structure

```
src/
├── components/
│   ├── AppLayout.tsx       # Main app shell (header + sidebar + editor)
│   ├── NoteList.tsx        # Sidebar note list
│   ├── NoteEditor.tsx      # Note title + content editor
│   ├── LandingPage.tsx     # Welcome / entry screen
│   └── ConfirmModal.tsx    # Delete confirmation dialog
├── hooks/
│   ├── useNotes.ts         # Note CRUD logic
│   ├── useUrlState.ts      # URL hash state persistence
│   └── useTheme.ts         # Dark / light mode toggle
├── utils/
│   ├── urlState.ts         # Encode / decode state to/from URL
│   └── noteUtils.ts        # ID generation, default state
├── styles/
│   └── index.css           # Design tokens + all styles
└── types.ts                # Shared TypeScript types
```

## Features

- Create, edit, and delete notes
- All notes stored in a single shareable URL
- Dark mode (persisted in `localStorage`)
- Delete confirmation modal
- Session recovery from `localStorage` backup
- Responsive — works on mobile

## Important

**Your notes only exist as long as you have the URL.** Bookmark it, email it to yourself, or use the **Share** button to copy it after every session.

## A note on the code

> 90% of this app was vibecoded — built from idea to deployment with AI assistance.
