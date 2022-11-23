import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';

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
  useQuery(GET_COUNT, {
    fetchPolicy: 'cache-first'
  });

  return null;
};

export default Count;
