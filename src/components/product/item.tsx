import { Link } from 'react-router-dom'
import { Product } from "../../types";

const ProductItem = ({
  id,
  title,
  price,
  category,
  image,
  rating
}: Product) => (
  <li className="product-item">
    <Link to={`/products/${id}`}>
      <p className="product-item-category">{category}</p>
      <p className="product-item-title">{title}</p>
      <img className="product-item-image" src={image} />
      <p className="product-item-price">${price}</p>
      <span className="product-item-rating">{rating.rate}</span>
    </Link>
  </li>
)

export default ProductItem