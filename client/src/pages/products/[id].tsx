import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { graphqlFetcher, QueryKeys } from '../../queryClient';
import ProductDetail from '../../components/product/detail';
import { Product, GET_PRODUCT } from '../../graphql/products';

const ProductDetailPage = () => {
  const { id } = useParams();

  const { data } = useQuery<{ product: Product }>(
    [QueryKeys.PRODUCTS, id],
    () => graphqlFetcher<{ product: Product }>(GET_PRODUCT, { id })
  );

  if (!data) return null;

  return (
    <div>
      <h2>상품상세</h2>
      <ProductDetail item={data.product} />
    </div>
  );
};

export default ProductDetailPage;
