import { compress, decompress } from './compression';
import type { AppState } from '../types';

export function readStateFromHash(): AppState | null {
  // Some apps (Viber, WhatsApp) encode '#' as '%23', turning the hash into a path.
  // Detect this, fix the URL, and read state from the encoded path segment.
  const path = window.location.pathname;
  if (path.startsWith('/%23')) {
    const encoded = path.slice(4);
    history.replaceState(null, '', `/#${encoded}`);
    return decompress(encoded);
  }

  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  return decompress(hash);
}

export function writeStateToHash(state: AppState): void {
  const encoded = compress(state);
  history.replaceState(null, '', `#${encoded}`);
}

export function clearHash(): void {
  history.replaceState(null, '', window.location.pathname);
}
