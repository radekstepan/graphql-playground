# useSetQueryData

```mermaid
sequenceDiagram
    participant useSetQueryData as useSetQueryData
    participant setQueryData as setQueryData()
    participant queriesAtom as queriesAtom
    participant ReactQuery as React Query
    participant useQuery as useQuery

    useSetQueryData->>setQueryData: Calls with status, queryKey, and optional value
    activate setQueryData

    setQueryData->>queriesAtom: Updates query status globally

    alt status is "STALE"
        setQueryData->>ReactQuery: Invalidates query with queryKey
        activate ReactQuery

        ReactQuery->>ReactQuery: Clears query data
        ReactQuery-->>useQuery: Triggers queryFn() of subscribed hooks
        deactivate ReactQuery
        activate useQuery
        useQuery->>useQuery: Executes queryFn()
        deactivate useQuery

    else status is "LATEST"
        setQueryData->>ReactQuery: Sets new query value with queryKey
        activate ReactQuery

        ReactQuery-->>useQuery: Triggers data update for subscribed hooks
        deactivate ReactQuery
        activate useQuery
        useQuery->>useQuery: Returns latest data
        deactivate useQuery
    end
    deactivate setQueryData
```

The `useSetQueryData` hook accepts a query status, query key and an optional value.
We use the `queriesAtom` to update the query status globally.
If the query status is "STALE", then we use React Query to invalidate the query. This clears its data and forces any subscribed `useQuery` hooks to trigger their `queryFn()`.
If the query status is "LATEST", then we use React Query to set the new query value. This triggers any subscribed `useQuery` hooks to return their latest data.
