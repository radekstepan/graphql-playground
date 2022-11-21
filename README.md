# graphql-playground

GraphQL client query caching and invalidation playground

![](example.gif)

## Apollo Client

- allows for direct cache manipulation (limited API)
- `refetchQueries` only works on watched queries (= queries in rendered components)

## Apollo Client with IsLatestLink & useLatestQuery

### Constraints

1. A query should not skip cache unless explicitly told to do so
  - Example: query *Q* ignores LatestLink before mutation *M* ran
  - Example: query *Q* uses cache, mutation *M* modifies state, query *Q* skips cache
2. A unique query has to be marked as having the latest data
  - Example: query *Q1* uses cache under key *K*, query *Q2* with key *K* skips cache
3. Don't grow the internal map too large
  - Example: orphaned queries that never get cleared

## [TanStack](https://tanstack.com/query)

- can pass [`invalidateQueries`](https://tanstack.com/query/v4/docs/guides/query-invalidation) which can invalidate a query that starts with a key (without immediately re-excuting it unless it's being currently rendered by useQuery)
	- the key prefixes/matchers are [powerful](https://tanstack.com/query/v4/docs/guides/filters#query-filters)
- supports time-based [cache expiry](https://tanstack.com/query/v4/docs/guides/caching) meaning it could replace our `useTtlQuery`
- does NOT come with a data fetching library out of the box (= backend agnostic)
