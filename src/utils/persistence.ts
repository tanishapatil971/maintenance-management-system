import { useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';
const PERSISTENCE_EVENT = 'maintenance-persistence-change';

export const loadStoredState = <T>(storageKey: string, fallbackValue: T): T => {
  if (!isBrowser) {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue) as T;
  } catch {
    return fallbackValue;
  }
};

export const saveStoredState = <T>(storageKey: string, value: T) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(PERSISTENCE_EVENT, { detail: { key: storageKey, value } }));
};

export const usePersistentState = <T>(storageKey: string, initialValue: T | (() => T)) => {
  const [state, setState] = useState<T>(() => {
    const fallbackValue = typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    return loadStoredState(storageKey, fallbackValue);
  });

  useEffect(() => {
    saveStoredState(storageKey, state);
  }, [state, storageKey]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string; value: T }>;
      if (customEvent.detail?.key === storageKey) {
        setState(customEvent.detail.value);
      }
    };

    window.addEventListener(PERSISTENCE_EVENT, handleStorageChange as EventListener);
    return () => window.removeEventListener(PERSISTENCE_EVENT, handleStorageChange as EventListener);
  }, [storageKey]);

  return [state, setState] as const;
};
