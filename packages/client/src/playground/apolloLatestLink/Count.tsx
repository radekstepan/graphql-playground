import useLatestQuery from './useLatestQuery';
import {GET_COUNT} from '../../gql';

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
