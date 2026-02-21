import type { AppState } from '../types';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateId(length = 8): string {
  let id = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (const byte of array) {
    id += CHARSET[byte % CHARSET.length];
  }
  return id;
}

export function createDefaultState(): AppState {
  const id = generateId();
  return {
    notes: {
      [id]: { title: 'My first note', content: '' },
    },
    current: id,
  };
}

export const BACKUP_KEY = 'linkborn-backup';
