import { Resolver } from './types';

const productResolver: Resolver = {
  Query: {
    products: (parent, { cursor = '' }, { db }, info) => {
      const limit = 15; // 15개씩 끊겠다.
      const fromIndex =
        db.products.findIndex((product) => product.id === cursor) + 1;

      return db.products.slice(fromIndex, fromIndex + limit) || [];
    },
    product: (parent, { id }, { db }, info) => {
      const found = db.products.find((item) => item.id === id);

      if (found) {
        return found;
      }

      return null;
    },
  },
};

export default productResolver;
