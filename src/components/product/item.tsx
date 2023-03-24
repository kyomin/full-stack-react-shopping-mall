import { Product } from "../../types";

const ProductItem = ({
  title,
  price,
  category,
  image,
  rating
}: Product) => (
  <li className="product-item">
    <p className="product-item-category">{category}</p>
    <p className="product-item-title">{title}</p>
    <img className="product-item-image" src={image} />
    <p className="product-item-price">${price}</p>
    <span className="product-item-rating">{rating.rate}</span>
  </li>
)

export default ProductItem