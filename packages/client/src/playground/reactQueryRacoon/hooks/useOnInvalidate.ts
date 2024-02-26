import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { INVALIDATE_KEY_PREFIX } from "../constants";
import { type QueryKey } from "../keys";

// Internally marks the data as stale and invalidates the actual query.
export const useOnInvalidate = (key: QueryKey, cb: () => void) => {
  const isMounted = useRef(false);
  const client = useQueryClient();
  
  useQuery({
    // NOTE: React Query deduplicates queries with the same key.
    queryKey: [INVALIDATE_KEY_PREFIX, ...key],
    queryFn: () => {
      // Do not call on initial mount.
      if (!isMounted.current) {
        return null;
      }
      // Mark the data as stale in a provider.
      cb();
      // Invalidate the query so that components using this data
      //  will mark the data as "requested".
      client.invalidateQueries(key);
      return null;
    }
  });

  useEffect(() => {
    isMounted.current = true;
  }, []);
}
