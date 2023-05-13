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
import { Product, Resolver } from './types';

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
    executePay: async (parent, { ids }) => {
      /**
       * createdAt이 비어있지 않은 ids들에 대해서
       * 결제처리가 완료되었다고 가정하고
       * cart에서 대상 ids를 지워준다.
       */
      const deleted = [];
      for await (const id of ids) {
        const cartRef = doc(db, 'cart', id);
        const cartSnapshot = await getDoc(cartRef);
        const cartData = cartSnapshot.data();
        const productRef = cartData?.product;

        if (!productRef) {
          throw Error('상품 정보가 없습니다.');
        }

        const product = (await getDoc(productRef)).data() as Product;

        if (!product) {
          throw Error('상품 정보가 없습니다.');
        }

        if (product.createdAt) {
          await deleteDoc(cartRef);
          deleted.push(id);
        }
      }

      return deleted;
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
