import { useState } from 'react';
import type { AppState } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  state: AppState;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export function NoteList({ state, onAdd, onDelete, onSelect }: Props) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const noteIds = Object.keys(state.notes);

  const pendingNote = pendingDelete ? state.notes[pendingDelete] : null;

  return (
    <>
    {pendingDelete && (
      <ConfirmModal
        title="Delete note"
        message={`"${pendingNote?.title?.trim() || 'Untitled'}" will be permanently deleted.`}
        onConfirm={() => { onDelete(pendingDelete); setPendingDelete(null); }}
        onCancel={() => setPendingDelete(null)}
      />
    )}
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Notes</span>
        <button
          className="btn-icon"
          onClick={onAdd}
          title="New note"
          aria-label="Add new note"
        >
          +
        </button>
      </div>

      <ul className="note-list" role="listbox" aria-label="Notes">
        {noteIds.map((id) => {
          const note = state.notes[id];
          const isActive = id === state.current;
          return (
            <li
              key={id}
              className={`note-item${isActive ? ' note-item--active' : ''}`}
              role="option"
              aria-selected={isActive}
            >
              <button
                className="note-item-btn"
                onClick={() => onSelect(id)}
              >
                <span className="note-item-title">
                  {note?.title?.trim() || 'Untitled'}
                </span>
              </button>
              <button
                className="note-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDelete(id);
                }}
                title="Delete note"
                aria-label={`Delete ${note?.title || 'Untitled'}`}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <span className="sidebar-count">
          {noteIds.length} note{noteIds.length !== 1 ? 's' : ''}
        </span>
      </div>
    </aside>
    </>
  );
}
