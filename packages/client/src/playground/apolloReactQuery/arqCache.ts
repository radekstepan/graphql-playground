import {Cache, InMemoryCache, Reference} from '@apollo/client';
import {reactQueryClient} from './client';

// Recursively walk an object and store types found.
const walk = (
  obj: {[key: string]: any}
) => {
  for (const key in obj) {
    const value = obj[key];

    if (value !== null && typeof value === "object") {
      // TODO typeFields
      // TODO queries and array element order
      // TODO _ref
      // TODO merge types
      const {__typename, id} = value;
      if (__typename && id) {
        reactQueryClient.setQueryData([__typename, {id}], value);
      }

      walk(value);
    }
  }
}


export class ARQCache extends InMemoryCache {
  write(options: Cache.WriteOptions<any, any>): Reference | undefined {
    // Write into React Query cache.
    walk(options.result);

    return super.write(options);
  }
};
