import {useQuery} from '@apollo/client';
import {GET_COUNT} from '../../gql';

function Count() {
  useQuery(GET_COUNT, {
    fetchPolicy: 'cache-first'
  });

  return null;
};

export default Count;
