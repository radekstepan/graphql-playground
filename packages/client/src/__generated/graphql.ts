/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Employee = {
  __typename?: 'Employee';
  id: Scalars['String'];
  reports: Array<Report>;
};

export type Expense = {
  __typename?: 'Expense';
  id: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  racoonMutation: RacoonMutation;
  reset: Scalars['Boolean'];
  saveNumbers: SaveNumbersResponse;
};


export type MutationSaveNumbersArgs = {
  input: Scalars['String'];
};

export type Number = {
  __typename?: 'Number';
  id: Scalars['String'];
  value: Scalars['Float'];
};

export type Ok = {
  __typename?: 'Ok';
  ok: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  employee: Employee;
  number?: Maybe<Number>;
  racoon: Racoon;
  sum: Number;
};


export type QueryNumberArgs = {
  id: Scalars['String'];
};

export type Racoon = {
  __typename?: 'Racoon';
  entry: RacoonEntry;
  report: RacoonReport;
};


export type RacoonEntryArgs = {
  id: Scalars['String'];
};

export type RacoonEntry = {
  __typename?: 'RacoonEntry';
  amount: Scalars['Int'];
  exceptions: Array<RacoonException>;
  id: Scalars['String'];
  receipt?: Maybe<Scalars['String']>;
};

export type RacoonException = {
  __typename?: 'RacoonException';
  entryId: Scalars['String'];
  text: Scalars['String'];
};

export type RacoonMutation = {
  __typename?: 'RacoonMutation';
  updateEntryAmount: Ok;
  updateEntryReceipt: Ok;
};


export type RacoonMutationUpdateEntryAmountArgs = {
  id: Scalars['String'];
};


export type RacoonMutationUpdateEntryReceiptArgs = {
  id: Scalars['String'];
};

export type RacoonReport = {
  __typename?: 'RacoonReport';
  entries: Array<RacoonEntry>;
  exceptions: Array<RacoonException>;
  id: Scalars['String'];
  name: Scalars['String'];
  totalAmount: Scalars['Int'];
};

export type Report = {
  __typename?: 'Report';
  expenses: Array<Expense>;
  id: Scalars['String'];
};

export type SaveNumbersResponse = {
  __typename?: 'SaveNumbersResponse';
  numbers: Array<Number>;
};

export type GetSumQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSumQuery = { __typename?: 'Query', sum: { __typename?: 'Number', id: string, value: number } };

export type GetNumberQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetNumberQuery = { __typename?: 'Query', number?: { __typename?: 'Number', id: string, value: number } | null };

export type SaveNumbersMutationVariables = Exact<{
  input: Scalars['String'];
}>;


export type SaveNumbersMutation = { __typename?: 'Mutation', saveNumbers: { __typename?: 'SaveNumbersResponse', numbers: Array<{ __typename?: 'Number', id: string, value: number }> } };

export type ResetMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetMutation = { __typename?: 'Mutation', reset: boolean };

export type GetExpensesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExpensesQuery = { __typename?: 'Query', employee: { __typename?: 'Employee', id: string, reports: Array<{ __typename?: 'Report', id: string, expenses: Array<{ __typename?: 'Expense', id: string }> }> } };

export type GetRacoonReportQueryVariables = Exact<{
  includeName: Scalars['Boolean'];
  includeTotalAmount: Scalars['Boolean'];
  includeExceptions: Scalars['Boolean'];
  includeEntries: Scalars['Boolean'];
}>;


export type GetRacoonReportQuery = { __typename?: 'Query', racoon: { __typename?: 'Racoon', report: { __typename?: 'RacoonReport', id: string, name?: string, totalAmount?: number, exceptions?: Array<{ __typename?: 'RacoonException', entryId: string, text: string }>, entries?: Array<{ __typename?: 'RacoonEntry', id: string, amount: number, receipt?: string | null }> } } };

export type GetRacoonEntryQueryVariables = Exact<{
  id: Scalars['String'];
  includeAmount: Scalars['Boolean'];
  includeReceipt: Scalars['Boolean'];
  includeExceptions: Scalars['Boolean'];
}>;


export type GetRacoonEntryQuery = { __typename?: 'Query', racoon: { __typename?: 'Racoon', entry: { __typename?: 'RacoonEntry', id: string, amount?: number, receipt?: string | null, exceptions?: Array<{ __typename?: 'RacoonException', entryId: string, text: string }> } } };

export type UpdateRacoonEntryAmountMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UpdateRacoonEntryAmountMutation = { __typename?: 'Mutation', racoonMutation: { __typename?: 'RacoonMutation', updateEntryAmount: { __typename?: 'Ok', ok: boolean } } };

export type UpdateRacoonEntryReceiptMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UpdateRacoonEntryReceiptMutation = { __typename?: 'Mutation', racoonMutation: { __typename?: 'RacoonMutation', updateEntryReceipt: { __typename?: 'Ok', ok: boolean } } };


export const GetSumDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetSumQuery, GetSumQueryVariables>;
export const GetNumberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNumber"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetNumberQuery, GetNumberQueryVariables>;
export const SaveNumbersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveNumbers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveNumbers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<SaveNumbersMutation, SaveNumbersMutationVariables>;
export const ResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Reset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reset"}}]}}]} as unknown as DocumentNode<ResetMutation, ResetMutationVariables>;
export const GetExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExpenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"employee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetExpensesQuery, GetExpensesQueryVariables>;
export const GetRacoonReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRacoonReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeTotalAmount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeExceptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeEntries"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"racoon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeName"}}}]}]},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeTotalAmount"}}}]}]},{"kind":"Field","name":{"kind":"Name","value":"exceptions"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeExceptions"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryId"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeEntries"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"receipt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRacoonReportQuery, GetRacoonReportQueryVariables>;
export const GetRacoonEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRacoonEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeAmount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeReceipt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeExceptions"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"racoon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeAmount"}}}]}]},{"kind":"Field","name":{"kind":"Name","value":"receipt"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeReceipt"}}}]}]},{"kind":"Field","name":{"kind":"Name","value":"exceptions"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeExceptions"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryId"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRacoonEntryQuery, GetRacoonEntryQueryVariables>;
export const UpdateRacoonEntryAmountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRacoonEntryAmount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"racoonMutation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEntryAmount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRacoonEntryAmountMutation, UpdateRacoonEntryAmountMutationVariables>;
export const UpdateRacoonEntryReceiptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRacoonEntryReceipt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"racoonMutation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEntryReceipt"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRacoonEntryReceiptMutation, UpdateRacoonEntryReceiptMutationVariables>;