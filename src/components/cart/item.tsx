import { useMutation } from 'react-query';
import { Cart } from '../../graphql/cart';
import { QueryKeys, getClient, graphqlFetcher } from '../../queryClient';
import { UPDATE_CART } from '../../graphql/cart';
import { SyntheticEvent } from 'react';

const CartItem = ({ id, imageUrl, price, title, amount }: Cart) => {
  const queryClient = getClient();
  const { mutate: updateCart } = useMutation(
    // mutate function call
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher<{ [key: string]: Cart }>(UPDATE_CART, { id, amount }),
    {
      // When mutate is called:
      onMutate: async ({ id, amount }: { id: string; amount: number }) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(QueryKeys.CART);

        // Snapshot the previous value
        const prevCart = queryClient.getQueryData<{ [key: string]: Cart }>(
          QueryKeys.CART
        );

        // handle exception
        if (!prevCart?.[id]) {
          return prevCart;
        }

        // Optimistically update to the new value
        const newCart = {
          ...(prevCart || {}),
          [id]: { ...prevCart[id], amount },
        };

        queryClient.setQueryData(QueryKeys.CART, newCart);
        return newCart;
      },
      // When mutate is finished
      onSuccess: (newValue) => {
        const prevCart = queryClient.getQueryData<{ [key: string]: Cart }>(
          QueryKeys.CART
        );

        const newCart = {
          ...(prevCart || {}),
          [id]: newValue,
        };

        queryClient.setQueryData(QueryKeys.CART, newCart);
      },
    }
  );

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    updateCart({ id, amount });
  };

  return (
    <li className='cart-item'>
      <img className='cart-item-image' src={imageUrl} />
      <p className='cart-item-price'>{price}</p>
      <p className='cart-item-title'>{title}</p>
      <input
        type='number'
        className='cart-item-amount'
        value={amount}
        onChange={handleUpdateAmount}
      />
    </li>
  );
};

export default CartItem;
