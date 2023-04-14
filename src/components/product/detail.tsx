import { Product } from '../../graphql/products';

const ProductDetail = ({
  item: { title, imageUrl, description, price, createdAt },
}: {
  item: Product;
}) => {
  return (
    <div className='product-detail'>
      <p className='product-detail-title'>{title}</p>
      <img className='product-detail-image' src={imageUrl} />
      <p className='product-detail-description'>{description}</p>
      <p className='product-detail-price'>${price}</p>
      
    </div>
  );
};

export default ProductDetail;
