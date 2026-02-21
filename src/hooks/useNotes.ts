import { useCallback } from 'react';
import { generateId } from '../utils/noteUtils';
import type { AppState } from '../types';

type SetState = (next: AppState | null) => void;

export function useNotes(state: AppState, setState: SetState) {
  const addNote = useCallback(() => {
    const id = generateId();
    setState({
      ...state,
      notes: {
        ...state.notes,
        [id]: { title: 'Untitled', content: '' },
      },
      current: id,
    });
  }, [state, setState]);

  const deleteNote = useCallback((id: string) => {
    const remaining = { ...state.notes };
    delete remaining[id];

    const ids = Object.keys(remaining);
    let current = state.current;

    if (current === id) {
      current = ids[0] ?? '';
    }

    if (ids.length === 0) {
      setState(null);
      return;
    }

    setState({ notes: remaining, current });
  }, [state, setState]);

  const updateNote = useCallback((id: string, patch: Partial<{ title: string; content: string }>) => {
    const note = state.notes[id];
    if (!note) return;
    setState({
      ...state,
      notes: {
        ...state.notes,
        [id]: { ...note, ...patch },
      },
    });
  }, [state, setState]);

  const selectNote = useCallback((id: string) => {
    if (state.current === id) return;
    setState({ ...state, current: id });
  }, [state, setState]);

  return { addNote, deleteNote, updateNote, selectNote };
}
