/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "#graphql\n  query GetSum {\n    sum {\n      id\n      value\n    }\n  }\n": types.GetSumDocument,
    "#graphql\n  query GetNumber($id: String!) {\n    number(id: $id) {\n      id\n      value\n    }\n  }\n": types.GetNumberDocument,
    "#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      numbers {\n        id\n        value\n      }\n    }\n  }\n": types.SaveNumbersDocument,
    "#graphql\n  mutation Reset {\n    reset\n  }\n": types.ResetDocument,
    "#graphql\n  query GetExpenses {\n    employee {\n      id\n      reports {\n        id\n        expenses {\n          id\n        }\n      }\n    }\n  }\n": types.GetExpensesDocument,
    "#graphql\n  query GetRacoonReport(\n    $includeName: Boolean!,\n    $includeTotalAmount: Boolean!,\n    $includeExceptions: Boolean!,\n    $includeExpenses: Boolean!\n  ) {\n    racoon {\n      report {\n        id\n        name @include(if: $includeName)\n        totalAmount @include(if: $includeTotalAmount)\n        exceptions @include(if: $includeExceptions)\n        expenses @include(if: $includeExpenses) {\n          id\n          amount\n          receipt\n        }\n      }\n    }\n  }\n": types.GetRacoonReportDocument,
    "#graphql\n  mutation UpdateRacoonEntry {\n    racoonMutation {\n      updateEntry {\n        ok\n      }\n    }\n  }\n": types.UpdateRacoonEntryDocument,
    "#graphql\n  mutation UpdateRacoonReceipt {\n    racoonMutation {\n      updateReceipt {\n        ok\n      }\n    }\n  }\n": types.UpdateRacoonReceiptDocument,
};

export function graphql(source: "#graphql\n  query GetSum {\n    sum {\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetSum {\n    sum {\n      id\n      value\n    }\n  }\n"];
export function graphql(source: "#graphql\n  query GetNumber($id: String!) {\n    number(id: $id) {\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetNumber($id: String!) {\n    number(id: $id) {\n      id\n      value\n    }\n  }\n"];
export function graphql(source: "#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      numbers {\n        id\n        value\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      numbers {\n        id\n        value\n      }\n    }\n  }\n"];
export function graphql(source: "#graphql\n  mutation Reset {\n    reset\n  }\n"): (typeof documents)["#graphql\n  mutation Reset {\n    reset\n  }\n"];
export function graphql(source: "#graphql\n  query GetExpenses {\n    employee {\n      id\n      reports {\n        id\n        expenses {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetExpenses {\n    employee {\n      id\n      reports {\n        id\n        expenses {\n          id\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "#graphql\n  query GetRacoonReport(\n    $includeName: Boolean!,\n    $includeTotalAmount: Boolean!,\n    $includeExceptions: Boolean!,\n    $includeExpenses: Boolean!\n  ) {\n    racoon {\n      report {\n        id\n        name @include(if: $includeName)\n        totalAmount @include(if: $includeTotalAmount)\n        exceptions @include(if: $includeExceptions)\n        expenses @include(if: $includeExpenses) {\n          id\n          amount\n          receipt\n        }\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetRacoonReport(\n    $includeName: Boolean!,\n    $includeTotalAmount: Boolean!,\n    $includeExceptions: Boolean!,\n    $includeExpenses: Boolean!\n  ) {\n    racoon {\n      report {\n        id\n        name @include(if: $includeName)\n        totalAmount @include(if: $includeTotalAmount)\n        exceptions @include(if: $includeExceptions)\n        expenses @include(if: $includeExpenses) {\n          id\n          amount\n          receipt\n        }\n      }\n    }\n  }\n"];
export function graphql(source: "#graphql\n  mutation UpdateRacoonEntry {\n    racoonMutation {\n      updateEntry {\n        ok\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation UpdateRacoonEntry {\n    racoonMutation {\n      updateEntry {\n        ok\n      }\n    }\n  }\n"];
export function graphql(source: "#graphql\n  mutation UpdateRacoonReceipt {\n    racoonMutation {\n      updateReceipt {\n        ok\n      }\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation UpdateRacoonReceipt {\n    racoonMutation {\n      updateReceipt {\n        ok\n      }\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;