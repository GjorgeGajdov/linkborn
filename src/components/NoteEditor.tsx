import { useEffect, useRef, useState } from 'react';
import { EditorPrefsPanel } from './EditorPrefsPanel';
import type { AppState } from '../types';
import type { EditorPrefs } from '../hooks/useEditorPrefs';

const FONT_MAP: Record<EditorPrefs['fontFamily'], string> = {
  sans: 'var(--font-sans)',
  serif: 'Georgia, serif',
  mono: 'Consolas, "Cascadia Code", monospace',
};

const LINE_HEIGHT_MAP: Record<EditorPrefs['lineHeight'], string> = {
  compact: '1.4',
  normal: '1.7',
  relaxed: '2.1',
};

interface Props {
  state: AppState;
  onUpdate: (id: string, patch: Partial<{ title: string; content: string }>) => void;
  prefs: EditorPrefs;
  onPrefsChange: (patch: Partial<EditorPrefs>) => void;
}

export function NoteEditor({ state, onUpdate, prefs, onPrefsChange }: Props) {
  const note = state.notes[state.current];
  const titleRef = useRef<HTMLInputElement>(null);
  const [prefsOpen, setPrefsOpen] = useState(false);

  // Focus title when switching to a new note (desktop only — avoids keyboard pop-up on mobile)
  useEffect(() => {
    if (window.innerWidth >= 640) titleRef.current?.focus();
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
      <div className="prefs-accordion">
        <div className="prefs-toolbar">
          <button
            className={`prefs-toggle${prefsOpen ? ' prefs-toggle--active' : ''}`}
            onClick={() => setPrefsOpen((o) => !o)}
            title="Editor preferences"
            aria-label="Editor preferences"
          >
            Aa
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={`prefs-chevron${prefsOpen ? ' prefs-chevron--open' : ''}`} aria-hidden="true">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={`prefs-spellcheck-btn${prefs.spellCheck ? ' prefs-spellcheck-btn--active' : ''}`}
            onClick={() => onPrefsChange({ spellCheck: !prefs.spellCheck })}
            title={prefs.spellCheck ? 'Spell check on' : 'Spell check off'}
            aria-label={prefs.spellCheck ? 'Disable spell check' : 'Enable spell check'}
          >
            ABC
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle' }} aria-hidden="true">
              {prefs.spellCheck
                ? <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              }
            </svg>
          </button>
        </div>
        <div className={`prefs-panel-wrapper${prefsOpen ? ' prefs-panel-wrapper--open' : ''}`}>
          <div className="prefs-panel">
            <EditorPrefsPanel prefs={prefs} onChange={onPrefsChange} />
          </div>
        </div>
      </div>
      <textarea
        className="editor-content"
        placeholder="Start writing..."
        value={note.content}
        onChange={(e) => onUpdate(state.current, { content: e.target.value })}
        onFocus={() => { if (window.innerWidth < 640) setPrefsOpen(false); }}
        spellCheck={prefs.spellCheck}
        style={{
          fontSize: `${prefs.fontSize}px`,
          fontFamily: FONT_MAP[prefs.fontFamily],
          lineHeight: LINE_HEIGHT_MAP[prefs.lineHeight],
        }}
      />
      <div className="editor-footer">
        <span className="editor-chars">
          {note.content.length.toLocaleString()} chars
        </span>
        <div className="editor-footer-actions">
          <a
            href="https://github.com/GjorgeGajdov/linkborn"
            target="_blank"
            rel="noopener noreferrer"
            className="editor-github"
            title="View on GitHub"
            aria-label="View on GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
