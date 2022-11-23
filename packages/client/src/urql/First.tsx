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
  const [{data}] = useQuery({
    query: GET_FIRST,
    requestPolicy: 'cache-first',
  });

  console.log(data?.number?.value);

  return null;
};

export default First;
