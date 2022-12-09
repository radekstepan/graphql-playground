# 🚧 Apollo React Query Migration

1. Take in Apollo `typePolicies` to determine how to serialize types. Fallback on `id` just like Apollo does
2. Write custom `useQuery`/`useMutation` hooks and use them instead of Apollo's
  - Extend RQ `QueryCache` and use it inside these custom hooks to normalize all types/objects returned from queries
  - Use query name and vars as a root RQ `queryKey`, but allow for it to be overriden
3. Switch leaf queries to use RQ while relying on custom `QueryCache` populated by Apollo still
