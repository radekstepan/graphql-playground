import {graphql} from './__generated';

export const SAVE_NUMBERS = graphql(`#graphql
  mutation SaveNumbers($input: String!) {
    saveNumbers(input: $input) {
      id
      value
    }
  }
`);

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

export const GET_COUNT = graphql(`#graphql
  query GetCount {
    count {
      id
      value
    }
  }
`);
