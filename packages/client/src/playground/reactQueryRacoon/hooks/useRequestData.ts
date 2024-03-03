import { useEffect, useRef, useCallback, useContext, type MutableRefObject } from "react";
import { OverseerContext } from "../providers/OverseerProvider";
import { useAtom } from "./useAtom";
import { loadingAtom } from "../atoms/loadingAtom";
import { type QueryKey } from "../keys";
import { DataStatus } from "../interfaces";

export const useRequestData = <QK extends QueryKey>({
  isStaleRef,
  providerKey,
  refetch,
  getFragmentFromKey,
}: {
  isStaleRef: MutableRefObject<Record<string, DataStatus>>;
  providerKey: string;
  refetch: (queryKeys: QK[]) => Promise<any>;
  getFragmentFromKey: (key: QK) => string|null;
}) => {
  const overseer = useContext(OverseerContext);
  const isMounted = useRef(true);
  const [, setIsLoading] = useAtom(loadingAtom);

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  // Fetch data.
  return useCallback((queryKey: QK) => {
    // Get the fragment and check that it's been marked as stale.
    const fragment = getFragmentFromKey(queryKey);
    if (!fragment || isStaleRef.current[fragment] !== DataStatus.STALE) {
      return;
    }
    overseer.registerFetch(queryKey, providerKey, async (queryKeys: any[] | null) => { // TODO
      if (!queryKeys) {
        return;
      }
      setIsLoading(true);
      await refetch(queryKeys).finally(() => {
        if (!isMounted.current) {
          return;
        }
        setIsLoading(false);
      });
    });
  }, [overseer, refetch, setIsLoading]);
};
