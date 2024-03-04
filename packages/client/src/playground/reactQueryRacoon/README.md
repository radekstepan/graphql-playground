# React Query (Racoon)
> *Racoon is quick and dirty (and I need to namespace all the playgrounds)*

An example "report" page that has an exceptions and an entry component. The entry can be mutated which triggers cache invalidation.

## Patterns

1. A single GQL "getter" query that consists of individual fragments (they can be sub-queries)
2. `ReportQueryProvider` for managing all of report data fetching in a single place
  - Only fetching stale date that is needed by a component
  - Complete control over fragment caching and cache invalidation
3. `OverseerProvider` for debouncing and deduplicating requests
4. Data is consumed and mutated by components via hooks that hide the implementation details
5. Use of refs and (event) subscribers to prevent unnecessary component re-renders
6. Data and global state (atoms) is typed

## Libraries

1. `react-query` for query and cache management
2. `react-graphql` for actual GQL calls
3. `jotai` for state management (homebrew in this example)

## Learnings

### Good

1. Libraries like `jotai` are useful for global state management and reducing component re-renders
1. Typed gql files, `TypedGraphqlNode`, is likewise useful and adds an extra level of type checking

### Bad

1. Complete control = completely complex
1. `react-query`
  - If you have multiple `useQuery` hooks with the same key, you can't guarantee in which order they get called and React Query will just call one of the callbacks, rather than both. It makes sense that it would deduplicate these calls, but there's no `useWatchQuery`, so you can only have one `useQuery` unique key combo. This became a problem as I both want to use `useQuery` hooks to read data off a key, and also to "subscribe" when a particular key is invalidated elsewhere in the code.
  - `react-query` does not create any references between data in a cache. If you need to store a list of data, a strategy is to create 2 new keys: `byId` and store a list of objects by their `id` for easy access and `order` to store the actual order of the `ids`.
  - `react-query` does not support passing of variables into a `refetch` function.
  - `react-query` removes even more [util functions](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5#callbacks-on-usequery-and-queryobserver-have-been-removed) in v5

## Other Ideas

1. [graphql-combine-query](https://github.com/domasx2/graphql-combine-query) - this (not very popular) library merge GQL queries together into one; this would help by maintaining separate queries rather than fragments.
1. [normy](https://github.com/klis87/normy) - another (low interest) library for data normalization with utils for popular data fetching libraries like React Query.
