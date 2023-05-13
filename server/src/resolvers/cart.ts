import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { DBField, writeDB } from '../dbController';
import { Cart, Resolver } from './types';

const setJSON = (data: Cart) => writeDB(DBField.CART, data);

const cartResolver: Resolver = {
  Query: {
    cart: async () => {
      const cart = collection(db, 'cart');
      const snapshot = await getDocs(cart);
      const data: DocumentData = [];

      snapshot.forEach((doc) => {
        const d = doc.data();
        data.push({
          id: doc.id,
          ...d,
        });
      });

      return data;
    },
  },
  Mutation: {
    addCart: async (parent, { productId }) => {
      if (!productId) {
        throw Error('상품 id가 없습니다!');
      }

      const productRef = doc(db, 'products', productId);
      const cartCollection = collection(db, 'cart');
      const exist = (
        await getDocs(query(cartCollection, where('product', '==', productRef)))
      ).docs[0];

      let cartRef;
      if (exist) {
        cartRef = doc(db, 'cart', exist.id);
        await updateDoc(cartRef, {
          amount: increment(1),
        });
      } else {
        cartRef = await addDoc(cartCollection, {
          product: productRef,
          amount: 1,
        });
      }

      const cartSnapshot = await getDoc(cartRef);

      return {
        id: cartSnapshot.id,
        product: productRef,
        ...cartSnapshot.data(),
      };
    },
    updateCart: async (parent, { cartId, amount }) => {
      if (amount < 1) {
        throw Error('장바구니 수량은 1 미만이 될 수 없습니다.');
      }

      const cartRef = doc(db, 'cart', cartId);

      if (!cartRef) {
        throw Error('등록된 장바구니 정보가 없습니다!');
      }

      await updateDoc(cartRef, {
        amount,
      });

      const cartSnapshot = await getDoc(cartRef);

      return {
        id: cartSnapshot.id,
        ...cartSnapshot.data(),
      };
    },
    deleteCart: async (parent, { cartId }) => {
      const cartRef = doc(db, 'cart', cartId);

      if (!cartRef) {
        throw Error('등록된 장바구니 정보가 없습니다!');
      }

      await deleteDoc(cartRef);

      return cartId;
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
    product: async (cartItem) => {
      const product = await getDoc(cartItem.product);
      const data: any = product.data();

      return {
        id: product.id,
        ...data,
      };
    },
  },
};

export default cartResolver;
