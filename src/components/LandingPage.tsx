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
          <div className="feature">Share by copying the link</div>
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

      </div>
    </div>
  );
}
