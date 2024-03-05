# useUpdateEntryAmountMutation

```mermaid
sequenceDiagram
    participant Component as Component
    participant useUpdateEntryAmountMutation as useUpdateEntryAmountMutation
    participant GraphQL as GraphQL
    participant useSetQueryData as useSetQueryData

    activate Component
    Component->>useUpdateEntryAmountMutation: Calls mutation function
    deactivate Component
    activate useUpdateEntryAmountMutation

    useUpdateEntryAmountMutation->>GraphQL: Makes request

    activate GraphQL

    GraphQL->>useUpdateEntryAmountMutation: Returns response
    deactivate GraphQL

    useUpdateEntryAmountMutation->>useSetQueryData: Sets entry amount key as "STALE"
    useUpdateEntryAmountMutation->>useSetQueryData: Sets report total amount key as "STALE"
    useUpdateEntryAmountMutation->>useSetQueryData: Sets cash advances as "STALE"

    deactivate useUpdateEntryAmountMutation
```

The `useUpdateEntryAmountMutation` hook returns a `mutation` function which components can use to mutate data. When a mutation gets trigger, the `mutationFn` function gets called. It makes a graphql request.
When the request response arrives, we use the `useSetQueryData` to set the entry amount, report toal amount and cash advances query keys as "STALE".
