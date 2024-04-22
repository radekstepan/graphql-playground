# Component Hierarchy

```mermaid
graph TD
    A[AtomStateProvider] --> B[QueryClientProvider]
    B --> C[OverseerProvider]
    C --> D[ReportPage]
    C --> O[EntryPage]
    D --> E[ReportQueryProvider]

    E --> F[ReportName]
    E --> G[ReportTotals]
    E --> H[ReportCashAdvances]
    E --> J[ReportExceptions]
    E --> I["Entries[]"]
    I --> K[ReportEntryQueryProvider]
    O --> K
    K --> L[Entry]
    K --> M[Receipt]
```

- AtomStateProvider
  - QueryClientProvider
    - OverseerProvider
      - ReportPage
        - ReportQueryProvider
          - ReportName
          - ReportTotals
          - ReportCashAdvances
          - ReportExceptions
          - Entries[]
            - ReportEntryQueryProvider
              - Entry
              - Receipt
      - EntryPage
        - ReportEntryQueryProvider
          - Entry
          - Receipt
