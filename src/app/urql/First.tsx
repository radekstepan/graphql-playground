import {useQuery} from 'urql';

const GET_FIRST = `#graphql
  query GetFirst {
    number(id: "0") {
      __typename
      id
      value
    }
  }
`;

function First() {
  useQuery({
    query: GET_FIRST,
    requestPolicy: 'cache-first',
  });

  return null;
};

export default First;
