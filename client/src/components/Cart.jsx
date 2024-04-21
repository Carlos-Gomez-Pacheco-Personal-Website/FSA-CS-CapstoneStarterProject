// Cart Component
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";

const Cart = ({ cart, updateCart, checkout, removeFromCart, setCart }) => {
  const history = useHistory();

  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleCheckout = async () => {
    const response = await checkout({
      street,
      apartment,
      city,
      state,
      zipCode,
      cart,
    });
    if (response) {
      setCart([]); // clear the cart in the frontend
      history.push("/checkout", {
        address: {
          street,
          apartment,
          city,
          state,
          zipCode,
        },
        cart,
      });
    }
  };

  const formValidator = () => {
    return (
      street == "" ||
      apartment == "" ||
      city == "" ||
      state == "" ||
      zipCode == ""
    );
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={7} className="mb-4">
          <Card className="product-container shadow">
            <Card.Body>
              <Card.Title>Cart Items</Card.Title>
              {!cart.length && <Card.Text>Your cart is empty</Card.Text>}
              {cart.map((item, key) => (
                <Card key={key} className="mb-3">
                  <Card.Img
                    variant="top"
                    src={item.imageUrl}
                    style={{ width: "50px", height: "50px" }}
                  />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>Price: {item.price}</Card.Text>

                    <button
                      disabled={item.quantity === 1}
                      onClick={() =>
                        updateCart({
                          product_id: item.product_id,
                          quantity: item.quantity - 1,
                        })
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCart({
                          product_id: item.product_id,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      +
                    </button>
                    <button onClick={() => removeFromCart(item.product_id)}>
                      Remove
                    </button>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="checkout-container shadow">
            <Card.Body>
              <Card.Title className="text-center">Checkout Address</Card.Title>
              <Form>
                <input
                  value={street}
                  placeholder="Street"
                  onChange={(ev) => setStreet(ev.target.value)}
                />
                <input
                  value={apartment}
                  placeholder="Apartment"
                  onChange={(ev) => setApartment(ev.target.value)}
                />
                <input
                  value={city}
                  placeholder="City"
                  onChange={(ev) => setCity(ev.target.value)}
                />
                <input
                  value={state}
                  placeholder="State"
                  onChange={(ev) => setState(ev.target.value)}
                />
                <input
                  value={zipCode}
                  placeholder="Zip Code"
                  onChange={(ev) => setZipCode(ev.target.value)}
                />
              </Form>

              <Button
                variant="primary"
                onClick={handleCheckout}
                disabled={formValidator() || !cart.length}
                className="mt-3 w-100"
              >
                Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

Cart.propTypes = {
  auth: PropTypes.any,
  cart: PropTypes.array,
  checkout: PropTypes.any,
  removeFromCart: PropTypes.func,
  setCart: PropTypes.func,
  updateCart: PropTypes.func,
};

export default Cart;
