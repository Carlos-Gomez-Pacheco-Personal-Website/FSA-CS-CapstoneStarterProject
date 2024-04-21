// Cart Component
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

const Cart = ({ cart, updateCart, checkout, removeFromCart, setCart }) => {
  const history = useHistory();

  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleCheckout = async () => {
    await checkout({
      street,
      apartment,
      city,
      state,
      zipCode,
    });
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
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.map((item, key) =>
        item ? (
          <div key={key}>
            <p>{item.name}</p>
            <p>Price: {item.price}</p>

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
          </div>
        ) : null
      )}
      <form>
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
      </form>

      <button onClick={handleCheckout}>Checkout</button>
      <Link to="/">Return</Link>
    </div>
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
