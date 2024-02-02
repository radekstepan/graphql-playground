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
    $includeExpenses: Boolean!
  ) {
    racoon {
      report {
        id
        name @include(if: $includeName)
        totalAmount @include(if: $includeTotalAmount)
        exceptions @include(if: $includeExceptions)
        expenses @include(if: $includeExpenses) {
          id
          amount
          receipt
        }
      }
    }
  }
`);

export const UPDATE_RACOON_ENTRY = graphql(`#graphql
  mutation UpdateRacoonEntry {
    racoonMutation {
      updateEntry {
        ok
      }
    }
  }
`);

export const UPDATE_RACOON_RECEIPT = graphql(`#graphql
  mutation UpdateRacoonReceipt {
    racoonMutation {
      updateReceipt {
        ok
      }
    }
  }
`);
