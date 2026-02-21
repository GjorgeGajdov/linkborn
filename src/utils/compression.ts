import LZString from 'lz-string';
import type { AppState } from '../types';

export function compress(state: AppState): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(state));
}

export function decompress(encoded: string): AppState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json) as AppState;
    if (!parsed.notes || typeof parsed.current !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}
