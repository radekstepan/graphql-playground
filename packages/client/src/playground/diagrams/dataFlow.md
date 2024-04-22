## Data Flow

```mermaid
graph TD
  N[Component] --> O[useQuery]
  O --> P[React Query Cache]
  P --> Q{Data in Cache?}
  Q -->|No| R[Execute queryFn]
  R --> S[Emit RequestDataEvent]
  S --> T[OverseerProvider]
  T --> U[Mark Query as Requested]
  T --> V[Schedule Fetching]
  Q -->|Yes| W[Return Data]
```

The `useQuery` hook always only returns data from the cache under a query key. If the data is "STALE", the `queryFn()` function is used to emit a `RequestDataEvent` that `OverseerProvider` subscribes to, scheduling a fetch.
