const typeDefs = `#graphql
  type Expense {
    id: String!
  }

  type Report {
    id: String!
    expenses: [Expense!]!
  }

  type Employee {
    id: String!
    reports: [Report!]!
  }

  type Query {
    employee: Employee!
  }
`;

export default typeDefs;
