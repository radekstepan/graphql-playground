# graphql-playground

## IsLatestLink & useLatestQuery

### Constraints

1. A query should not skip cache unless explicitly told to do so
  - Example: query *Q* ignores LatestLink before mutation *M* ran
  - Example: query *Q* uses cache, mutation *M* modifies state, query *Q* skips cache
2. A unique query has to be marked as having the latest data
  - Example: query *Q1* uses cache under key *K*, query *Q2* with key *K* skips cache
3. Don't grow the internal map too large
  - Example: orphaned queries that never get cleared
