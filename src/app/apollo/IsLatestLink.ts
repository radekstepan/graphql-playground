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
  protected map = new Map<string, number>();

  request(operation, forward) {
    const {query} = operation;
    const {invalidate} = operation.getContext();

    if (invalidate) {
      if (isMutation(query)) {
        // TODO do this after the mutation resolves
        for (const key of invalidate) {
          const count = this.map.get(key);
          this.map.set(key, count ? count + 1 : 1);
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

  checkIsLatest(id: string, key: string): [boolean, Function] {
    const currentVer = this.map.get(key) || 0;
    if (!currentVer) {
      return [true, () => {}];
    }

    const hash = `${key}:${id}`;
    const queryVer = this.map.get(hash) || 0;

    if (queryVer === currentVer) {
      return [true, () => {}];
    }

    return [false, () => {
      this.map.set(hash, currentVer);
    }];
  }

  // A way to skip using this in tests.
  use() {
    this.isInUse = true;
    return this;
  }
}

export default new IsLatestLink();
