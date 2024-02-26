import { useEffect, useRef, useCallback, useContext, type MutableRefObject } from "react";
import { OverseerContext } from "../providers/OverseerProvider";
import { useAtom } from "./useAtom";
import { loadingAtom } from "../atoms/loadingAtom";
import { type QueryKey } from "../keys";
import { DataStatus } from "../interfaces";

export const useFetchData = <QK extends QueryKey>({
  isStaleRef,
  providerKey,
  refetch,
  getFragmentFromKey,
}: {
  isStaleRef: MutableRefObject<Record<string, DataStatus>>;
  providerKey: string;
  refetch: () => Promise<any>;
  getFragmentFromKey: (key: QK) => string|null;
}) => {
  const overseer = useContext(OverseerContext);

  const isMounted = useRef(true);

  const [, setIsLoading] = useAtom(loadingAtom);

  // Register the fetch with the overseer.
  const fetchData = useCallback((queryKey: QK) => {
    if (!Object.values(isStaleRef.current).find(status => status === DataStatus.REQUESTED)) {
      return;
    }
    setIsLoading(true);
    overseer.registerFetch(queryKey, providerKey, async () => {
      await refetch().finally(() => {
        if (!isMounted.current) {
          return;
        }
        setIsLoading(false);
      });
    });
  }, [overseer, refetch, setIsLoading]);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  // Simplified callback that marks data as requested and triggers fetch.
  return useCallback((queryKey: QK) => {
    const fragment = getFragmentFromKey(queryKey);
    if (fragment && isStaleRef.current[fragment] === DataStatus.STALE) {
      isStaleRef.current[fragment] = DataStatus.REQUESTED;
      fetchData(queryKey);
    }
  }, [fetchData, getFragmentFromKey]);
};
