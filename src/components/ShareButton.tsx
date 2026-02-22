import { useRef, useState } from 'react';
import { compress } from '../utils/compression';
import type { AppState } from '../types';

interface Props {
  state: AppState;
}

export function ShareButton({ state }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canShare = typeof (navigator as { share?: unknown }).share === 'function';

  function buildNoteUrl(s: AppState) {
    const encoded = compress(s);
    return `${window.location.origin}${window.location.pathname}#${encoded}`;
  }

  function handleShare(url: string) {
    setMenuOpen(false);
    if (canShare) {
      navigator.share({ url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        if (copyTimer.current) clearTimeout(copyTimer.current);
        setCopied(true);
        copyTimer.current = setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }

  return (
    <>
      <div className="share-menu">
        <button
          className="btn btn-primary"
          onClick={() => setMenuOpen((o) => !o)}
          title="Share"
        >
          {canShare ? 'Share' : 'Copy Link'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginLeft: '2px' }} aria-hidden="true">
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {menuOpen && (
          <>
            <div className="share-backdrop" onClick={() => setMenuOpen(false)} />
            <div className="share-dropdown">
              <button
                className="share-dropdown-item"
                onClick={() => {
                  const note = state.notes[state.current];
                  handleShare(buildNoteUrl({ notes: { [state.current]: note }, current: state.current }));
                }}
              >
                {canShare ? 'Share' : 'Copy'} note
              </button>
              <button
                className="share-dropdown-item"
                onClick={() => handleShare(window.location.href)}
              >
                {canShare ? 'Share' : 'Copy'} all notes
              </button>
            </div>
          </>
        )}
      </div>
      {copied && <div className="toast">Link copied!</div>}
    </>
  );
}
