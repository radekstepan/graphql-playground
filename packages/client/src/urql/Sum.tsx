import {useQuery} from 'urql';

const GET_SUM = `#graphql
  query GetSum {
    sum {
      __typename
      id
      value
    }
  }
`;

function Sum() {
  const [{data}] = useQuery({
    query: GET_SUM,
    requestPolicy: 'cache-first',
  });

  return data?.sum.value;
};

export default Sum;
