import { Link } from 'react-router-dom';
import {
  DELETE_PRODUCT,
  MutableProduct,
  Product,
  UPDATE_PRODUCT,
} from '../../graphql/products';
import { useMutation } from 'react-query';
import { QueryKeys, getClient, graphqlFetcher } from '../../queryClient';
import { SyntheticEvent } from 'react';
import arrToObj from '../../utils/arrToObj';

const AdminItem = ({
  id,
  title,
  price,
  imageUrl,
  description,
  createdAt,
  idEditing,
  startEdit,
  cancelEdit,
}: Product & {
  idEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
}) => {
  const queryClient = getClient();

  const { mutate: updateProduct } = useMutation(
    // mutate function call
    ({ title, imageUrl, price, description }: MutableProduct) =>
      graphqlFetcher<Product>(UPDATE_PRODUCT, {
        id,
        title,
        imageUrl,
        price,
        description,
      }),
    {
      onSuccess: () => {
        /**
         * invalidateQueries 메소드를 사용하면 개발자가 명시적으로 query가 stale되는(오래 되어서 무효하다고 판단하는) 지점을 찝어줄 수 있다.
         * 해당 메소드가 호출되면 쿼리가 바로 stale되고, 리패치가 진행된다.
         */
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true,
        });

        // 수정 후 수정 중인 상태 cancel
        cancelEdit();
      },
    }
  );

  const { mutate: deleteProduct } = useMutation(
    // mutate function call
    ({ id }: { id: string }) =>
      graphqlFetcher<Product>(DELETE_PRODUCT, {
        id,
      }),
    {
      onSuccess: () => {
        /**
         * invalidateQueries 메소드를 사용하면 개발자가 명시적으로 query가 stale되는(오래 되어서 무효하다고 판단하는) 지점을 찝어줄 수 있다.
         * 해당 메소드가 호출되면 쿼리가 바로 stale되고, 리패치가 진행된다.
         */
        queryClient.invalidateQueries(QueryKeys.PRODUCTS, {
          exact: false,
          refetchInactive: true,
        });
      },
    }
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = Number(formData.price);
    updateProduct(formData as MutableProduct);
  };

  const deleteItem = () => {
    deleteProduct({ id });
  };

  // 수정 중일 때(idEditing === true)는 폼 형태로 띄우면 된다.
  if (idEditing) {
    return (
      <li className='product-edit-form'>
        <form onSubmit={handleSubmit}>
          <label>
            <p>상품명:</p>
            <input type='text' name='title' required defaultValue={title} />
          </label>
          <label>
            <p>이미지 경로:</p>
            <input
              type='text'
              name='imageUrl'
              required
              defaultValue={imageUrl}
            />
          </label>
          <label>
            <p>상품 가격:</p>
            <input type='number' name='price' required defaultValue={price} />
          </label>
          <label>
            <p>상품 상세:</p>
            <textarea name='description' defaultValue={description} />
          </label>
          <div className='button-wrap'>
            <button type='submit'>저장</button>
            <button type='button' onClick={cancelEdit}>
              취소
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className='product-item'>
      <Link to={`/products/${id}`}>
        <p className='product-item-title'>{title}</p>
        <img className='product-item-image' src={imageUrl} />
        <p className='product-item-price'>₩{price}</p>
      </Link>
      {!createdAt && <p className='deleted-item'>삭제된 상품</p>}
      <div className='button-wrap'>
        <button onClick={startEdit}>수정</button>
        <button onClick={deleteItem}>삭제</button>
      </div>
    </li>
  );
};

export default AdminItem;
