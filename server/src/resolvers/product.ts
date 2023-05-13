import { Resolver } from './types';
import { db } from '../../firebase';
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  QueryOrderByConstraint,
  QueryFieldFilterConstraint,
  QueryStartAtConstraint,
  getDocs,
  startAfter,
  DocumentData,
  doc,
  getDoc,
  serverTimestamp,
  addDoc,
  updateDoc,
} from 'firebase/firestore';

const PAGE_SIZE = 15;

const productResolver: Resolver = {
  Query: {
    products: async (parent, { cursor = '', showDeleted = false }) => {
      const products = collection(db, 'products');
      const queryOptions: (
        | QueryOrderByConstraint
        | QueryFieldFilterConstraint
        | QueryStartAtConstraint
      )[] = [orderBy('createdAt', 'desc')];

      if (cursor) {
        const snapshot = await getDoc(doc(db, 'products', cursor));
        queryOptions.push(startAfter(snapshot));
      }

      if (!showDeleted) {
        queryOptions.unshift(where('createdAt', '!=', null));
      }

      const q = query(products, ...queryOptions, limit(PAGE_SIZE));
      const snapshot = await getDocs(q);
      const data: DocumentData = [];

      snapshot.forEach((doc) =>
        data.push({
          id: doc.id,
          ...doc.data(),
        })
      );

      return data;
    },
    product: async (parent, { id }) => {
      const snapshot = await getDoc(doc(db, 'products', id));

      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    },
  },
  Mutation: {
    addProduct: async (parent, { title, description, price, imageUrl }) => {
      const newProduct = {
        title,
        description,
        price,
        imageUrl,
        createdAt: serverTimestamp(),
      };

      // write db
      const result = await addDoc(collection(db, 'products'), newProduct);
      const snapshot = await getDoc(result);

      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    },
    updateProduct: async (parent, { id, ...data }) => {
      const productRef = doc(db, 'products', id);

      if (!productRef) {
        throw new Error('없는 상품입니다');
      }

      // write db
      await updateDoc(productRef, {
        ...data,
        createdAt: serverTimestamp(),
      });

      const snapshot = await getDoc(productRef);

      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    },
    deleteProduct: async (parent, { id }) => {
      const productRef = doc(db, 'products', id);

      if (!productRef) {
        throw new Error('없는 상품입니다');
      }

      // write db
      // 실제 DB에서 delete를 하는 대신, createdAt 속성을 지워준다.
      await updateDoc(productRef, { createdAt: null });

      return id;
    },
  },
};

export default productResolver;
