import { type QueryKey } from "./keys";

export const listById = <T, K extends keyof T>(list: T[], idProp: K) => {
  const byId: Record<string, T[]> = {};
  return list.reduce((acc, obj) => {
    const key = String(obj[idProp]);
    if (acc[key] === undefined) {
      acc[key] = [obj];
    } else {
      acc[key].push(obj);
    }
    return acc;
  }, byId);
};

type AnyFunction = (...args: any[]) => any;

export function memoize<T extends AnyFunction>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return function(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  } as T;
};

// Remove child keys from an array of keys.
export function removeChildKeys<T extends QueryKey>(arrays: T[]): T[] {
  const isChild = (possibleParent: T, possibleChild: T): boolean => {
    // A child must be longer than its parent.
    if (possibleParent.key.length >= possibleChild.key.length) {
      return false;
    }
    return possibleParent.key.every((element, index) => element === possibleChild.key[index]);
  };

  return arrays.filter((possibleChild) =>
    !arrays.some((possibleParent) =>
      isChild(possibleParent, possibleChild)
    )
  );
}
