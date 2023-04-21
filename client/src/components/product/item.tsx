import { Link } from 'react-router-dom';
import { Product } from '../../graphql/products';
import { useMutation } from 'react-query';
import { graphqlFetcher } from '../../queryClient';
import { Cart, ADD_CART } from '../../graphql/cart';

const ProductItem = ({
  id,
  title,
  price,
  imageUrl,
  description,
  createdAt,
}: Product) => {
  const { mutate: addCart } = useMutation((id: string) =>
    graphqlFetcher<Cart>(ADD_CART, { id })
  );

  return (
    <li className='product-item'>
      <Link to={`/products/${id}`}>
        <p className='product-item-title'>{title}</p>
        <img className='product-item-image' src={imageUrl} />
        <p className='product-item-price'>${price}</p>
      </Link>
      <button className='product-item-add-cart' onClick={() => addCart(id)}>
        담기
      </button>
    </li>
  );
};

export default ProductItem;
