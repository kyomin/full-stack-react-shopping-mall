import { useRecoilValue } from 'recoil';
import { checkedCartState } from '../../recoils/cart';
import ItemData from '../cart/itemData';
import { SyntheticEvent } from 'react';

const WillPay = ({
  submitTitle,
  handleSubmit,
}: {
  submitTitle: string;
  handleSubmit: (e: SyntheticEvent) => void;
}) => {
  const checkedItems = useRecoilValue(checkedCartState);

  const totalPrice = checkedItems.reduce(
    (res, { product: { price, createdAt }, amount }) => {
      if (createdAt) {
        res += price * amount;
      }

      return res;
    },
    0
  );

  return (
    <div className='cart-willpay'>
      <ul>
        {checkedItems.map(
          ({ id, amount, product: { imageUrl, price, title, createdAt } }) => (
            <li key={id}>
              <ItemData imageUrl={imageUrl} price={price} title={title} />
              <p>수량: {amount}</p>
              <p>금액: {price * amount}</p>
              {!createdAt && <p className='deleted-item'>삭제된 상품입니다.</p>}
            </li>
          )
        )}
      </ul>
      <p>총 예상 결제금액: {totalPrice}</p>
      <button onClick={handleSubmit}>{submitTitle}</button>
    </div>
  );
};

export default WillPay;
