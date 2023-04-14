import { useQuery } from 'react-query';
import { QueryKeys, graphqlFetcher } from '../../queryClient';
import { Cart, GET_CART } from '../../graphql/cart';
import CartList from '../../components/cart';

const CartPage = () => {
  const { data } = useQuery<{ [key: string]: Cart }>(
    [QueryKeys.CART],
    () => graphqlFetcher<{ [key: string]: Cart }>(GET_CART),
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  let cartItems: Cart[] = [];
  if (data) {
    cartItems = Object.values(data);
  }

  return (
    <div>
      <h2>장바구니</h2>
      <CartList items={cartItems} />
    </div>
  );
};

export default CartPage;
