import {numbers as data, type Number} from '../data.js';

const resolvers = {
  Query: {
    sum: (): Number => ({
      id: 'SUM',
      value: Array.from(data.values())
        .reduce((acc, d) => acc + d.value, 0)
    }),
    number: (_root: unknown, args: {id: string}): Number =>
      data.get(args.id)
  },
  Mutation: {
    saveNumbers: (_root: unknown, args: {input: string}) => {
      const {input} = args;

      data.clear();

      input
        .split(',')
        .map(d => d.trim())
        .map(parseFloat)
        .filter(d => !Number.isNaN(d))
        .forEach((value, id) => {
          const key = id.toString();
          data.set(key, {id: key, value})
        });
      
      return {
        numbers: data.values()
      };
    }
  }
};

export default resolvers;
