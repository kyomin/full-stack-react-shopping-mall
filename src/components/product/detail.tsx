import { Product } from "../../types"

const ProductDetail = ({
  item: {
    category,
    title,    
    image,
    description,
    price,
    rating
  }
}: {item: Product}) => {
  return (
    <div className="product-detail">    
      <p className="product-detail-category">{category}</p>
      <p className="product-detail-title">{title}</p>
      <img className="product-detail-image" src={image} />
      <p className="product-detail-description">{description}</p>
      <p className="product-detail-price">${price}</p>
      <span className="product-detail-rating">{rating.rate}</span>    
    </div>
  )
}

export default ProductDetail