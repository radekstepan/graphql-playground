import {useQuery} from './client';

const GET_COUNT = `#graphql
  query GetCount {
    count {
      __typename
      id
      value
    }
  }
`;

function useGetCount() {
  useQuery(['sum', {count: true}], GET_COUNT);
}

function Count() {
  useGetCount();

  return null;
};

export default Count;
