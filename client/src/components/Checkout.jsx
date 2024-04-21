// Checkout Component
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

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
    <div>
      {address && cart ? (
        <>
          <h2>Thank you for your purchase!</h2>
          <p>Order Number: {orders.length}</p>
          <p>Total Price: {calculateTotalPrice()}</p>
          <p>
            Shipping Address: {address.street}, {address.apartment},{" "}
            {address.city}, {address.state}, {address.zipCode}
          </p>
          {cart.map((item, index) => (
            <div key={index}>
              <p>
                {item.name}: ${item.price} x {item.quantity}
              </p>
            </div>
          ))}
        </>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
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
