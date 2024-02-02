import {useContext, useEffect, useMemo, useState} from 'react';
import {AtomStateContext, type Atom} from '../providers/AtomStateProvider';

// Wrap an atom in a hook that returns the current value and a setter.
export function useAtom<T>(atom: Atom<T>): [value: T, setter: (newValue: T) => void] {
  const context = useContext(AtomStateContext);
  if (!context) {
    throw new Error('useAtom must be used within an AtomStateProvider');
  }

  const { subscribe, setAtomValue } = context;
  const [value, setValue] = useState<T>(context.getAtomValue(atom));

  useEffect(() => subscribe(atom, setValue), [atom, subscribe]);

  return useMemo(() => [
    value,
    (newValue: T) => setAtomValue(atom, newValue)
  ], [value]);
};
