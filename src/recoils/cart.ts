import { atom } from 'recoil';
import { Cart } from '../graphql/cart';

export const checkedCartState = atom<Cart[]>({
  key: 'cartState',
  default: [],
});
