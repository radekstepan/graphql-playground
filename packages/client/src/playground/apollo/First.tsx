import {useQuery} from '@apollo/client';
import {GET_NUMBER} from '../../queries';

function First() {
  useQuery(GET_NUMBER, {
    variables: {
      id: '0'
    },
    // We could go 'network-only' but we'd have to re-render
    //  the component for this to take effect.
    fetchPolicy: 'cache-first'
  });

  return null;
};

export default First;
