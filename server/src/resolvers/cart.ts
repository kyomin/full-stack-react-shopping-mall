import { DBField, writeDB } from '../dbController';
import { Cart, Resolver } from './types';

const setJSON = (data: Cart) => writeDB(DBField.CART, data);

const cartResolver: Resolver = {
  Query: {
    cart: (parent, args, { db }) => {
      return db.cart;
    },
  },
  Mutation: {
    addCart: (parent, { id }, { db }) => {
      if (!id) {
        throw Error('상품 id가 없습니다!');
      }

      const targetProduct = db.products.find((item) => item.id === id);
      if (!targetProduct) {
        throw new Error('상품이 없습니다');
      }

      const existCartItemIndex = db.cart.findIndex((item) => item.id === id);
      if (existCartItemIndex > -1) {
        const newCartItem = {
          id,
          amount: db.cart[existCartItemIndex].amount + 1,
        };

        // write db
        db.cart.splice(existCartItemIndex, 1, newCartItem);
        setJSON(db.cart);

        return newCartItem;
      }

      const newItem = {
        id,
        amount: 1,
      };
      db.cart.push(newItem);
      setJSON(db.cart);
      return newItem;
    },
    updateCart: (parent, { id, amount }, { db }) => {
      const existCartItemIndex = db.cart.findIndex((item) => item.id === id);
      if (existCartItemIndex < 0) {
        throw new Error('없는 데이터입니다');
      }

      const newCartItem = {
        id,
        amount,
      };

      // write db
      db.cart.splice(existCartItemIndex, 1, newCartItem);
      setJSON(db.cart);

      return newCartItem;
    },
    deleteCart: (parent, { id }, { db }) => {
      const existCartItemIndex = db.cart.findIndex((item) => item.id === id);
      if (existCartItemIndex < 0) {
        throw new Error('없는 데이터입니다');
      }

      // write db
      db.cart.splice(existCartItemIndex, 1);
      setJSON(db.cart);

      return id;
    },
    executePay: (parent, { ids }, { db }) => {
      const newCartData = db.cart.filter(
        (cartItem) => !ids.includes(cartItem.id)
      );

      /**
       * 삭제 동기화
       * 만일 사용자가 결제 페이지에서 결제를 진행 중에
       * 삭제된 상품이 생겼고, 이를 결제 항목 중에 포함하는 경우 예외 처리!
       */
      if (
        newCartData.some((item) => {
          const product = db.products.find(
            (product: any) => product.id === item.id
          );
          return !product?.createdAt;
        })
      ) {
        throw Error('삭제된 상품이 포함되어 결제를 진행할 수 없습니다.');
      }

      // write db
      db.cart = newCartData;
      setJSON(db.cart);

      return ids;
    },
  },
  CartItem: {
    product: (cartItem, args, { db }) =>
      db.products.find((product: any) => product.id === cartItem.id),
  },
};

export default cartResolver;
