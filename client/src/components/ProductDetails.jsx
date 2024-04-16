import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = ({
  addToCart,
  addFavorite,
  removeFavorite,
  fetchProduct,
  auth,
}) => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);

  const getReviews = async () => {
    const response = await fetch(`/api/products/${id}/reviews`);
    const data = await response.json();
    setReviews(data);
  };

  useEffect(() => {
    const getProduct = async () => {
      const product = await fetchProduct(id);
      setProduct(product);
    };

    getProduct();
    getReviews();
  }, [id, fetchProduct]);

  const submitReview = async () => {
    // Add your API endpoint to submit the review
    const response = await fetch(`/api/products/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify({
        userId: auth.id,
        content: review,
        rating: rating,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Review submitted!");
      setReview("");
    } else {
      alert("Failed to submit review");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img
        src={product.image}
        alt={product.name}
        className="img-class"
        width={200}
      />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Quantity available: {product.quantity}</p>
      <button onClick={() => addToCart && addToCart(product.id)}>
        Add to Cart
      </button>
      <button onClick={() => addFavorite && addFavorite(product.id)}>
        Add to Favorites
      </button>
      <button onClick={() => removeFavorite && removeFavorite(product.id)}>
        Remove from Favorites
      </button>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here"
      />
      <label htmlFor="rating">Rate the Product</label>
      <input
        name="rating"
        type="number"
        value={rating}
        max={5}
        min={1}
        onChange={(e) => setRating(e.target.value)}
      />
      <button onClick={submitReview}>Submit Review</button>
      <div>
        <h2>Reviews</h2>
        {reviews.map((review) => (
          <div key={review.id}>
            <p>User ID: {review.user_id}</p>
            <p>Content: {review.content}</p>
            <p>Rating: {review.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ProductDetails.propTypes = {
  addFavorite: PropTypes.func,
  addToCart: PropTypes.func,
  auth: PropTypes.shape({
    id: PropTypes.any,
  }),
  fetchProduct: PropTypes.func,
  removeFavorite: PropTypes.func,
};

export default ProductDetails;
