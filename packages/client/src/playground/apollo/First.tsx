import {useQuery} from '@apollo/client';
import {GET_NUMBER} from '../../gql';

function First() {
  useQuery(GET_NUMBER, {
    variables: {
      id: '0'
    },
    fetchPolicy: 'cache-first'
  });

  return null;
};

export default First;
