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