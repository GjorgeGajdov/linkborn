import { useEffect, useRef } from 'react';
import type { AppState } from '../types';

interface Props {
  state: AppState;
  onUpdate: (id: string, patch: Partial<{ title: string; content: string }>) => void;
}

export function NoteEditor({ state, onUpdate }: Props) {
  const note = state.notes[state.current];
  const titleRef = useRef<HTMLInputElement>(null);

  // Focus title when switching to a new note
  useEffect(() => {
    titleRef.current?.focus();
  }, [state.current]);

  if (!note) {
    return (
      <main className="editor editor--empty">
        <p>Select a note or create a new one.</p>
      </main>
    );
  }

  return (
    <main className="editor">
      <div className="editor-header">
        <input
          ref={titleRef}
          className="editor-title"
          type="text"
          placeholder="Note title"
          value={note.title}
          onChange={(e) => onUpdate(state.current, { title: e.target.value })}
        />
      </div>
      <textarea
        className="editor-content"
        placeholder="Start writing..."
        value={note.content}
        onChange={(e) => onUpdate(state.current, { content: e.target.value })}
      />
      <div className="editor-footer">
        <span className="editor-chars">
          {note.content.length.toLocaleString()} chars
        </span>
      </div>
    </main>
  );
}
