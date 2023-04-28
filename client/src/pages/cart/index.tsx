import { useQuery } from 'react-query';
import { QueryKeys, graphqlFetcher } from '../../queryClient';
import { Cart, GET_CART } from '../../graphql/cart';
import CartList from '../../components/cart';

const CartPage = () => {
  const { data } = useQuery<{ [key: string]: Cart[] }>(
    [QueryKeys.CART],
    () => graphqlFetcher<{ [key: string]: Cart[] }>(GET_CART),
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  const cartItems = data ? (data.cart as Cart[]) : [];

  return (
    <div>
      <h2>장바구니</h2>
      {cartItems?.length ? (
        <CartList items={cartItems} />
      ) : (
        <div>장바구니가 비었습니다.</div>
      )}
    </div>
  );
};

export default CartPage;
