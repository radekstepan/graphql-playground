/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      __typename\n      id\n      value\n    }\n  }\n": types.SaveNumbersDocument,
    "#graphql\n  query GetSum {\n    sum {\n      __typename\n      id\n      value\n    }\n  }\n": types.GetSumDocument,
    "#graphql\n  query GetFirst {\n    number(id: \"0\") {\n      __typename\n      id\n      value\n    }\n  }\n": types.GetFirstDocument,
    "#graphql\n  query GetCount {\n    count {\n      __typename\n      id\n      value\n    }\n  }\n": types.GetCountDocument,
};

export function graphql(source: "#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      __typename\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      __typename\n      id\n      value\n    }\n  }\n"];
export function graphql(source: "#graphql\n  query GetSum {\n    sum {\n      __typename\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetSum {\n    sum {\n      __typename\n      id\n      value\n    }\n  }\n"];
export function graphql(source: "#graphql\n  query GetFirst {\n    number(id: \"0\") {\n      __typename\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetFirst {\n    number(id: \"0\") {\n      __typename\n      id\n      value\n    }\n  }\n"];
export function graphql(source: "#graphql\n  query GetCount {\n    count {\n      __typename\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetCount {\n    count {\n      __typename\n      id\n      value\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;