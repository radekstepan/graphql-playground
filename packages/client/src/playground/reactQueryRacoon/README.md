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

1. Structural sharing to merge old and new data?
1. A separate `EntryProvider`, does it live in the dom for each separate entry?
1. What query interface do we use for shared packages; `await query` or `useQuery`?
1. If we need to `await query`, how can you determine when your query is loading when you are a fragment part of a larger query? Modify the hooks to look like existing `useQuery` hooks
1. Modify the GQL to return individual exceptions exceptions: `[{entryId: 123, text: "Missing receipt!"}]` and each entry row will ask for it like so `getEntryExceptions(reportId, 123)`
1. When you attach/detach receipt or update the entry amount, refetch just the entry and not all expenses
1. Have 2 expenses, start at $1; have GetExpense have an actually useful key that writes to a cache directly
1. Modify report next to "Monthly expenses" akin to report header refetches all entries BUT not their receipts (`@include` on receipt)
1. Add a comment to add a utility function to help with marking data as stale
1. Nest the expenses key better to illustrate they won't be reset when the "parent" resets
1. Does `react-query` do cache by ref when we have both `expenses` and `expense` cached?
