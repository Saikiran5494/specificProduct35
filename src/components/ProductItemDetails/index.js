// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    productDetails: {},
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  decreaseClicked = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  increaseClicked = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const similarProducts = data.similar_products.map(each =>
        this.getFormattedData(each),
      )
      this.setState({
        productDetails: updatedData,
        similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProductDetails = () => {
    const {productDetails, similarProducts, quantity} = this.state
    const {
      availability,
      price,
      rating,
      title,
      brand,
      description,
      imageUrl,
      totalReviews,
    } = productDetails
    return (
      <div>
        <div className="top-container">
          <img src={imageUrl} alt="product" className="image-detail" />
          <div className="des-cont">
            <h1 className="heading">{title}</h1>
            <p className="price">Rs {price}</p>
            <div className="rating-review-con">
              <p>{rating}</p>
              <button type="button" className="rating-con">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </button>
              <p>{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="heading">Available: {availability}</p>
            <p className="heading">Brand: {brand}</p>
            <hr />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-button"
                onClick={this.decreaseClicked}
                data-testid="minus"
              >
                <BsDashSquare className="icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                data-testid="plus"
                type="button"
                className="quantity-button"
                onClick={this.increaseClicked}
              >
                <BsPlusSquare className="icon" />
              </button>
            </div>
            <button type="button" className="cart-button">
              Add TO CART
            </button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="similar-product-con">
          {similarProducts.map(each => (
            <SimilarProductItem product={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-image"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="cart-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoading = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductsDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetails()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.loading:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderProductsDetailsView()}
      </div>
    )
  }
}

export default ProductItemDetails
