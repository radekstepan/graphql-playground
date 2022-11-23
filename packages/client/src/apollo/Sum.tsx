import gql from 'graphql-tag';
import {useQuery} from '@apollo/client';

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
  const {data} = useQuery(GET_SUM, {
    fetchPolicy: 'cache-first'
  });

  return data?.sum.value;
};

export default Sum;
