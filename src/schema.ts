//# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  //# This "Book" type defines the queryable fields for every book in our data source.

import gql from 'graphql-tag';

const schem = gql`
  enum Status {
    INACTIVE
    ACTIVE
    VERIFIED
    BLOCK
  }

  type User {
    id: ID
    mobile_number: String
    name: String
    address: String
    status: String
  }

  input UserInput {
    mobile_number: String!
    name: String!
    address: String
  }

  type CreateUserResult {
    id: ID!
  }

  input UserUpdateStatusInput {
    id: ID!
    status: String!
  }

  type UserUpdateStatusResult {
    ok: Boolean!
    id: ID!
    status: String!
  }


  # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    users: [User]
  }

  type Mutation {
    createUser(input: UserInput!): CreateUserResult!
    updateUserStatus(input: UserUpdateStatusInput!): UserUpdateStatusResult!
  }

  type Subscription {
    onUserCreated: User
    onUserStatus: User
  }
`

export default schem;