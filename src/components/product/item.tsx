import { Link } from 'react-router-dom';
import { Product } from '../../graphql/products';
import { cartItemSelector } from '../../recoils/cart';
import { useRecoilState } from 'recoil';

const ProductItem = ({
  id,
  title,
  price,
  imageUrl,
  description,
  createdAt,
}: Product) => {
  const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector(id));
  const addToCart = () => setCartAmount((prev) => (prev || 0) + 1);

  return (
    <li className='product-item'>
      <Link to={`/products/${id}`}>
        <p className='product-item-title'>{title}</p>
        <img className='product-item-image' src={imageUrl} />
        <p className='product-item-price'>${price}</p>
      </Link>
      <button className='product-item-add-cart' onClick={addToCart}>
        담기
      </button>
      <p>{cartAmount || 0}</p>
    </li>
  );
};

export default ProductItem;
