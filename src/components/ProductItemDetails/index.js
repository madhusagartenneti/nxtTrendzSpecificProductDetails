// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItems from '../SimilarProductItem'

import './index.css'

const pageStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: [],
    status: pageStatus.initial,
    count: 1,
    similarProducts: [],
  }

  componentDidMount() {
    this.getProductData()
  }

  getProductData = async () => {
    this.setState({status: pageStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    const updateData = {
      availability: fetchedData.availability,
      brand: fetchedData.brand,
      description: fetchedData.description,
      id: fetchedData.id,
      imageUrl: fetchedData.image_url,
      price: fetchedData.price,
      rating: fetchedData.rating,
      title: fetchedData.title,
      totalReviews: fetchedData.total_reviews,
    }

    console.log(response)
    if (response.status === 404) {
      this.setState({status: pageStatus.failure})
    }

    if (response.ok) {
      const updateSimilarProductsData = await fetchedData.similar_products.map(
        each => ({
          availability: each.availability,
          brand: each.brand,
          description: each.description,
          id: each.id,
          imageUrl: each.image_url,
          price: each.price,
          rating: each.rating,
          title: each.title,
          totalReviews: each.total_reviews,
        }),
      )
      this.setState({productData: updateData, status: pageStatus.success})
      this.setState({similarProducts: updateSimilarProductsData})
    }
  }

  btnIncrease = () => {
    const {count} = this.state
    this.setState({count: count + 1})
  }

  btnDecrease = () => {
    const {count} = this.state
    if (count !== 1) {
      this.setState({count: count - 1})
    }
  }

  pageSuccess = () => {
    const {productData, count, similarProducts} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData
    return (
      <div className="specific-product-container">
        <div className="specific-products-main">
          <div>
            <img className="specific-img" src={imageUrl} alt="product" />
          </div>
          <div className="specific-item-details">
            <h1 className="title">{title}</h1>
            <p className="cost">Rs {price}/-</p>
            <div className="rating-reviews">
              <div className="rating-box">
                <p className="rating">{rating}</p>

                <img
                  className="rating-icon"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="total-review">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="span-text">
              <span>Available:</span> {availability}
            </p>
            <p className="span-text">
              <span>Brand:</span> {brand}
            </p>
            <hr width="100%" size="1" align="center" color="gray" />
            <div className="cart-box">
              <button
                onClick={this.btnDecrease}
                type="button"
                className="countingBtn"
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
                onClick={this.btnIncrease}
                type="button"
                className="countingBtn"
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products">
          {similarProducts.map(each => (
            <SimilarProductItems similarProducts={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  pageProgress = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  pageFailure = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  specificProduct = () => {
    const {status} = this.state

    switch (status) {
      case pageStatus.success:
        return this.pageSuccess()
      case pageStatus.inProgress:
        return this.pageProgress()
      case pageStatus.failure:
        return this.pageFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details">{this.specificProduct()}</div>
      </>
    )
  }
}

export default ProductItemDetails
