import { SyntheticEvent, createRef, useEffect, useRef, useState } from 'react';
import { Cart } from '../../graphql/cart';
import CartItem from './item';
import { useRecoilState } from 'recoil';
import { checkedCartState } from '../../recoils/cart';
import WillPay from '../willPay/willPay';
import { useNavigate } from 'react-router-dom';

const CartList = ({ items }: { items: Cart[] }) => {
  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();
  const navigate = useNavigate();
  const enabledItems = items.filter((item) => item.product.createdAt);

  const setAllCheckedFromItems = () => {
    // 개별 아이템 체크박스 선택 시
    if (!formRef.current) {
      return;
    }

    const data = new FormData(formRef.current);
    const selectedCount = data.getAll('select-item').length;
    const allChecked = selectedCount === enabledItems.length;
    formRef.current.querySelector<HTMLInputElement>('.select-all')!.checked =
      allChecked;
  };

  const setItemsCheckedFromAll = (targetInput: HTMLInputElement) => {
    // 전체선택 시
    const allChecked = targetInput.checked;
    checkboxRefs
      .filter((inputElem) => {
        return !inputElem.current!.disabled;
      })
      .forEach((inputElem) => {
        inputElem.current!.checked = allChecked;
      });
  };

  const handleCheckboxChanged = (e?: SyntheticEvent) => {
    if (!formRef.current) {
      return;
    }

    const targetInput = e?.target as HTMLInputElement;

    if (targetInput && targetInput.classList.contains('select-all')) {
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllCheckedFromItems();
    }

    const data = new FormData(formRef.current);
    setFormData(data);
  };

  const handleSubmit = () => {
    if (checkedCartData.length) {
      navigate('/payment');
    } else {
      alert('결제할 대상이 없습니다.');
    }
  };

  useEffect(() => {
    checkedCartData.forEach((item) => {
      const itemRef = checkboxRefs.find(
        (ref) => ref.current!.dataset.id === item.id
      );

      if (itemRef) {
        itemRef.current!.checked = true;
      }
    });
    setAllCheckedFromItems();
  }, []);

  // items, formData의 변화(update)가 감지될 때 안의 로직 실행
  useEffect(() => {
    // 선택된 상품들 recoil로 상태관리(recoil state에 업데이트)
    const checkedItems = checkboxRefs.reduce<Cart[]>((res, ref, i) => {
      if (ref.current!.checked) {
        res.push(items[i]);
      }
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [items, formData]);

  return (
    <div>
      <form ref={formRef} onChange={handleCheckboxChanged}>
        <label>
          <input className='select-all' name='select-all' type='checkbox' />
          전체 선택
        </label>
        <ul className='cart'>
          {items.map((item, i) => (
            <CartItem {...item} key={item.id} ref={checkboxRefs[i]} />
          ))}
        </ul>
      </form>
      <WillPay submitTitle='결제 화면으로' handleSubmit={handleSubmit} />
    </div>
  );
};

export default CartList;
