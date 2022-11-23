import {useApolloClient, useQuery} from "@apollo/client";
import isLatestLink from "./IsLatestLink";

const CACHE_FIRST = 'cache-first';
const NETWORK_ONLY = 'network-only';

const useLatestQuery: typeof useQuery = (query, options) => {
  const client = useApolloClient();

  const invalidate = options?.context?.invalidate;
  if (invalidate && isLatestLink.isInUse) {
    // TODO nextFetchPolicy?
    const queryPolicy = options.defaultOptions?.fetchPolicy;
    const defaultPolicy = client.defaultOptions?.query?.fetchPolicy
    const policy = CACHE_FIRST || defaultPolicy || queryPolicy;

    if (policy === CACHE_FIRST) {
      let forceRefetch = false;
      const queryId = isLatestLink.identify(query, options?.variables);
      for (const cacheKey of invalidate) {
        if (!isLatestLink.isLatest(queryId, cacheKey)) {
          // TODO we should mark as latest when data arrive.
          // TODO extend the context and handle in Link like mutation
          isLatestLink.setLatest(queryId, cacheKey);
          forceRefetch = true;
        }
      }
      if (forceRefetch) {
        return useQuery(query, {
          ...options,
          fetchPolicy: NETWORK_ONLY
        });
      }
    }
  }

  return useQuery(query, options);
};

export default useLatestQuery;
