import React, { createContext, useCallback, useRef, useMemo, type FC, type ReactNode } from "react";
import debounce from "debounce";
import { type QueryKey } from "../keys";

export interface OverseerValue {
  registerFetch: (key: QueryKey, providerKey: string, fetchFunction: () => Promise<any>) => void;
}

const defaultValue: OverseerValue = {
  registerFetch: () => {
    throw new Error('Must be used within an OverseerProvider');
  },
};

export const OverseerContext = createContext<OverseerValue>(defaultValue);

const removeDuplicatesAndChildKeys = (keys: QueryKey[]) => {
  const uniqueKeys = new Set(keys.map(key => {
    const string = JSON.stringify(key);
    return string.substring(1, string.length - 1);
  }));

  for (const key of uniqueKeys) {
    for (const otherKey of uniqueKeys) {
      if (key !== otherKey && otherKey.startsWith(key)) {
        uniqueKeys.delete(otherKey);
      }
    }
  }

  return keys.filter(key => {
    const string = JSON.stringify(key);
    return uniqueKeys.has(string.substring(1, string.length - 1));
  });
};

export const OverseerProvider: FC<{children: ReactNode}> = ({ children }) => {
  const fetchQueueRef = useRef<Map<QueryKey, [providerKey: string, fetchFunction: () => Promise<any>]>>(new Map());

  const triggerFetches = useCallback(() => {
    // Filter out child keys if their parent is also in the queue
    const uniqueKeys = removeDuplicatesAndChildKeys(Array.from(fetchQueueRef.current.keys()));

    // May have duplicate fetch functions.
    const functions = new Map<string, () => Promise<any>>();
    for (const key of uniqueKeys) {
      const fetchRef = fetchQueueRef.current.get(key);
      if (fetchRef) {
        const [providerKey, fetchFunction] = fetchRef;
        functions.set(providerKey, fetchFunction);
      }
    }
    for (const [, fetchFunction] of functions) {
      fetchFunction();
    }

    fetchQueueRef.current.clear();
  }, []);

  const registerFetch = useCallback((
    key: QueryKey,
    providerKey: string,
    fetchFunction: () => Promise<any>
  ) => {
    fetchQueueRef.current.set(key, [providerKey, fetchFunction]);
    // Debounce triggering of fetches
    debounce(triggerFetches, 200)();
  }, [triggerFetches]);

  const value = useMemo(() => ({
    registerFetch,
  }), [registerFetch]);

  return (
    <OverseerContext.Provider value={value}>
      {children}
    </OverseerContext.Provider>
  );
};
