import { useRef, useState } from 'react';
import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { useNotes } from '../hooks/useNotes';
import { useTheme } from '../hooks/useTheme';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  setState: (next: AppState | null) => void;
}

export function AppLayout({ state, setState }: Props) {
  const { addNote, deleteNote, updateNote, selectNote } = useNotes(state, setState);
  const { dark, toggle: toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <div className="app-layout">
      <header className="app-header">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          &#9776;
        </button>
        <button className="app-header-home" onClick={() => setState(null)} title="Go to home">
          <img src="/logo.png" alt="Linkborn" className="app-header-logo" />
          <span className="app-header-title">Linkborn</span>
        </button>
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '☀' : '☾'}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href).then(() => {
              if (copyTimer.current) clearTimeout(copyTimer.current);
              setCopied(true);
              copyTimer.current = setTimeout(() => setCopied(false), 2000);
            }).catch(() => {});
          }}
          title="Copy link to share"
        >
          Copy Link
        </button>
      </header>
      {copied && <div className="toast">Link copied!</div>}

      <div className={`app-body${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}
        <NoteList
          state={state}
          onAdd={addNote}
          onDelete={deleteNote}
          onSelect={(id) => {
            selectNote(id);
            // On mobile, close sidebar after selecting
            if (window.innerWidth < 640) setSidebarOpen(false);
          }}
        />
        <NoteEditor state={state} onUpdate={updateNote} />
      </div>
    </div>
  );
}
