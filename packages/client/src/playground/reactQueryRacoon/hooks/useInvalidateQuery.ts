import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { INVALIDATE_KEY_PREFIX } from "../constants";
import { type QueryKey } from "../keys";

// Mark a key as invalidated.
export const useInvalidateQuery = () => {
  const client = useQueryClient();
  return useCallback((key: QueryKey, exact?: true) => {
    client.invalidateQueries([INVALIDATE_KEY_PREFIX, ...key], { exact });
  }, [client]);
}
