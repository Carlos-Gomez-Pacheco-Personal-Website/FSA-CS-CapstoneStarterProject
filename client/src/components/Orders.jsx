// Order Component
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

const Orders = ({ orders }) => {
  return (
    <Container className="C-Container">
      <div
        style={{
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "15px",
          marginTop: "20px",
          paddingBottom: "2px",
        }}
      >
        <p className="center">Orders</p>
      </div>
      {orders.length > 0 ? (
        <Row>
          {orders.map((order, index) => (
            <Col
              md={12}
              key={order.id}
              style={{
                borderBottom: "1px solid #ccc",
                paddingTop: "10px",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                borderRadius: "15px",
                marginBottom: "8px",
              }}
            >
              <p>
                N°{index + 1} Order: {order.id}
                {/* {order.date} */}
              </p>
              {/* <p>Total: {order.total}</p> */}
            </Col>
          ))}
        </Row>
      ) : (
        <p>No orders at this moment.</p>
      )}
    </Container>
  );
};

Orders.propTypes = {
  orders: PropTypes.array,
};

export default Orders;
