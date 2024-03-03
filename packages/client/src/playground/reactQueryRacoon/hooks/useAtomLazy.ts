import {useContext, useEffect, useMemo, useRef} from 'react';
import {AtomStateContext, type Atom} from '../providers/AtomStateProvider';

const isFunction = <T>(value: any): value is ((prevValue: T) => T) => typeof value === 'function';

type Getter<T> = () => T;
type Setter<T> = (newValue: T | ((prevValue: T) => T)) => void;

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
