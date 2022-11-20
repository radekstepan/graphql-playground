import {useQuery} from './client';

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
  const {data} = useQuery(['sum', {sum: true}], GET_SUM);

  return data?.sum.value;
};

export default Sum;
