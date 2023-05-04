import { SyntheticEvent } from 'react';
import { useMutation } from 'react-query';
import { ADD_PRODUCT, Product, Products } from '../../graphql/products';
import { QueryKeys, getClient, graphqlFetcher } from '../../queryClient';
import arrToObj from '../../utils/arrToObj';

type OmittedProduct = Omit<Product, 'id' | 'createdAt'>;

const AddForm = () => {
  const queryClient = getClient();

  const { mutate: addProduct } = useMutation(
    // mutate function call
    ({ title, imageUrl, price, description }: OmittedProduct) =>
      graphqlFetcher<Product>(ADD_PRODUCT, {
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
      },
    }
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = Number(formData.price);
    addProduct(formData as OmittedProduct);
  };

  return (
    <form className='product-add-form' onSubmit={handleSubmit}>
      <label>
        <p>상품명:</p>
        <input type='text' name='title' required />
      </label>
      <label>
        <p>이미지 경로:</p>
        <input type='text' name='imageUrl' required />
      </label>
      <label>
        <p>상품 가격:</p>
        <input type='number' name='price' required />
      </label>
      <label>
        <p>상품 상세:</p>
        <textarea name='description' />
      </label>
      <div className='submit-button-wrap'>
        <button type='submit'>등록</button>
      </div>
    </form>
  );
};

export default AddForm;
