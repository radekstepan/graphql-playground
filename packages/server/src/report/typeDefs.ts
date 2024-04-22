const typeDefs = `#graphql
  type Entry {
    id: String!
    amount: Int!
    receipt: String
    exceptions: [Exception!]!
  }

  type Exception {
    entryId: String!
    text: String!
  }

  type CashAdvance {
    id: String!
    amount: Int!
  }

  type Report {
    id: String!
    name: String!
    totalAmount: Int!
    cashAdvances: [CashAdvance!]!
    exceptions: [Exception!]!
    entries: [Entry!]!
  }

  type Query {
    report(reportId: String!): Report!
    entry(entryId: String!): Entry!
  }

  type Ok {
    ok: Boolean!
  }

  type Mutation {
    updateEntryAmount(entryId: String!): Ok!
    updateEntryReceipt(entryId: String!): Ok!
    reset: Boolean!
  }
`;

export default typeDefs;
