import { useState } from 'react';

const STORAGE_KEY = 'linkborn-prefs';

export interface EditorPrefs {
  fontSize: number;
  fontFamily: 'sans' | 'serif' | 'mono';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  spellCheck: boolean;
}

export const EDITOR_DEFAULTS: EditorPrefs = {
  fontSize: 16,
  fontFamily: 'sans',
  lineHeight: 'normal',
  spellCheck: true,
};

export function useEditorPrefs() {
  const [prefs, setPrefsRaw] = useState<EditorPrefs>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return EDITOR_DEFAULTS;
      return { ...EDITOR_DEFAULTS, ...JSON.parse(raw) as Partial<EditorPrefs> };
    } catch {
      return EDITOR_DEFAULTS;
    }
  });

  function setPrefs(patch: Partial<EditorPrefs>) {
    setPrefsRaw((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return { prefs, setPrefs };
}
