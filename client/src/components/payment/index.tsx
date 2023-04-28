import { useRecoilState } from 'recoil';
import { checkedCartState } from '../../recoils/cart';
import WillPay from '../willPay/willPay';
import PaymentModal from './modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { graphqlFetcher } from '../../queryClient';
import { EXECUTE_PAY } from '../../graphql/payment';

type PaymentInfos = string[];

const Payment = () => {
  const navigate = useNavigate();
  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const [modalShown, toggleModal] = useState(false);

  const { mutate: executePay } = useMutation((ids: PaymentInfos) =>
    graphqlFetcher(EXECUTE_PAY, { ids })
  );

  const showModal = () => {
    toggleModal(true);
  };

  const proceed = () => {
    // 결제 진행 => 실제 결제는 아니고, 결제가 완료된 품목들만 장바구니에서 제거 후
    const ids = checkedCartData.map(({ id }) => id);
    executePay(ids, {
      onSuccess: () => {
        setCheckedCartData([]);
        alert('결제가 완료되었습니다.');

        // 상품 목록으로 이동시키기
        // 결제가 완료되었으므로 결제 페이지를 사용자로부터 숨긴다.
        // replace true를 사용한다면, navigate에 적힌 주소로 넘어간 후 뒤로가기를 하더라도 방금의 페이지로 돌아오지 않는다        
        navigate('/products', { replace: true });
      }
    });    
  };

  const cancel = () => {
    toggleModal(false);
  };

  return (
    <div>
      <WillPay submitTitle='결제하기' handleSubmit={showModal} />
      <PaymentModal show={modalShown} proceed={proceed} cancel={cancel} />
    </div>
  );
};

export default Payment;
