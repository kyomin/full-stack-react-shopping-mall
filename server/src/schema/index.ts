import { gql } from 'apollo-server-express';
import productSchema from './product';
import cartSchema from './cart';

// 스키마들을 한데 합치는데 Query와 Mutation이 들어가야 한다. 그래서 임시로 지정했다.
const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, productSchema, cartSchema];
