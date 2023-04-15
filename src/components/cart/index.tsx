import { Cart } from '../../graphql/cart';
import CartItem from './item';

const CartList = ({ items }: { items: Cart[] }) => {
  return (
    <ul className='cart'>
      {items.map((item) => (
        <CartItem {...item} key={item.id} />
      ))}
    </ul>
  );
};

export default CartList;
