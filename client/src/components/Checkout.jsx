import PropTypes from "prop-types";
// import { useLocation } from "react-router-dom";

const Checkout = ({ orders, cart, address, totalPrice }) => {
  // const location = useLocation();
  // const {cart, products} = location
  return (
    <div>
      <h2>Thank you for your purchase!</h2>
      <p>Order Number: {orders.length}</p>
      <p>
        Shipping Address: {address.street}, {address.apartment}, {address.city},{" "}
        {address.state}, {address.zipCode}
      </p>
      <p>Total Price: {totalPrice}</p>
      {cart.map((item, index) => (
        <div key={index}>
          <p>
            {item.name}: ${item.price} x {item.quantity}
          </p>
        </div>
      ))}
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
  totalPrice: PropTypes.any,
};

export default Checkout;
