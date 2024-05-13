import {graphql} from './__generated';

export const RESET = graphql(`#graphql
  mutation Reset {
    reset {
      ok
    }
  }
`);

export const GET_REPORT = graphql(`#graphql
  query GetReport(
    $reportId: String!,
    $includeName: Boolean!,
    $includeTotalAmount: Boolean!,
    $includeExceptions: Boolean!,
    $includeEntries: Boolean!
  ) {
    report(reportId: $reportId) {
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
`);

export const GET_ENTRY = graphql(`#graphql
  query GetEntry(
    $entryId: String!,
    $includeAmount: Boolean!,
    $includeReceipt: Boolean!,
    $includeExceptions: Boolean!
  ) {
    entry(entryId: $entryId) {
      id
      amount @include(if: $includeAmount)
      receipt @include(if: $includeReceipt)
      exceptions @include(if: $includeExceptions) {
        entryId
        text
      }
    }
  }
`);

export const GET_CASH_ADVANCES = graphql(`#graphql
  query GetCashAdvances(
    $reportId: String!
  ) {
    report(reportId: $reportId) {
      cashAdvances {
        id
        amount
      }
    }
  }
`);

export const UPDATE_ENTRY_AMOUNT = graphql(`#graphql
  mutation UpdateEntryAmount($entryId: String!) {
    updateEntryAmount(entryId: $entryId) {
      ok
    }
  }
`);

export const UPDATE_ENTRY_RECEIPT = graphql(`#graphql
  mutation UpdateEntryReceipt($entryId: String!) {
    updateEntryReceipt(entryId: $entryId) {
      ok
    }
  }
`);
