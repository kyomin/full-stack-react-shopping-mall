import { gql } from 'apollo-server-express';

const productSchema = gql`
  type Product {
    id: ID!
    title: String!
    description: String
    price: Int!
    imageUrl: String!
    createdAt: Float
  }

  extend type Query {
    products(cursor: ID): [Product!]
    product(id: ID!): Product!
  }

  extend type Mutation {
    addProduct(
      title: String!
      description: String!
      price: Int!
      imageUrl: String!
    ): Product!
    updateProduct(
      id: ID!
      title: String
      description: String
      price: Int
      imageUrl: String
    ): Product!
    deleteProduct(id: ID!): ID!
  }
`;

export default productSchema;
