import {ApolloLink} from '@apollo/client';
import {getMainDefinition, getOperationName} from '@apollo/client/utilities';
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

class IsLatestLink extends ApolloLink {
  isInUse = false;
  // TODO we could save this in Apollo cache.
  // TODO turn to LRU so this doesn't grow too large?
  protected mutations = new Set<string>();
  protected queries = new Map<string, Set<string>>();

  request(operation, forward) {
    const {query} = operation;
    const {invalidate} = operation.getContext();

    if (invalidate) {
      if (isMutation(query)) {
        // TODO do this after the mutation resolves
        for (const cacheKey of invalidate) {
          this.mutations.add(cacheKey);
          this.queries.delete(cacheKey);
        }
      }
    }

    return forward(operation);
  }

  // TODO create a hash of query and variables?
  identify(query: DocumentNode, variables?: Record<string, any>) {
    const name = getOperationName(query);
    if (variables && typeof variables === 'object') {
      return `${name}:${JSON.stringify(variables)}`;
    }
    return name
  }

  isLatest(queryId: string, cacheKey: string): boolean {
    // No mutation ran yet.
    if (!this.mutations.has(cacheKey)) {
      return true;
    }

    const queries = this.queries.get(cacheKey);
    if (!queries) {
      return false;
    }

    return queries.has(queryId)
  }

  setLatest(queryId: string, cacheKey: string) {
    const queries = this.queries.get(cacheKey);
    if (!queries) {
      this.queries.set(cacheKey, new Set([queryId]));
    } else {
      queries.add(queryId);
    }
  }

  // A way to skip using this in tests.
  use() {
    this.mutations = new Set();
    this.queries = new Map();
    this.isInUse = true;

    return this;
  }
}

export default new IsLatestLink();
