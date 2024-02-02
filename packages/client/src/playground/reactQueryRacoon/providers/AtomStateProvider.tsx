import React, {createContext, useRef, useMemo, type ReactNode, type FC} from 'react';

type AtomKey = string;

export interface Atom<T> {
  key: AtomKey;
  value: T;
}

interface AtomStateContextType {
  subscribe: <T>(atom: Atom<T>, callback: (value: T) => void) => () => void;
  getAtomValue: <T>(atom: Atom<T>) => T;
  setAtomValue: <T>(atom: Atom<T>, newValue: T) => void;
}

type CallbackFn<T> = (value: T) => void;

// Init an atom under a given key.
// TODO add a hash to the key to avoid collisions.
export const atom = <T,>(key: AtomKey, value: T): Atom<T> => ({ key, value });

export const AtomStateContext = createContext<AtomStateContextType | null>(null);

// Jotai, but even more primitive.
export const AtomStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const values = useRef<Map<AtomKey, any>>(new Map());
  const subscribers = useRef<Map<AtomKey, Set<CallbackFn<any>>>>(new Map());

  const getAtomValue = <T,>(atom: Atom<T>): T => values.current.get(atom.key);

  const setAtomValue = <T,>(atom: Atom<T>, newValue: T): void => {
    values.current.set(atom.key, newValue);
    for (const callback of subscribers.current.get(atom.key) ?? []) {
      callback(newValue);
    }
  };

  const subscribe = <T,>(atom: Atom<T>, callback: CallbackFn<T>): () => void => {
    const {key} = atom;
    let callbacks = subscribers.current.get(key);
    if (!callbacks) {
      callbacks = new Set();
      subscribers.current.set(key, callbacks);
    }
    callbacks.add(callback);
    callback(getAtomValue(atom));

    return () => callbacks?.delete(callback);
  };

  const value = useMemo(() => ({
    subscribe,
    getAtomValue,
    setAtomValue
  }), [
    subscribe,
    getAtomValue,
    setAtomValue
  ]);

  return (
    <AtomStateContext.Provider value={value}>
      {children}
    </AtomStateContext.Provider>
  );
};
