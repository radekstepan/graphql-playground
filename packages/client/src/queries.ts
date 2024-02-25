import {graphql} from './__generated';

export const GET_SUM = graphql(`#graphql
  query GetSum {
    sum {
      id
      value
    }
  }
`);

export const GET_NUMBER = graphql(`#graphql
  query GetNumber($id: String!) {
    number(id: $id) {
      id
      value
    }
  }
`);

export const SAVE_NUMBERS = graphql(`#graphql
  mutation SaveNumbers($input: String!) {
    saveNumbers(input: $input) {
      numbers {
        id
        value
      }
    }
  }
`);

export const RESET = graphql(`#graphql
  mutation Reset {
    reset
  }
`);

export const GET_EXPENSES = graphql(`#graphql
  query GetExpenses {
    employee {
      id
      reports {
        id
        expenses {
          id
        }
      }
    }
  }
`);

export const GET_RACOON_REPORT = graphql(`#graphql
  query GetRacoonReport(
    $includeName: Boolean!,
    $includeTotalAmount: Boolean!,
    $includeExceptions: Boolean!,
    $includeEntries: Boolean!
  ) {
    racoon {
      report {
        id
        name @include(if: $includeName)
        totalAmount @include(if: $includeTotalAmount)
        exceptions @include(if: $includeExceptions) {
          entryId
          text
        }
        entries @include(if: $includeEntries) {
          id
          amount
          receipt
        }
      }
    }
  }
`);

export const GET_RACOON_ENTRY = graphql(`#graphql
  query GetRacoonEntry(
    $id: String!,
    $includeAmount: Boolean!,
    $includeReceipt: Boolean!,
    $includeExceptions: Boolean!
  ) {
    racoon {
      entry(id: $id) {
        id
        amount @include(if: $includeAmount)
        receipt @include(if: $includeReceipt)
        exceptions @include(if: $includeExceptions) {
          entryId
          text
        }
      }
    }
  }
`);

export const UPDATE_RACOON_ENTRY_AMOUNT = graphql(`#graphql
  mutation UpdateRacoonEntryAmount($id: String!) {
    racoonMutation {
      updateEntryAmount(id: $id) {
        ok
      }
    }
  }
`);

export const UPDATE_RACOON_ENTRY_RECEIPT = graphql(`#graphql
  mutation UpdateRacoonEntryReceipt($id: String!) {
    racoonMutation {
      updateEntryReceipt(id: $id) {
        ok
      }
    }
  }
`);
