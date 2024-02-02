const typeDefs = `#graphql
  type RacoonExpense {
    id: String!
    amount: Int!
    receipt: String
  }

  type RacoonReport {
    id: String!
    name: String!
    totalAmount: Int!
    exceptions: [String!]!
    expenses: [RacoonExpense!]!
  }

  type Racoon {
    report: RacoonReport!
  }

  type Query {
    racoon: Racoon!
  }

  type Ok {
    ok: Boolean!
  }

  type RacoonMutation {
    updateEntry: Ok!
    updateReceipt: Ok!
  }

  type Mutation {
    racoonMutation: RacoonMutation!
  }
`;

export default typeDefs;
