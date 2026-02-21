import { useState, useEffect, useRef, useCallback } from 'react';
import { readStateFromHash, writeStateToHash } from '../utils/urlState';
import { BACKUP_KEY } from '../utils/noteUtils';
import type { AppState } from '../types';

const DEBOUNCE_MS = 400;

export function useUrlState() {
  const [state, setStateRaw] = useState<AppState | null>(() => readStateFromHash());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setState = useCallback((next: AppState | null) => {
    setStateRaw(next);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (next) {
      debounceTimer.current = setTimeout(() => {
        writeStateToHash(next);
        try {
          localStorage.setItem(BACKUP_KEY, JSON.stringify(next));
        } catch {
          // storage quota exceeded — silently ignore
        }
      }, DEBOUNCE_MS);
    }
  }, []);

  // Write immediately on first load if state was decoded from hash
  useEffect(() => {
    if (state) {
      writeStateToHash(state);
      try {
        localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
      } catch {
        // ignore
      }
    }
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return [state, setState] as const;
}
