import { Link } from 'react-router-dom';
import { Product } from '../../graphql/products';

const ProductItem = ({
  id,
  title,
  price,
  imageUrl,
  description,
  createdAt,
}: Product) => (
  <li className='product-item'>
    <Link to={`/products/${id}`}>
      <p className='product-item-title'>{title}</p>
      <img className='product-item-image' src={imageUrl} />
      <p className='product-item-price'>${price}</p>
    </Link>
  </li>
);

export default ProductItem;
