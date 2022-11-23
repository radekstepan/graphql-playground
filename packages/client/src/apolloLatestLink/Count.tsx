import gql from 'graphql-tag';
import useLatestQuery from './useLatestQuery';

const GET_COUNT = gql`
  query GetCount {
    count {
      __typename
      id
      value
    }
  }
`;

function Count() {
  useLatestQuery(GET_COUNT, {
    fetchPolicy: 'cache-first',
    context: {
      invalidate: ['@sum']
    }
  });

  return null;
};

export default Count;
