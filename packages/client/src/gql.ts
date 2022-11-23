import {graphql} from './__generated';

export const SAVE_NUMBERS = graphql(`#graphql
  mutation SaveNumbers($input: String!) {
    saveNumbers(input: $input) {
      __typename
      id
      value
    }
  }
`);

export const GET_SUM = graphql(`#graphql
  query GetSum {
    sum {
      __typename
      id
      value
    }
  }
`);

export const GET_FIRST = graphql(`#graphql
  query GetFirst {
    number(id: "0") {
      __typename
      id
      value
    }
  }
`);

export const GET_COUNT = graphql(`#graphql
  query GetCount {
    count {
      __typename
      id
      value
    }
  }
`);
