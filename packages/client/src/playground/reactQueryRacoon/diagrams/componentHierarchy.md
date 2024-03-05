# Component Hierarchy

```mermaid
graph TD
    A[AtomStateProvider] --> B[QueryClientProvider]
    B --> C[OverseerProvider]
    C --> D[ReportQueryProvider]
    D --> E[ReportName]
    D --> F[ReportTotals]
    D --> G[ReportCashAdvances]
    D --> H[ReportExceptions]
    D --> I[Entries]
    I --> J[ReportEntryQueryProvider]
    J --> K[Entry]
    J --> L[Receipt]
    D --> M[Loading]
```

- AtomStateProvider
  - QueryClientProvider
    - OverseerProvider
      - ReportQueryProvider
        - ReportName
        - ReportTotals
        - ReportCashAdvances
        - ReportExceptions
        - Entries
          - ReportEntryQueryProvider
            - Entry
            - Receipt
        - Loading
