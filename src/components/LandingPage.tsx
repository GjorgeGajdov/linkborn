import { useState } from 'react';
import { createDefaultState, BACKUP_KEY } from '../utils/noteUtils';
import { writeStateToHash } from '../utils/urlState';
import type { AppState } from '../types';

interface Props {
  onStart: (state: AppState) => void;
}

export function LandingPage({ onStart }: Props) {
  const [backup] = useState<AppState | null>(() => {
    try {
      const raw = localStorage.getItem(BACKUP_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AppState;
      if (!parsed.notes || typeof parsed.current !== 'string') return null;
      return parsed;
    } catch {
      return null;
    }
  });

  function handleCreate() {
    const state = createDefaultState();
    writeStateToHash(state);
    onStart(state);
  }

  function handleRecover() {
    if (!backup) return;
    writeStateToHash(backup);
    onStart(backup);
  }

  const noteCount = backup ? Object.keys(backup.notes).length : 0;

  return (
    <div className="landing">
      <div className="landing-card">
        <img src="/logo.png" alt="Linkborn logo" className="landing-logo-img" />
        <h1 className="landing-title">Linkborn</h1>
        <p className="landing-tagline">Your notes, born in a link.</p>
        <p className="landing-description">
          Create, edit, and share personal notes stored entirely in a URL —
          no account, no backend, no data stored on any server.
        </p>
        <button className="btn btn-primary btn-large" onClick={handleCreate}>
          Create My Note Directory
        </button>

        <p className="landing-warning">
          ⚠ Your notes live entirely in the URL. If you lose the link, your notes are gone — bookmark it or share it somewhere safe.
        </p>

        <div className="landing-features">
          <div className="feature">State lives in the URL hash</div>
          <div className="feature">Share a note or your full directory</div>
          <div className="feature">No login required</div>
        </div>

        {backup && (
          <div className="landing-recover">
            <p className="landing-recover-text">
              You have a previous session with {noteCount} note{noteCount !== 1 ? 's' : ''}.
            </p>
            <button className="btn btn-secondary" onClick={handleRecover}>
              Recover Last Session
            </button>
          </div>
        )}

        <a
          href="https://github.com/GjorgeGajdov/linkborn"
          target="_blank"
          rel="noopener noreferrer"
          className="landing-github"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  );
}
