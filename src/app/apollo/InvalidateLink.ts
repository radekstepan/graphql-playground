import {ApolloLink} from '@apollo/client';
import {getMainDefinition} from '@apollo/client/utilities';
import {DocumentNode} from 'graphql';
// import {print} from 'graphql/language/printer';
// import sha256 from 'hash.js/lib/hash/sha/256';

// TODO: Perhaps query name plus variables is enough
// const genHash = (query: DocumentNode, variables: Record<string, unknown>): string =>
//   sha256()
//     .update(print(query) + JSON.stringify(variables))
//     .digest('hex');

const isMutation = (query: DocumentNode) => {
  const def = getMainDefinition(query);
  return def.kind === 'OperationDefinition' && def.operation === 'mutation';
};

// TODO we could save this in Apollo cache.
export const counter = new Map<string, number>();
export const queries = new Map<string, number>();

class InvalidateLink extends ApolloLink {
  request(operation, forward) {
    const {query} = operation;
    const {invalidate} = operation.getContext();

    if (invalidate) {
      if (isMutation(query)) {
        // TODO do this after the mutation resolves.
        for (const key of invalidate) {
          const count = counter.get(key) || 0;
          counter.set(key, count + 1);
        }
      }
    }

    return forward(operation);
  }
}

export default InvalidateLink;
