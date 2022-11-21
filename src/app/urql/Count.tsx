import {useQuery} from 'urql';

const GET_COUNT = `#graphql
  query GetCount {
    count {
      __typename
      id
      value
    }
  }
`;

function Count() {
  useQuery({
    query: GET_COUNT,
    requestPolicy: 'cache-first',
  });

  return null;
};

export default Count;
