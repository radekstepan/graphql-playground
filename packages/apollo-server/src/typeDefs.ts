const typeDefs = `#graphql
  type Number {
    id: String!
    value: Float!
  }

  type Query {
    sum: Number!
    count: Number!
    number(id: String!): Number
  }

  type Mutation {
    saveNumbers(input: String!): [Number!]!
  }
`;

export default typeDefs;