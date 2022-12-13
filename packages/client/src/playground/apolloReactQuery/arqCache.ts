import {Cache, InMemoryCache, Reference} from '@apollo/client';
import {reactQueryClient} from './client';

// function isRef(obj: any): obj is Reference {
//   return obj && typeof obj === 'object' && typeof obj.__ref === 'string';
// }

function getKeyFields(obj: any, keyFields?: string[]): [string, any][] {
  if (keyFields) {
    return Object.entries(obj).filter(([key]) => keyFields.includes(key))
  }
  if (obj.id !== null && obj.id !== undefined) {
    return [['id', obj.id]];
  }
  if (obj._id !== null && obj._id !== undefined) {
    return [['_id', obj._id]];
  }
  return [];
}

export class ARQCache extends InMemoryCache {
  // Recursively walk an object and store types found in RQ.
  private walk(obj: {[key: string]: any}) {
    for (const key in obj) {
      const value = obj[key];

      if (value && typeof value === 'object') {
        // TODO queries and array element order
        // TODO _ref
        // TODO merge types (policy)
        const {__typename: type} = value;
        // const ref = this.identify(value);
        if (type) {
          // const x = canonicalStringify(value);
          // const x = this.policies.getTypePolicy(value.__typename);
          // @ts-ignore accessing private config.
          const pol = this.policies.config.typePolicies[type];
          const keyFields = getKeyFields(value, pol?.keyFields);
          if (keyFields.length) {
            reactQueryClient.setQueryData([type, Object.fromEntries(keyFields)], value);
          }
        }

        this.walk(value);
      }
    }
  }

  write(options: Cache.WriteOptions<any, any>): Reference | undefined {
    // Write into React Query cache.
    this.walk(options.result);

    return super.write(options);
  }
}
