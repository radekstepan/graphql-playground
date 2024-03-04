import {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {AtomStateContext, type Atom} from '../providers/AtomStateProvider';

const isFunction = <T>(value: any): value is ((prevValue: T) => T) => typeof value === 'function';

type Getter<T> = () => T;
type Setter<T> = (newValue: T | ((prevValue: T) => T)) => void;

// Wrap an atom in a hook that returns the current value and a setter; reactive.
export function useAtom<T>(atom: Atom<T>): [value: T, setter: Setter<T>] {
  const context = useContext(AtomStateContext);
  if (!context) {
    throw new Error('useAtom must be used within an AtomStateProvider');
  }

  const { subscribe, setAtomValue } = context;
  const [value, setValue] = useState(context.getAtomValue(atom));

  useEffect(() => subscribe(atom, setValue), [atom, subscribe]);

  return useMemo(() => [
    value,
    (newValue) => setAtomValue(atom, isFunction<T>(newValue) ? newValue(value) : newValue)
  ], [value]);
};

// Wrap an atom in a hook that returns a getter to get the current value and a setter.
export function useAtomLazy<T>(atom: Atom<T>): [getter: Getter<T>, setter: Setter<T>] {
  const context = useContext(AtomStateContext);
  if (!context) {
    throw new Error('useAtomLazy must be used within an AtomStateProvider');
  }

  const { subscribe, setAtomValue } = context;
  const valueRef = useRef(context.getAtomValue(atom));

  useEffect(() => subscribe(atom, (value) =>
    valueRef.current = value
  ), [atom, subscribe]);

  return useMemo(() => [
    () => valueRef.current,
    (newValue) => setAtomValue(atom, isFunction<T>(newValue) ? newValue(valueRef.current) : newValue)
  ], []);
};

// Wrap an atom in a hook that returns just the setter.
export function useAtomSetter<T>(atom: Atom<T>): Setter<T> {
  const context = useContext(AtomStateContext);
  if (!context) {
    throw new Error('useAtomSetter must be used within an AtomStateProvider');
  }

  const { subscribe, setAtomValue } = context;
  const valueRef = useRef(context.getAtomValue(atom));

  useEffect(() => subscribe(atom, (value) =>
    valueRef.current = value
  ), [atom, subscribe]);

  return useCallback((newValue) =>
    setAtomValue(atom, isFunction<T>(newValue) ? newValue(valueRef.current) : newValue)
  , []);
};
