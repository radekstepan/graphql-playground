import {useContext, useEffect, useMemo, useState} from 'react';
import {AtomStateContext, type Atom} from '../providers/AtomStateProvider';

const isFunction = <T>(value: any): value is ((prevValue: T) => T) => typeof value === 'function';

type Setter<T> = (newValue: T | ((prevValue: T) => T)) => void;

// Wrap an atom in a hook that returns the current value and a setter.
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
