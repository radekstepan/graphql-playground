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

export type Mutation = {
  __typename?: 'Mutation';
  reset: Scalars['Boolean'];
  saveNumbers?: Maybe<SaveNumbersResponse>;
};


export type MutationSaveNumbersArgs = {
  input: Scalars['String'];
};

export type Number = {
  __typename?: 'Number';
  id: Scalars['String'];
  value: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  number?: Maybe<Number>;
  sum: Number;
};


export type QueryNumberArgs = {
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


export type SaveNumbersMutation = { __typename?: 'Mutation', saveNumbers?: { __typename?: 'SaveNumbersResponse', numbers: Array<{ __typename?: 'Number', id: string, value: number }> } | null };

export type ResetMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetMutation = { __typename?: 'Mutation', reset: boolean };


export const GetSumDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sum"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetSumQuery, GetSumQueryVariables>;
export const GetNumberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNumber"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetNumberQuery, GetNumberQueryVariables>;
export const SaveNumbersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveNumbers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveNumbers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"numbers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<SaveNumbersMutation, SaveNumbersMutationVariables>;
export const ResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Reset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reset"}}]}}]} as unknown as DocumentNode<ResetMutation, ResetMutationVariables>;