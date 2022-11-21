import gql from 'graphql-tag';
import useLatestQuery from './useLatestQuery';

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
  const {data} = useLatestQuery(GET_SUM, {
    fetchPolicy: 'cache-first',
    context: {
      invalidate: ['@sum']
    }
  });

  return data?.sum.value;
};

export default Sum;
