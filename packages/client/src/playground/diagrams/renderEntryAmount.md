# Render entry amount

```mermaid
sequenceDiagram
    participant Entry as Entry Component
    participant useEntryAmountQuery as useEntryAmountQuery
    participant useQuery as useQuery
    participant ReactQuery as React Query Cache
    
    activate Entry
    Entry->>useEntryAmountQuery: Uses
    activate useEntryAmountQuery
    
    useEntryAmountQuery->>useQuery: Passes entry amount key
    activate useQuery
    
    useQuery->>ReactQuery: Retrieves data
    activate ReactQuery
    
    ReactQuery->>useQuery: Returns data
    deactivate ReactQuery
    
    useQuery->>useEntryAmountQuery: Returns data
    deactivate useQuery
    
    useEntryAmountQuery->>Entry: Returns entry amount
    deactivate useEntryAmountQuery
    deactivate Entry
```

`Entry` component uses the `useEntryAmountQuery` hook to read the entry amount. This hook uses `useQuery` hook passing in the entry amount key. `useQuery` uses React Query behind the scenes to return the data under this key stored in the cache.
