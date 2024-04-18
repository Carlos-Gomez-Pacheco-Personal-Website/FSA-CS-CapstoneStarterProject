import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

const ProductDetails = ({
  addToCart,
  addFavorite,
  removeFavorite,
  removeFromCart,
  fetchProduct,
  favorites,
  cart,
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
      getReviews();
    } else {
      alert("Failed to submit review");
    }
  };

  const isAddedtoCart = (product_id) => {
    return !!cart.find((item) => item.product_id === product_id);
  };

  const isFavorite = (product_id) => {
    return !!favorites.find((favorite) => favorite.product_id === product_id);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="product-details">
          <Card.Img variant="top" src={product.image} alt={product.name} />
          <Card.Body>
            <Card.Title className="m-3">{product.name}</Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Card.Text>Quantity available: {product.quantity}</Card.Text>
            {isAddedtoCart(product.id) ? (
              <Button
                onClick={() => removeFromCart && removeFromCart(product.id)}
              >
                Remove from Cart
              </Button>
            ) : (
              <Button onClick={() => addToCart && addToCart(product.id)}>
                Add to Cart
              </Button>
            )}
            {isFavorite(product.id) ? (
              <Button
                onClick={() => removeFavorite && removeFavorite(product.id)}
              >
                Remove from Favorites
              </Button>
            ) : (
              <Button onClick={() => addFavorite && addFavorite(product.id)}>
                Add to Favorites
              </Button>
            )}
          </Card.Body>
        </Col>
        <Col md={6} className="review-form">
          <Form>
            <Form.Group controlId="review">
              <Form.Label>Write your review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="rating">
              <Form.Label>Rate the Product</Form.Label>
              <Form.Control
                as="select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={submitReview}>
              Submit Review
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="reviews-list">
        <Col>
          <h2>Reviews</h2>
          {reviews.map((review) => (
            <Card key={review.id} className="review-item">
              <Card.Body>
                <Card.Text>
                  {auth.username} | Stars: {review.rating}
                </Card.Text>
                <Card.Text className="review-form">{review.content}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

ProductDetails.propTypes = {
  addFavorite: PropTypes.func,
  addToCart: PropTypes.func,
  auth: PropTypes.shape({
    id: PropTypes.any,
    username: PropTypes.string,
  }),
  cart: PropTypes.array,
  favorites: PropTypes.array,
  fetchProduct: PropTypes.func,
  removeFavorite: PropTypes.func,
  removeFromCart: PropTypes.func,
};

export default ProductDetails;
