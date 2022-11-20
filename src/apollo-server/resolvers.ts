type Number = {
  id: string
  value: number
}

const data = new Set<Number>();

const resolvers = {
  Query: {
    sum: () => ({
      id: 'SUM',
      value: Array.from(data).reduce((acc, num) => acc + num.value, 0)
    }),
  },
  Mutation: {
    saveNumbers: (_root: unknown, args: {input: string}) => {
      const {input} = args;

      data.clear();

      input
        .split(',')
        .map(d => d.trim())
        .map(parseFloat)
        .filter(Number)
        .forEach((value, id) => data.add({id: id.toString(), value}));
      
      return data;
    }
  }
};

export default resolvers;
