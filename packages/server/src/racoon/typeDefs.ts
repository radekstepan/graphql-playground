const typeDefs = `#graphql
  type RacoonEntry {
    id: String!
    amount: Int!
    receipt: String
    exceptions: [RacoonException!]!
  }

  type RacoonException {
    entryId: String!
    text: String!
  }

  type RacoonReport {
    id: String!
    name: String!
    totalAmount: Int!
    exceptions: [RacoonException!]!
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
