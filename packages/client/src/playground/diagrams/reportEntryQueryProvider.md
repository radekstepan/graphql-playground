# ReportEntryQueryProvider

```mermaid
sequenceDiagram
    participant ReportEntryQueryProvider as ReportEntryQueryProvider
    participant TriggerRequestEvent as TriggerRequestEvent
    participant includeFragmentsRef as includeFragmentsRef
    participant useQuery as useQuery Hook
    participant queryFn as queryFn()
    participant gqlClient as GraphQL
    participant onSuccess as onSuccess()
    participant useSetQueryData as useSetQueryData

    ReportEntryQueryProvider-->>TriggerRequestEvent: Listens for event
    activate ReportEntryQueryProvider
    activate TriggerRequestEvent

    TriggerRequestEvent-->>ReportEntryQueryProvider: Receives a list of query keys to fetch
    deactivate TriggerRequestEvent

    ReportEntryQueryProvider->>includeFragmentsRef: Converts query keys to fragments

    ReportEntryQueryProvider->>useQuery: Refetches the query
    activate useQuery

    useQuery->>queryFn: Calls queryFn
    activate queryFn

    queryFn->>gqlClient: Sends GraphQL request with @include statements
    activate gqlClient

    gqlClient->>queryFn: Returns response
    deactivate gqlClient

    queryFn->>useQuery: Returns response
    deactivate queryFn

    useQuery->>onSuccess: Calls onSuccess callback
    deactivate useQuery
    activate onSuccess

    onSuccess->>useSetQueryData: Sets amount data as "LATEST"
    onSuccess->>useSetQueryData: Sets receipt data as "LATEST"
    onSuccess->>useSetQueryData: Sets exceptions data as "LATEST"
    deactivate onSuccess

    ReportEntryQueryProvider->>ReportEntryQueryProvider: Renders children
    deactivate ReportEntryQueryProvider
```

The `ReportEntryQueryProvider` listens for `TriggerRequestEvent` receiving a list of query keys to fetch. This list is converted into a set of known "fragments" which are passed into the `useQuery` hook's `queryFn()`. These fragments are passed into the GQL query as `@include` statements.
A GraphQL request is made and when the data arrives it is handled by the `onSuccess()` callback. This callback walks throught the response using the `useQueryData` to set the returned data as "LATEST".
