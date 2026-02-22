import { useState } from 'react';
import { NoteList } from './NoteList';
import { NoteEditor } from './NoteEditor';
import { ShareButton } from './ShareButton';
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
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 640);

  function closeSidebarOnMobile() {
    if (window.innerWidth < 640) setSidebarOpen(false);
  }

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
        <ShareButton state={state} />
      </header>

      <div className={`app-body${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
        {sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}
        <NoteList
          state={state}
          onAdd={() => { addNote(); closeSidebarOnMobile(); }}
          onDelete={deleteNote}
          onSelect={(id) => { selectNote(id); closeSidebarOnMobile(); }}
        />
        <NoteEditor state={state} onUpdate={updateNote} />
      </div>
    </div>
  );
}
