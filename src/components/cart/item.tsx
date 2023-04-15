import { useMutation } from 'react-query';
import { Cart } from '../../graphql/cart';
import { QueryKeys, getClient, graphqlFetcher } from '../../queryClient';
import { UPDATE_CART, DELETE_CART } from '../../graphql/cart';
import { SyntheticEvent } from 'react';

const CartItem = ({ id, imageUrl, price, title, amount }: Cart) => {
  const queryClient = getClient();

  // for update
  const { mutate: updateCart } = useMutation(
    // mutate function call
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher<Cart>(UPDATE_CART, { id, amount }),
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

    // 최소 수량 예외 처리(0은 삭제나 다름 없으므로 1이 최소)
    if (amount < 1) {
      return;
    }

    updateCart({ id, amount });
  };

  // for delete
  const { mutate: deleteCart } = useMutation(
    // mutate function call
    ({ id }: { id: string }) => graphqlFetcher<string>(DELETE_CART, { id }),
    {
      // When mutate is finished
      onSuccess: () => {
        /*
          위의 update 동작에서는 낙관적 업데이트 방식을 사용하였다.
          여기서는 invalidateQueries를 사용한다.

          invalidateQueries 메소드를 사용하면 개발자가 명시적으로 query가 stale되는(오래 되어서 무효하다고 판단하는) 지점을 찝어줄 수 있다. 
          해당 메소드가 호출되면 쿼리가 바로 stale되고, 리패치가 진행된다.

          이는 낙관적 업데이트와 달리, mutate api 호출 후, 다시 GET 요청을 보내는 단점이 있다.

          하지만 다음의 징점이 있다.
          만일 cart useQuery를 쓰는 뷰가 10개면,
          1개 업데이트로 전부 반영이 된다.
          이를 낙관적 업데이트로 처리하려 하면 10개의 긴 코드를 다 적용해줘야 한다.
        */
        queryClient.invalidateQueries(QueryKeys.CART);
      },
    }
  );
  const handleDeleteItem = () => {
    deleteCart({ id });
  };

  return (
    <li className='cart-item'>
      <input className='cart-item-check-inp' type='checkbox' />
      <img className='cart-item-image' src={imageUrl} />
      <p className='cart-item-price'>{price}</p>
      <p className='cart-item-title'>{title}</p>
      <input
        className='cart-item-amount'
        type='number'
        value={amount}
        min={1}
        onChange={handleUpdateAmount}
      />
      <button
        className='cart-item-delete-btn'
        type='button'
        onClick={handleDeleteItem}
      >
        삭제
      </button>
    </li>
  );
};

export default CartItem;
