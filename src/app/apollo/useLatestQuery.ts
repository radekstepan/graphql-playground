import {useApolloClient, useQuery} from "@apollo/client";
import isLatestLink from "./IsLatestLink";

const CACHE_FIRST = 'cache-first';
const NETWORK_ONLY = 'network-only';

const useLatestQuery: typeof useQuery = (query, options) => {
  const client = useApolloClient();

  const invalidate = options?.context?.invalidate;
  if (invalidate) {
    // TODO nextFetchPolicy?
    const queryPolicy = options.defaultOptions?.fetchPolicy;
    const defaultPolicy = client.defaultOptions?.query?.fetchPolicy
    const policy = CACHE_FIRST || defaultPolicy || queryPolicy;

    if (policy === CACHE_FIRST) {
      let forceRefetch = false;
      const id = isLatestLink.identify(query, options?.variables);
      for (const key of invalidate) {
        const [isLatest, markAsLatest] = isLatestLink.checkIsLatest(id, key);
        if (!isLatest) {
          markAsLatest();
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
