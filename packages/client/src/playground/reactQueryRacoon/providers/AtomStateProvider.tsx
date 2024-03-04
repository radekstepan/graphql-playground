import React, {createContext, useRef, useMemo, type ReactNode, type FC} from 'react';

type AtomKey = string;

type SetterFn<T> = (prevValue: T, nextValue: T) => T;

export interface Atom<T> {
  key: AtomKey;
  value: T;
  setter?: SetterFn<T>;
}

interface AtomStateContextType {
  subscribe: <T>(atom: Atom<T>, callback: (value: T) => void) => UnsubscribeFn;
  getAtomValue: <T>(atom: Atom<T>) => T;
  setAtomValue: <T>(atom: Atom<T>, newValue: T) => void;
}

type CallbackFn<T> = (value: T) => void;
type UnsubscribeFn = () => void;

// Init an atom.
export const atom = <T,>(value: T, options?: {setter: SetterFn<T>}): Atom<T> => ({
  key: crypto.randomUUID(), // avoid collisions
  value,
  ...options?.setter && {setter: options.setter}
});

export const AtomStateContext = createContext<AtomStateContextType | null>(null);

// Jotai, but even more primitive.
export const AtomStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const values = useRef<Map<AtomKey, any>>(new Map());
  const subscribers = useRef<Map<AtomKey, Set<CallbackFn<any>>>>(new Map());

  const getAtomValue = <T,>(atom: Atom<T>): T => values.current.has(atom.key) ? values.current.get(atom.key).value : atom.value;

  const setAtomValue = <T,>(atom: Atom<T>, newValue: T): void => {
    const currentAtom = values.current.get(atom.key);
    const updatedValue = currentAtom?.setter ? currentAtom.setter(currentAtom.value, newValue) : newValue;
    values.current.set(atom.key, { ...currentAtom, value: updatedValue });
    for (const callback of subscribers.current.get(atom.key) ?? []) {
      callback(updatedValue);
    }
  };

  const subscribe = <T,>(atom: Atom<T>, callback: CallbackFn<T>): UnsubscribeFn => {
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
