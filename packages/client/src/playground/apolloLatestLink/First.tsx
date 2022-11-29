import useLatestQuery from './useLatestQuery';
import {GET_NUMBER} from '../../queries';

function First() {
  useLatestQuery(GET_NUMBER, {
    variables: {
      id: '0'
    },
    fetchPolicy: 'cache-first',
  });

  return null;
};

export default First;
