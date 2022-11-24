import {useQuery} from 'urql';
import {GET_NUMBER} from '../../gql';

function First() {
  useQuery({
    query: GET_NUMBER,
    variables: {
      id: '0'
    },
    requestPolicy: 'cache-first',
  });

  return null;
};

export default First;
