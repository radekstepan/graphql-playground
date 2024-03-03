# React Query (Racoon)
> *Racoon is quick and dirty (and I need to namespace all the playgrounds)*

An example "report" page that has an exceptions and an entry component. The entry can be mutated which triggers cache invalidation.

## Patterns

1. A single GQL "getter" query that consists of individual fragments (they can be sub-queries)
2. `ReportDataProvider` for managing all of report data fetching and mutation in a single place
  - A debounce on fetching stale fragments
  - Only fetching stale date that is needed by a component
  - Complete control over fragment caching and cache invalidation
3. Data is consumed and mutated by components via hooks that hide the implementation details
4. Use of refs and subscribers to prevent unnecessary component re-renders
5. Data and global state (atoms) is typed

## Libraries

1. `react-query` for query and cache management
2. `react-graphql` for actual GQL calls
3. `jotai` for state management (homebrew in this example)

## TODO

1. What query interface do we use for shared packages; `await query` or `useQuery`?
1. If we need to `await query`, how can you determine when your query is loading when you are a fragment part of a larger query? Modify the hooks to look like existing `useQuery` hooks
1. Modify the GQL to return individual exceptions exceptions: `[{entryId: 123, text: "Missing receipt!"}]` and each entry row will ask for it like so `getEntryExceptions(reportId, 123)`
1. Modify report next to "Monthly expenses" akin to report header refetches all entries BUT not their receipts (`@include` on receipt)
1. Add a comment to add a utility function to help with marking data as stale

## Learnings

1. If you have multiple `useQuery` hooks with the same key, you can't guarantee in which order they get called and React Query will just call one of the callbacks, rather than both. It makes sense that it would deduplicate these calls, but there's no `useWatchQuery`, so you can only have one `useQuery` unique key combo. This became a problem as I both want to use `useQuery` hooks to read data off a key, and also to "subscribe" when a particular key is invalidated elsewhere in the code. The fix is to use an "internal" key suffix in one of the hooks...
1. `react-query` does not create any references between data in a cache. If you need to store a list of data, a strategy is to create 2 new keys: `byId` and store a list of objects in by their `id` for easy access and `order` to store the actual order of the `ids`.
1. `react-query` does not support passing of new variables into a `refetch` function.

## Other Ideas

1. This (not very popular) library merge GQL queries together into one https://github.com/domasx2/graphql-combine-query - this would help by maintaining separate queries rather than fragments.
