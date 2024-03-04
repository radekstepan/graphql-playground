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

  type RacoonCashAdvance {
    id: String!
    amount: Int!
  }

  type RacoonReport {
    id: String!
    name: String!
    totalAmount: Int!
    cashAdvances: [RacoonCashAdvance!]!
    exceptions: [RacoonException!]!
    entries: [RacoonEntry!]!
  }

  type Racoon {
    report(reportId: String!): RacoonReport!
    entry(entryId: String!): RacoonEntry!
  }

  type Query {
    racoon: Racoon!
  }

  type Ok {
    ok: Boolean!
  }

  type RacoonMutation {
    updateEntryAmount(entryId: String!): Ok!
    updateEntryReceipt(entryId: String!): Ok!
  }

  type Mutation {
    racoonMutation: RacoonMutation!
  }
`;

export default typeDefs;
