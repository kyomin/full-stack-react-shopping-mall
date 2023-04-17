import { useRecoilValue } from 'recoil';
import { checkedCartState } from '../../recoils/cart';
import ItemData from './itemData';
import { useNavigate } from 'react-router-dom';

const WillPay = () => {
  const navigate = useNavigate();
  const checkedItems = useRecoilValue(checkedCartState);

  const totalPrice = checkedItems.reduce((res, { price, amount }) => {
    res += price * amount;
    return res;
  }, 0);

  const handleSubmit = () => {
    if (checkedItems.length) {
      navigate('/payment');
    } else {
      alert('결제할 대상이 없습니다.');
    }
  };

  return (
    <div className='cart-willpay'>
      <ul>
        {checkedItems.map(({ id, imageUrl, price, title, amount }) => (
          <li key={id}>
            <ItemData imageUrl={imageUrl} price={price} title={title} />
            <p>수량: {amount}</p>
            <p>금액: {price * amount}</p>
          </li>
        ))}
      </ul>
      <p>총 예상 결제금액: {totalPrice}</p>
      <button onClick={handleSubmit}>결제하기</button>
    </div>
  );
};

export default WillPay;
