/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "#graphql\n  query GetSum {\n    sum {\n      id\n      value\n    }\n  }\n": types.GetSumDocument,
    "#graphql\n  query GetNumber($id: String!) {\n    number(id: $id) {\n      id\n      value\n    }\n  }\n": types.GetNumberDocument,
    "#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      id\n      value\n    }\n  }\n": types.SaveNumbersDocument,
    "#graphql\n  mutation Reset {\n    reset\n  }\n": types.ResetDocument,
};

export function graphql(source: "#graphql\n  query GetSum {\n    sum {\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetSum {\n    sum {\n      id\n      value\n    }\n  }\n"];
export function graphql(source: "#graphql\n  query GetNumber($id: String!) {\n    number(id: $id) {\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  query GetNumber($id: String!) {\n    number(id: $id) {\n      id\n      value\n    }\n  }\n"];
export function graphql(source: "#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      id\n      value\n    }\n  }\n"): (typeof documents)["#graphql\n  mutation SaveNumbers($input: String!) {\n    saveNumbers(input: $input) {\n      id\n      value\n    }\n  }\n"];
export function graphql(source: "#graphql\n  mutation Reset {\n    reset\n  }\n"): (typeof documents)["#graphql\n  mutation Reset {\n    reset\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;