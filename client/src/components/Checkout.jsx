// Checkout Component
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import {
  Container,
  Card,
  ListGroup,
  ListGroupItem,
  Button,
} from "react-bootstrap";

const Checkout = ({ orders }) => {
  const location = useLocation();
  const { address, cart } = location.state || {};

  const calculateTotalPrice = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  return (
    <Container className="my-5">
      {address && cart ? (
        <Card className="text-center">
          <Card.Header as="h2">Thank you for your purchase!</Card.Header>
          <ListGroup variant="flush">
            <ListGroupItem>Order Number: {orders.length + 1}</ListGroupItem>
            <ListGroupItem>
              Shipping Address: {address.street}, {address.apartment},{" "}
              {address.city}, {address.state}, {address.zipCode}
            </ListGroupItem>
            {cart.map((item, index) => (
              <ListGroupItem key={index + 1}>
                {index + 1}. {item.name}: ${item.price} x {item.quantity}
              </ListGroupItem>
            ))}
            <ListGroupItem>
              Total Price: ${calculateTotalPrice().toFixed(2)}
            </ListGroupItem>
          </ListGroup>
          <Card.Body>
            <Card.Text>Your items will be shipped shortly.</Card.Text>
            <Link to="/">
              {" "}
              <Button variant="success">Continue Shopping</Button>{" "}
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <p>No items in the cart.</p>
      )}
    </Container>
  );
};

Checkout.propTypes = {
  address: PropTypes.shape({
    apartment: PropTypes.any,
    city: PropTypes.any,
    state: PropTypes.any,
    street: PropTypes.any,
    zipCode: PropTypes.any,
  }),
  cart: PropTypes.array,
  orders: PropTypes.array.isRequired,
};

export default Checkout;
