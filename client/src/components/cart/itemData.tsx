import { Cart } from '../../graphql/cart';

const ItemData = ({
  imageUrl,
  price,
  title,
}: Pick<Cart, 'imageUrl' | 'price' | 'title'>) => (
  <>
    <img className='cart-item-image' src={imageUrl} />
    <p className='cart-item-price'>{price}</p>
    <p className='cart-item-title'>{title}</p>
  </>
);

export default ItemData;
