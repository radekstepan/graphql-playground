# 🚧 Apollo React Query Migration

The high level idea is to normalize types/objects in RQ the same way as in Apollo and then tackle leaf queries switching them to RQ proper while their parents are still using Apollo

1. Take in Apollo `typePolicies` to determine how to serialize types. Fallback on `id` just like Apollo does
  - OR wrap around `InMemoryCache` and watch `write` and `evict` actions to update the RQ `QueryCache`
2. Write custom `useQuery`/`useMutation` hooks and use them instead of Apollo's
  - Extend RQ `QueryCache` and use it inside these custom hooks to normalize all types/objects returned from queries
  - Use query name and vars as a root RQ `queryKey`, but allow for it to be overriden
3. Switch leaf queries to use RQ while relying on custom `QueryCache` populated by Apollo still

## Snippets

Apollo watch query on cache write.

```js
cache.watch({
  query: GET_SUM,
  optimistic: false,
  callback(diff) {
    if (diff.complete) {
      console.log(diff.result);
    }
  },
});
```