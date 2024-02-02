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
