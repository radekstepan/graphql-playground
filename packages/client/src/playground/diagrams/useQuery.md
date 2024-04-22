# useQuery

```mermaid
sequenceDiagram
    participant useQuery as useQuery
    participant ReactQueryCache as React Query Cache
    participant queryFn as queryFn()
    participant RequestDataEvent as RequestDataEvent
    participant OverseerProvider as OverseerProvider
    
    activate useQuery
    useQuery->>ReactQueryCache: Retrieves data
    activate ReactQueryCache
    
    ReactQueryCache->>useQuery: Data not found
    deactivate ReactQueryCache
    
    useQuery->>queryFn: Executes
    deactivate useQuery
    activate queryFn
    
    queryFn-->>RequestDataEvent: Emits
    deactivate queryFn
    
    RequestDataEvent-->>OverseerProvider: Observed by
    activate OverseerProvider
    
    OverseerProvider->>OverseerProvider: Marks query key as "REQUESTED"
    OverseerProvider->>OverseerProvider: Schedules for fetching
    
    deactivate OverseerProvider
```

The `useQuery` hook retrieves data from the React Query cache under a given key. If the data is not in the cache, the `queryFn` function gets executed.
This function emits a `RequestDataEvent` which is observed by the `OverseerProvider`.
This provider then marks the query key as "REQUESTED" and schedules it for fetching.
