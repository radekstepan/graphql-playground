import gql from 'graphql-tag';
import useInvalidateQuery from '../apollo/useInvalidateQuery';

const GET_SUM = gql`
  query GetSum {
    sum {
      __typename
      id
      value
    }
  }
`;

function Sum() {
  const {data} = useInvalidateQuery(GET_SUM, {
    fetchPolicy: 'cache-first',
    context: {
      invalidate: ['sum']
    }
  });

  return data?.sum.value;
};

export default Sum;
