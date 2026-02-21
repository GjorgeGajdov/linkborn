import { compress, decompress } from './compression';
import type { AppState } from '../types';

export function readStateFromHash(): AppState | null {
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
