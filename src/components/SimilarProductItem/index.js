// Write your code here
import './index.css'

const SimilarProductsItem = props => {
  const {product} = props
  console.log(product)
  const {imageUrl, brand, price, rating, title} = product

  return (
    <li className="list">
      <img src={imageUrl} alt="similar product" className="icon-similar" />
      <h1 className="title">{title}</h1>
      <p>by {brand}</p>
      <div className="price-rating-con">
        <p>{price}</p>
        <button type="button" className="rating-con">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </button>
      </div>
    </li>
  )
}

export default SimilarProductsItem
