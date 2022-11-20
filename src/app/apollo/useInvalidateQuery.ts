import {useQuery} from "@apollo/client";
import { getOperationName } from "@apollo/client/utilities";
import { counter, queries } from "./InvalidateLink";

const useInvalidateQuery: typeof useQuery = (query, options) => {
  // TODO skip on network requests.
  const invalidate = options?.context?.invalidate;
  if (invalidate) {
    let forceRefetch = false;
    const operationName = getOperationName(query);
    for (const key of invalidate) {
      const currentVer = counter.get(key);
      if (currentVer) {
        const hash = `${operationName}:${key}`;
        const ourVer = queries.get(hash) || 0;
        if (ourVer < currentVer) {
          forceRefetch = true;
          queries.set(hash, currentVer);
        }
      }
    }
    if (forceRefetch) {
      return useQuery(query, {
        ...options,
        fetchPolicy: 'network-only'
      });
    }
  }

  return useQuery(query, options);
};

export default useInvalidateQuery;
