# OverseerProvider

```mermaid
sequenceDiagram
    participant OverseerProvider as OverseerProvider
    participant RequestDataEvent as RequestDataEvent
    participant DebounceLogic as triggerRequests()
    participant TriggerRequestEvent as TriggerRequestEvent
    
    OverseerProvider-->>RequestDataEvent: Listens for
    activate OverseerProvider
    activate RequestDataEvent
    
    RequestDataEvent-->>OverseerProvider: Receives query key
    deactivate RequestDataEvent
    
    OverseerProvider->>OverseerProvider: Checks if data is "STALE"
    
    alt Data is "STALE"
        OverseerProvider->>OverseerProvider: Marks query as "REQUESTED"
        OverseerProvider->>OverseerProvider: Schedules for fetching
        
        OverseerProvider->>DebounceLogic: Passes query key
        activate DebounceLogic
        
        DebounceLogic->>DebounceLogic: Removes duplicate queries
        DebounceLogic->>DebounceLogic: Removes child queries
        
        DebounceLogic-->>TriggerRequestEvent: Emits which query keys to fetch
        
        deactivate DebounceLogic
    else Data is not "STALE"
        OverseerProvider->>OverseerProvider: Does nothing
    end
    
    deactivate OverseerProvider
```

The `OverseerProvider` listens for `RequestDataEvent` receiving a query key. If the data under this key is "STALE" it marks the query as "REQUESTED" and schedules it for fetching.
The fetching is debounced, it removes any duplicate queries or child queries and emits a `TriggerRequestEvent` passing a list of query keys that need to be fetched.
