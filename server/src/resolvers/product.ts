import { DBField, writeDB } from '../dbController';
import { Products, Resolver } from './types';
import { v4 as uuid } from 'uuid';

const setJSON = (data: Products) => writeDB(DBField.PRODUCTS, data);

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
  Mutation: {
    addProduct: (parent, { title, description, price, imageUrl }, { db }) => {
      const newProduct = {
        id: uuid(),
        title,
        description,
        price,
        imageUrl,
        createdAt: Date.now(),
      };

      // write db
      db.products.push(newProduct);
      setJSON(db.products);

      return newProduct;
    },
    updateProduct: (parent, { id, ...data }, { db }) => {
      const existProductIndex = db.products.findIndex((item) => item.id === id);

      if (existProductIndex < 0) {
        throw new Error('없는 상품입니다');
      }

      const updatedItem = {
        ...db.products[existProductIndex],
        ...data,
      };

      // write db
      db.products.splice(existProductIndex, 1, updatedItem);
      setJSON(db.products);

      return updatedItem;
    },
    deleteProduct: (parent, { id }, { db }) => {
      // 실제 DB에서 delete를 하는 대신, createdAt 속성을 지워준다.
      const existProductIndex = db.products.findIndex((item) => item.id === id);

      if (existProductIndex < 0) {
        throw new Error('없는 상품입니다');
      }

      const deletedItem = {
        ...db.products[existProductIndex],
      };

      delete deletedItem.createdAt;

      // write db
      db.products.splice(existProductIndex, 1, deletedItem);
      setJSON(db.products);

      return id;
    },
  },
};

export default productResolver;
