import { gql } from 'graphql-tag';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: number;
};

export type MutableProduct = Omit<Product, 'id' | 'createdAt'>;

export type Products = {
  products: Product[];
};

export const GET_PRODUCTS = gql`
  query GET_PRODUCTS($cursor: ID, $showDeleted: Boolean) {
    products(cursor: $cursor, showDeleted: $showDeleted) {
      id
      imageUrl
      price
      title
      description
      createdAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: ID!) {
    product(id: $id) {
      id
      imageUrl
      price
      title
      description
      createdAt
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation ADD_PRODUCT(
    $title: String!
    $description: String!
    $price: Int!
    $imageUrl: String!
  ) {
    addProduct(
      title: $title
      description: $description
      price: $price
      imageUrl: $imageUrl
    ) {
      id
      title
      description
      price
      imageUrl
      createdAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UPDATE_PRODUCT(
    $id: ID!
    $title: String
    $description: String
    $price: Int
    $imageUrl: String
  ) {
    updateProduct(
      id: $id
      title: $title
      description: $description
      price: $price
      imageUrl: $imageUrl
    ) {
      id
      title
      description
      price
      imageUrl
      createdAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;
