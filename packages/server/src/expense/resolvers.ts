const gen = (prefix: string, n: number) =>
  (root?: {id?: string}) =>
    Array(n).fill(1).map((_, i) =>
      ({id: [root?.id, prefix, i + 1].filter(Boolean).join('_')})
    )

const resolvers = {
  Query: {
    employee: () => ({id: 'EMP_1'})
  },
  Employee: {
    reports: gen('REP', 1)
  },
  Report: {
    expenses: gen('EXP', 2)
  }
};

export default resolvers;
