import { useState, useEffect } from 'react';

const STORAGE_KEY = 'linkborn-theme';

export function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}
