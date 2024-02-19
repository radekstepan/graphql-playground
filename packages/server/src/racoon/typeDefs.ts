const typeDefs = `#graphql
  type RacoonEntry {
    id: String!
    amount: Int!
    receipt: String
  }

  type RacoonReport {
    id: String!
    name: String!
    totalAmount: Int!
    exceptions: [String!]!
    entries: [RacoonEntry!]!
  }

  type Racoon {
    report: RacoonReport!
    entry(id: String!): RacoonEntry!
  }

  type Query {
    racoon: Racoon!
  }

  type Ok {
    ok: Boolean!
  }

  type RacoonMutation {
    updateEntryAmount(id: String!): Ok!
    updateEntryReceipt(id: String!): Ok!
  }

  type Mutation {
    racoonMutation: RacoonMutation!
  }
`;

export default typeDefs;
